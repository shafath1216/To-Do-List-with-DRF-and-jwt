from django.shortcuts import render

from rest_framework import serializers
from django.contrib.auth.models import User
from  rest_framework.views import APIView
from .serializers import RegisterSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from  rest_framework.permissions import AllowAny

class RegisterAPIView(APIView):
  permission_classes = [AllowAny]
  def post(self,request):
    serializer=RegisterSerializer(data=request.data)
    if serializer.is_valid():
      try:
        user=serializer.save()
        refresh=RefreshToken.for_user(user)
        return Response({"refresh":str(refresh),"access":str(refresh.access_token),"message":"User created"},status=status.HTTP_201_CREATED)
      except Exception as e:
        return Response({"error":str(e)},status=status.HTTP_400_BAD_REQUEST) 
    else:
      return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class logoutAPIView(APIView):
  permission_classes=[AllowAny]
  def post(self,request):
    try:
      token=request.data['refresh']
      refresh=RefreshToken(token)
      refresh.blacklist()
      return Response({"message":"success"},status=status.HTTP_200_OK)
    except Exception as e:
      return Response({"message":"logout uncsuccessful"},status=status.HTTP_400_BAD_REQUEST)
      