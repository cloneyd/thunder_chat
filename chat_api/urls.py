from django.urls import path, include
from . import views

urlpatterns = [
    path('chats', views.chats),
    path('create-chat', views.create_chat),
]
