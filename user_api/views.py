from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from user_api.serializers import UserSerializer, LoginRequestSerializer, RegisterRequestSerializer
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.db.utils import IntegrityError
from django.contrib.auth.models import User

import chat

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginRequestSerializer(data=request.data)

    if serializer.is_valid():
        authenticated_user = authenticate(**serializer.validated_data)

        if authenticated_user is not None:
            print(authenticated_user)
            login(request, authenticated_user)
            return Response({'status': 'Success'})
        else:
            return Response({'error': 'Invalid credentials'}, status=403)
    else:
        return Response(serializer.errors, status=400)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterRequestSerializer(data=request.data)

    if serializer.is_valid():
        data = serializer.validated_data

        try:
            user = User.objects.create(
                username=data.get('username'),
                first_name=data.get('first_name'),
                last_name=data.get('last_name'),
                email=data.get('email'),
                password=make_password(
                    data.get('password')
                )
            )
            chat.models.ChatUser.objects.create(
                user=user
            )
        except IntegrityError:
            return Response({'error': 'User with this username or email is already created'}, status=403)
        else:
            return Response({'status': 'Success'})
    else:
        return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def user(request):
    data = request.data
    response = Response(status=200)

    try:
        User.objects.get(username=data['username'])
    except User.DoesNotExist:
        response = Response(status=202)

    return response


@api_view()
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def user_data(request):
    return Response({
        'data': UserSerializer(request.user).data
    })


