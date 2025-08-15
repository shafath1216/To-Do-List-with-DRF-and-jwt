from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import TodoList
from .serializers import todoSerializer
from django.utils.dateparse import parse_date

class AddTodoAPIView(APIView):
 permission_classes=[IsAuthenticated]
 
 def post(self,request):
  date=request.data.get('date')
  todo=request.data.get('todo')
  print(f'{date}+{todo}')
  if not date or not todo:
   return Response({"error":"Please include date and todo both"},status=status.HTTP_400_BAD_REQUEST)
  
  
  try:
   todoobject=TodoList(user=request.user,date=date,todo=todo)
   todoobject.save()
   return Response({"message":"object created successfully"},status=status.HTTP_201_CREATED)
  except Exception as e:
   return Response({"error":"something went wrong"},status=status.HTTP_400_BAD_REQUEST)
  


# Create your views here.
class GetTodoAPIView(APIView):
 permission_classes=[IsAuthenticated]
 def get(self,request):
  try: 
   todoobject=TodoList.objects.filter(user=request.user).all()
   if not todoobject.exists():
    raise Exception('No result found')
   else:
    serializer=todoSerializer(todoobject,many=True,context={"request":request})
    return Response(serializer.data,status=status.HTTP_200_OK)
  except Exception as e:
    return Response({"error":str(e)},status=status.HTTP_400_BAD_REQUEST) 
  
class EditTodoAPIView(APIView):
 permission_classes=[IsAuthenticated]
 def patch(self,request,id):
   try:
    todoobject=TodoList.objects.get(id=id,user=request.user)
    todoobject.date=request.data.get('date')
    todoobject.todo=request.data.get('todo')
    todoobject.save()
    return Response({"message":"Modified Successfully"},status=status.HTTP_200_OK)
   except TodoList.DoesNotExist:
    return Response({"message":"Object does not exist"},status=status.HTTP_404_NOT_FOUND)
   except Exception as e:
    return Response({"message":str(e)},status=status.HTTP_400_BAD_REQUEST)     

class DeleteAPIView(APIView):
 permission_classes=[IsAuthenticated]
 def delete(self,request,id):
    try:
     todoobject=TodoList.objects.get(id=id,user=request.user)
     todoobject.delete()
     return Response({"message":"successfully deleted"},status=status.HTTP_200_OK)
    except TodoList.DoesNotExist:
     return Response({"message":"Object does not exist"},status=status.HTTP_404_NOT_FOUND) 
    except Exception as e:
     return Response({"message":str(e)},status=status.HTTP_400_BAD_REQUEST)

class SearchByDateAPIView(APIView):
 permission_classes=[IsAuthenticated]
 def get(self,request):
    try:
     date=request.query_params.get('date')
     date_obj=parse_date(date)
     if not date_obj:
      return Response({"message":"No todo found on this date"},status=status.HTTP_404_NOT_FOUND)
     todoobject=TodoList.objects.filter(date__date=date_obj,user=request.user)
     if not todoobject.exists():
      return Response({"error":"invalid date"},status=status.HTTP_400_BAD_REQUEST)
     serializer=todoSerializer(todoobject,many=True)
     return Response(serializer.data,status=status.HTTP_200_OK)
    
    except Exception as e:
     return Response({"message":str(e)},status=status.HTTP_400_BAD_REQUEST)              