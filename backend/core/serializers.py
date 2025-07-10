from rest_framework import serializers
from .models import User, Trip, TripMember, Notification, Review
from taggit.serializers import (TagListSerializerField, TaggitSerializer)
from django.contrib.auth.password_validation import validate_password

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

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    interests = TagListSerializerField(required=False)
    profile_photo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'bio', 'profile_photo', 'interests']

    def create(self, validated_data):
        interests = validated_data.pop('interests', [])
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            bio=validated_data.get('bio', ''),
            profile_photo=validated_data.get('profile_photo', None)
        )
        user.set_password(validated_data['password'])
        user.save()
        if interests:
            user.interests.set(interests)
        return user

class ReviewSerializer(serializers.ModelSerializer):
    reviewer = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'trip', 'reviewer', 'rating', 'comment', 'created_at']
        read_only_fields = ['reviewer', 'created_at']