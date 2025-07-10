from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter

from .views import (
    TripViewSet,
    TripMemberViewSet,
    UserViewSet,
    NotificationViewSet,
    RegisterAPIView,
    ReviewViewSet
)

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Main router
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'trips', TripViewSet)
router.register(r'members', TripMemberViewSet, basename='tripmember')
router.register(r'notifications', NotificationViewSet, basename='notification')

# Nested router: /trips/<trip_id>/reviews/
trip_router = NestedDefaultRouter(router, r'trips', lookup='trip')
trip_router.register(r'reviews', ReviewViewSet, basename='trip-reviews')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(trip_router.urls)),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
