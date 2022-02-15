from rest_framework.serializers import Serializer, ModelSerializer, CharField, EmailField
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'date_joined']

class RegisterRequestSerializer(Serializer):
    model = User

    username = CharField(required=True)
    first_name = CharField(required=True)
    last_name = CharField(required=True)
    email = EmailField(required=True)
    password = CharField(required=True)


class LoginRequestSerializer(Serializer):
    model = User

    username = CharField(required=True)
    password = CharField(required=True)


class TokenSerializer(ModelSerializer):

    class Meta:
        model = Token
        fields = ['key']
