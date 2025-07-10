from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Trip, TripMember, User, Review
from .serializers import TripSerializer, TripMemberSerializer, UserSerializer, NotificationSerializer, Notification, ReviewSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django_filters.rest_framework import DjangoFilterBackend
from .filters import TripFilter
from channels.db import database_sync_to_async
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegistrationSerializer
from rest_framework.exceptions import PermissionDenied
from django.utils.timezone import now


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["GET", "PUT"], url_path="profile")
    def profile(self, request):
        if request.method == "GET":
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        elif request.method == "PUT":
            serializer = self.get_serializer(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)



class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TripFilter

    def perform_create(self, serializer):
        trip = serializer.save(creator=self.request.user)
        TripMember.objects.create(
            user=self.request.user,
            trip=trip,
            role='admin',
            status='approved'
        )

    @action(detail=True, methods=['POST'])
    def join_trip(self, request, pk=None):
        trip = self.get_object()
        user = request.user

        existing_member = TripMember.objects.filter(trip=trip, user=user).first()
        if existing_member:
            return Response(
                {"error": "You have already requested to join or are already a member of this trip."},
                status=status.HTTP_400_BAD_REQUEST
            )

        TripMember.objects.create(
            user=user,
            trip=trip,
            role='member',
            status='pending'
        )

        # ⬇️ Send notification to trip admin
        self.send_notification_to_admin(trip, user)

        return Response(
            {"message": "Join request sent successfully."},
            status=status.HTTP_201_CREATED
        )

    @database_sync_to_async
    def send_notification_to_admin(self, trip, requesting_user):
        from .models import Notification  # avoid circular import
        admins = TripMember.objects.filter(trip=trip, role='admin', status='approved')
        for admin in admins:
            Notification.objects.create(
                user=admin.user,
                content=f"{requesting_user.username} requested to join your trip: {trip.title}"
            )

class TripMemberViewSet(viewsets.ModelViewSet):
    serializer_class = TripMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = TripMember.objects.all()
        trip_id = self.request.query_params.get('trip', None)
        if trip_id is not None:
            queryset = queryset.filter(trip_id=trip_id)
        return queryset

    def update(self, request, *args, **kwargs):
        trip_member = self.get_object()

        # Ensure the user is an admin of the trip
        admin_member = TripMember.objects.filter(
            trip=trip_member.trip,
            user=request.user,
            role='admin'
        ).first()

        if not admin_member:
            return Response(
                {"error": "Only trip admins can approve or reject join requests."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Only allow updating the 'status' field
        if 'status' not in request.data or len(request.data.keys()) > 1:
            return Response(
                {"error": "Only the status field can be updated."},
                status=status.HTTP_400_BAD_REQUEST
            )

        old_status = trip_member.status
        response = super().update(request, *args, **kwargs)

        # Only notify if status has changed
        new_status = request.data.get('status')
        if old_status != new_status:
            self.send_status_notification(trip_member, new_status)

        return response

    def send_status_notification(self, trip_member, new_status):
        from .models import Notification
        trip = trip_member.trip
        user = trip_member.user

        if new_status == 'approved':
            content = f"✅ Your request to join '{trip.title}' was approved!"
        elif new_status == 'rejected':
            content = f"❌ Your request to join '{trip.title}' was rejected."
        else:
            return  # Don't notify for other statuses

        Notification.objects.create(
            user=user,
            content=content
        )

    @action(detail=False, methods=['delete'], url_path=r'trips/(?P<trip_id>[^/.]+)/leave')
    def leave_trip(self, request, trip_id=None):
        user = request.user
        trip_member = TripMember.objects.filter(trip_id=trip_id, user=user).first()
        if not trip_member:
            return Response({'error': 'You are not a member of this trip.'}, status=status.HTTP_404_NOT_FOUND)
        if trip_member.status == 'pending' or trip_member.status == 'approved':
            trip_member.delete()
            return Response({'message': 'You have left the trip.'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Cannot leave this trip.'}, status=status.HTTP_400_BAD_REQUEST)


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=True, methods=['POST'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({"status": "marked as read"})


class RegisterAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        trip_id = self.kwargs.get('trip_pk')
        if trip_id:
            return Review.objects.filter(trip__id=trip_id)
        return Review.objects.filter(reviewer=self.request.user)

    def perform_create(self, serializer):
        trip = serializer.validated_data['trip']
        user = self.request.user
        if trip.end_date > now().date():
            raise PermissionDenied("Trip has not ended yet.")
        from .models import TripMember
        is_approved = TripMember.objects.filter(trip=trip, user=user, status='approved').exists()
        if not is_approved:
            raise PermissionDenied("You are not an approved member of this trip.")
        if Review.objects.filter(trip=trip, reviewer=user).exists():
            raise PermissionDenied("You have already reviewed this trip.")
        serializer.save(reviewer=user)

    def perform_update(self, serializer):
        if self.get_object().reviewer != self.request.user:
            raise PermissionDenied("You can only edit your own review.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.reviewer != self.request.user:
            raise PermissionDenied("You can only delete your own review.")
        instance.delete()