from django.contrib.auth import get_user_model
from django.db import models


User = get_user_model()


class ChatUser(models.Model):
    user = models.OneToOneField(User, related_name='friends', on_delete=models.CASCADE)
    friends = models.ManyToManyField('self', blank=True)

    def __str__(self):
        return self.user.username


class Chat(models.Model):
    name = models.TextField()
    members = models.ManyToManyField(ChatUser, related_name='chats', blank=True)

    def __str__(self):
        return self.name


# Create your models here.
class Message(models.Model):
    chat_user = models.ForeignKey(ChatUser, related_name='messages', on_delete=models.CASCADE)
    chat = models.ForeignKey(Chat, related_name="messages", null=True, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content