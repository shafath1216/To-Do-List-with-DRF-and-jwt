from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TodoList

class todoSerializer(serializers.ModelSerializer):
  class Meta:
    model=TodoList
    fields=['user','date','todo','id']

  def create(self,validated_data):
    user=self.context['request'].user
    todo=self.Meta.model.objects.create(
    user=user,
    date=validated_data['date'],
    todo=validated_data['todo']
    )  
    return todo

