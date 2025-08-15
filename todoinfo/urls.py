from django.urls import path
from .views import AddTodoAPIView,DeleteAPIView,EditTodoAPIView,SearchByDateAPIView,GetTodoAPIView

urlpatterns=[
path('add/',AddTodoAPIView.as_view(),name='add'),
path('delete/<int:id>/',DeleteAPIView.as_view(),name='delete'),
path('edit/<int:id>/',EditTodoAPIView.as_view(),name='edit'),
path('search/',SearchByDateAPIView.as_view(),name='search'),
path('get/',GetTodoAPIView.as_view(),name='get')
]