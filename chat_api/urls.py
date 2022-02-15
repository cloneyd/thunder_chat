from django.urls import path, include
from . import views

urlpatterns = [
    path('chats', views.chats),
]
