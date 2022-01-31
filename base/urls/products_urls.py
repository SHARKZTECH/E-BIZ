from ..views.products_views import *
from django.urls import path

urlpatterns = [
    path("create/", createProduct, name="product-create"),
    path("upload/", uploadImage, name="upload-image"),
    path('top/', getTopProducts, name='top-products'),
    path("update/<str:pk>/", updateProduct, name="product-update"),
    path("delete/<str:pk>/", deleteProduct, name="product-delete"),
    path("<str:pk>/review/", createProductReview, name="create-review"),
    path("<str:pk>/", getProduct, name="product"),
    path("", getProducts, name="products"),
]
