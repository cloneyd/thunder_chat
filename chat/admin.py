from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.Chat)
admin.site.register(models.ChatUser)
admin.site.register(models.Message)
