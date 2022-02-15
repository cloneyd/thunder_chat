import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth import get_user_model

from . import models

User = get_user_model()


def message_to_json(message):
    return {
        'username': message.chat_user.user.username,
        'content': message.content
    }


def messages_to_json(messages):
    return [
        message_to_json(message)
        for message in messages
    ]


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['room_id']
        self.chat = models.Chat.objects.get(id=self.chat_id)
        self.members_count = len(self.chat.members.all())
        self.room_group_name = f'chat_{self.chat_id}'

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        user = self.scope['user']

        if user.is_authenticated:
            self.accept()
            self.send(json.dumps({
                'command': 'chat_data',
                'meta': {
                    'username': user.username,
                    'chatName': self.chat.name,
                    'membersCount': self.members_count
                }
            }))
        else:
            self.close()

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def fetch_messages(self, text_data_json):
        chat_messages = models.Message.objects.filter(chat_id=self.chat_id)
        chat_messages_json = messages_to_json(chat_messages)
        self.send(json.dumps({
            'command': 'messages',
            'messages': chat_messages_json
        }))

    def join_chat(self):
        pass

    def leave_chat(self):
        pass

    def send_room(self, message):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "send_chat",
                "username": self.scope["user"].username,
                "message": message,
            }
        )

    def send_chat(self, text_data_json):
        chat_user = models.ChatUser.objects.get(user=self.scope['user'])
        content = text_data_json['content']

        models.Message.objects.create(
            chat_user=chat_user,
            chat=self.chat,
            content=content
        )
        message = {
            'username': self.scope['user'].username,
            'content': content
        }

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'send_message',
                'message': message
            }
        )

    commands = {
        'fetch_messages': fetch_messages,
        'join_chat': join_chat,
        'leave_chat': leave_chat,
        'send_chat': send_chat
    }

    def receive(self, text_data=None, bytes_data=None):
        """ Receive data from the WebSocket
        :param text_data:
        :param bytes_data:
        :return: None
        """

        text_data_json = json.loads(text_data)['data']
        self.commands[text_data_json['command']](self, text_data_json)

    def send_message(self, event):
        """ Send data over WebSocket
        :param event:
        :return: None
        """

        message = event['message']

        self.send(text_data=json.dumps({
            'command': 'new_message',
            'message': message
        }))
