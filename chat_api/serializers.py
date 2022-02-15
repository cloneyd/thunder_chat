from rest_framework.serializers import Serializer, CharField, ListField, IntegerField
from chat.models import Chat


class ChatSerializer(Serializer):
    model = Chat

    name = CharField(required=True)
    members = ListField(child=IntegerField)