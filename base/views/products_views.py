from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from ..products import products
from ..models import Products, Review
from ..serializer import ProductSerializer
from rest_framework import status


@api_view(["GET"])
def getProducts(request):
    query = request.query_params.get('keyword')
    if query == None:
        query = ''

    products = Products.objects.filter(name__icontains=query)

    page = request.query_params.get('page')
    print("page:"+page)
    paginator = Paginator(products, 10)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1

    page = int(page)
    serializer = ProductSerializer(products, many=True)
    return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages})


@api_view(['GET'])
def getTopProducts(request):
    products = Products.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def getProduct(request, pk):
    product = Products.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminUser])
def createProduct(request):
    user = request.user
    product = Products.objects.create(
        user=user,
        name="sample name",
        price=0,
        brand="sample brand",
        countInStock=0,
        category="smaple category",
        description="",
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Products.objects.get(_id=pk)

    product.name = data["name"]
    product.price = data["price"]
    product.brand = data["brand"]
    product.countInStock = data["countInStock"]
    product.category = data["category"]
    product.description = data["description"]

    product.save()
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdminUser])
def deleteProduct(request, pk):
    product = Products.objects.get(_id=pk)
    product.delete()
    return Response("Product Deleted successfull")


@api_view(["POST"])
def uploadImage(request):
    data = request.data

    product_id = data["product_id"]
    product = Products.objects.get(_id=product_id)

    product.image = request.FILES.get("image")
    product.save()
    return Response("Image was uploaded successfully")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Products.objects.get(_id=pk)
    data = request.data
    # 1.Rewiew already exist

    alreadyExist = product.review_set.filter(user=user).exists()
    if alreadyExist:
        content = {'detail': 'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 2.No rating
    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 3.Create rewiev
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment']
        )
        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating
        product.rating = total/len(reviews)
        product.save()
        return Response('Review added')
