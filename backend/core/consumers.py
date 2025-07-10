import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.conf import settings
from .models import Trip, TripMember, Message
from urllib.parse import parse_qs
import jwt

User = get_user_model()

class TripChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.trip_id = self.scope['url_route']['kwargs']['trip_id']
        self.room_group_name = f'trip_{self.trip_id}'
        self.user = await self.get_user_from_jwt()
        if not self.user or not await self.is_approved_member():
            await self.close()
            return
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        if not message or not self.user:
            return
        # Save message to DB
        await self.save_message(message)
        # Notify other members
        await self.notify_other_members()
        # Broadcast to group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': self.user.username,
                'timestamp': self.get_timestamp(),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender'],
            'timestamp': event['timestamp'],
        }))

    @database_sync_to_async
    def is_approved_member(self):
        return TripMember.objects.filter(trip_id=self.trip_id, user=self.user, status='approved').exists()

    @database_sync_to_async
    def save_message(self, content):
        return Message.objects.create(trip_id=self.trip_id, sender=self.user, content=content)

    @database_sync_to_async
    def notify_other_members(self):
        from .models import Notification, TripMember, Trip
        trip = Trip.objects.get(id=self.trip_id)
        approved_members = TripMember.objects.filter(trip=trip, status='approved').exclude(user=self.user)
        for member in approved_members:
            Notification.objects.create(
                user=member.user,
                content=f'💬 New message in "{trip.title}"'
            )

    def get_timestamp(self):
        from datetime import datetime
        return datetime.utcnow().isoformat() + 'Z'

    async def get_user_from_jwt(self):
            from rest_framework_simplejwt.authentication import JWTAuthentication
            from jwt.exceptions import InvalidTokenError

            token = None

            # Check query string for token
            query_string = self.scope.get('query_string', b'').decode()
            if query_string:
                params = parse_qs(query_string)
                token_list = params.get('token') or params.get('access')
                if token_list:
                    token = token_list[0]

            # Check headers for token
            if not token:
                headers = dict(self.scope.get('headers', []))
                auth_header = headers.get(b'sec-websocket-protocol') or headers.get(b'authorization')
                if auth_header:
                    token = auth_header.decode().split()[-1]

            if not token:
                return None

            try:
                validated_token = UntypedToken(token)  # Token structure and expiry check
                user = JWTAuthentication().get_user(validated_token)
                return user
            except (InvalidToken, TokenError, User.DoesNotExist):
                return None
