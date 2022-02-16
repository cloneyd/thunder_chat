from chat_api.serializers import ChatSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from django.db.utils import IntegrityError
from rest_framework_simplejwt.authentication import JWTAuthentication

import chat


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def chats(request):
    chat_user = chat.models.ChatUser.objects.get(user=request.user)
    username = chat_user.user.username
    chats_list = chat_user.chats.all()

    chats_data = []

    for chat_room in chats_list:
        messages = chat_room.messages.all()

        if messages:
            content = messages.last().content

            if len(content) > 146:
                content = content[:146] + '...'
            data = {
                'id': chat_room.pk,
                'name': chat_room.name,
                'lastMessageUser': messages.last().chat_user.user.username,
                'lastMessageContent': content
            }
        else:
            data = {
                'id': chat_room.pk,
                'name': chat_room.name,
                'lastMessageUser': "",
                'lastMessageContent': ""
            }

        chats_data.append(data)

    return Response({
        'username': username,
        'chats': chats_data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def create_chat(request):
    chat_user = chat.models.ChatUser.objects.get(user=request.user)
    serializer = ChatSerializer(data=request.data)

    if serializer.is_valid():
        data = serializer.validated_data
        try:
            new_chat = chat.models.Chat.objects.create(
                name=data.get('name')
            )
            new_chat.members.add(chat_user.pk)
            for user_id in data.get('members'):
                new_chat.members.add(user_id)
            print(new_chat)
        except IntegrityError:
            return Response({'error': 'Cannot create chat'}, status=500)
        else:
            return Response({'status': 'Success'})

    else:
        return Response(serializer.errors, status=400)
