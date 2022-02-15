from django.contrib.auth import get_user_model
from django.shortcuts import render, get_object_or_404
# from django.http import HttpResponse
from . import models

User = get_user_model()


def index(request):
    return render(request, 'chat/index.html', {})


def room(request, room_name):
    # if User.is_anonymous:
    #     return HttpResponse('You should login to see this page.')
    # else:
    return render(request, 'chat/room.html', {
        'room_name': room_name
    })


def get_chat(chat_id):
    return get_object_or_404(models.Chat, id=chat_id)


def get_messages(self, chat_id):
    chat = get_chat(chat_id)

    return chat.messages.order_by('-date').all()


def get_chat_user(username):
    user = get_object_or_404(User, username=username)

    return get_object_or_404(models.ChatUser, user=user)
