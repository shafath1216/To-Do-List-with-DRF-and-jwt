from django.urls import path
from .views import RegisterAPIView,logoutAPIView


urlpatterns=[
path('register/',RegisterAPIView.as_view(),name='register'),
path('logout/',logoutAPIView.as_view(),name='logout')


]


