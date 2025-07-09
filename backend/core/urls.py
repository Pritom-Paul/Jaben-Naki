from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, TripMemberViewSet, UserViewSet, NotificationViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'trips', TripViewSet)
router.register(r'members', TripMemberViewSet, basename='tripmember')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
