from rest_framework import serializers
from .models import User, Trip, TripMember, Notification
from taggit.serializers import (TagListSerializerField, TaggitSerializer)

class UserSerializer(serializers.ModelSerializer):
    interests = TagListSerializerField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'bio', 'profile_photo', 'interests']


class TripSerializer(TaggitSerializer, serializers.ModelSerializer):
    tags = TagListSerializerField()
    creator = serializers.StringRelatedField()

    class Meta:
        model = Trip
        fields = '__all__'


class TripMemberSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    trip = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = TripMember
        fields = ['id', 'user', 'trip', 'role', 'status', 'joined_at']
        read_only_fields = ['user', 'trip', 'role', 'joined_at']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'content', 'is_read', 'created_at']