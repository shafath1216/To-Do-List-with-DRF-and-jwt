from django.contrib import admin
from .models import TodoList

class TodoAdmin(admin.ModelAdmin):
  list_display=['date','todo','id']

admin.site.register(TodoList,TodoAdmin)  
# Register your models here.
