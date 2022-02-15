from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('user-data/', views.user_data, name='user_data'),
    path('user', views.user, name='user'),
    path('login', views.login_view, name='login'),
    path('register', views.register, name='register'),
    path('token/obtain', TokenObtainPairView.as_view(), name='token_obtain'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]
