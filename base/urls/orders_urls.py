from ..views.orders_views import *
from django.urls import path

urlpatterns = [
    path("", getOrders, name="orders"),
    path("add/", addOrderItems, name="oders-add"),
    path("myorders/", getMyOrders, name="myOrders"),
    path("<str:pk>/", getOrderById, name="get-oder"),
    path("<str:pk>/pay/", updateOrderToPaid, name="pay"),
    path("<str:pk>/deliver/", updateOrderToDelivered, name="deliver"),
]
