from django.contrib.auth.models import AbstractUser
from django.db import models
from taggit.managers import TaggableManager

class User(AbstractUser):
    bio = models.TextField(blank=True)
    profile_photo = models.ImageField(upload_to='profiles/', blank=True, null=True)
    interests = TaggableManager(blank=True)

    def __str__(self):
        return self.username
class Trip(models.Model):
    title = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    tags = TaggableManager(blank=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_trips')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class TripMember(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=(('admin', 'Admin'), ('member', 'Member')))
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'trip')

    def __str__(self):
        return f"{self.user.username} - {self.trip.title}"


class Message(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username}: {self.content[:20]}..."

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"To {self.user.username}: {self.content[:30]}..."