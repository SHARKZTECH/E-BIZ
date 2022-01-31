import React,{useState,useEffect} from 'react'
import {useDispatch,useSelector} from "react-redux"
import {Link,useNavigate,useParams} from "react-router-dom"
import { Form,Button} from 'react-bootstrap';
import axios from 'axios';

import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from "../components/FormContainer"
import {listProductsDetails,updateProduct} from "../actions/productActions"
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

const ProductEditScreen = () => {
    const params=useParams()
    const dispatch=useDispatch();
    const navigate = useNavigate();

    const [name,setName]=useState('')
    const [price,setPrice]=useState(0)
    const [image,setImage]=useState('')
    const [brand,setBrand]=useState('')
    const [category,setCategory]=useState('')
    const [countInStock,setCountInStock]=useState(0)
    const [description,setDescription]=useState('')
    const [uploading,setUploading]=useState(false)

   

    const productId=params.id;

     const  productDetails=useSelector(state=>state.productDetails)
     const {error,loading,product} =productDetails;

     const  productUpdate=useSelector(state=>state.productUpdate)
     const {success:successUpdate,error:errorUpdate,loading:loadingUpdate} =productUpdate;
 
     useEffect(()=>{
            if(successUpdate){
                dispatch({type:PRODUCT_UPDATE_RESET})
                navigate("/productlist")
            }else{
      
                if(!product.name || product._id !== Number(productId)){
                    dispatch(listProductsDetails(productId))
                }else{
                    setName(product.name)
                    setPrice(product.price)
                    setBrand(product.brand)
                    setImage(product.image)
                    setCategory(product.category)
                    setCountInStock(product.countInStock)
                    setDescription(product.description)
                }
            }
            
     },[productId,dispatch,product,successUpdate,navigate])

    const submitHandler=(e)=>{
        e.preventDefault()
            dispatch(updateProduct({
               _id:productId,
               name,
               price,
               brand,
               image,
               category,
               countInStock,
               description
            }))
    }

    const uploadFileHandler =async (e)=>{
       const file=e.target.files[0]
       const formData=new FormData()

       formData.append('image',file)
       formData.append('product_id',productId)
       setUploading(true);
       try{
           const config={
               headers:{
                   'Content-Type':'multipart/from-data'
               }
           }
           const {data}=await axios.post('/products/upload/',formData,config)
           
           setImage(data)
           
           setUploading(false)
           

       }catch{
           setUploading(false)
       }
    }
    return (
    <div>
    <Link to="/productlist" className='arrow btn btn-light my-3'><i className='fas fa-arrow-left'></i></Link>
        
     <FormContainer>
        <h1>Edit Product</h1> 
         {loadingUpdate && (<Loader/>)}
         {errorUpdate && (<Message variant={'danger'}>{error}</Message>)}
          {loading ? (<Loader/> ) :
          error ? (<Message variant="danger">{error}</Message>):( 

        <Form onSubmit={submitHandler}>      

            <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                ></Form.Control>
            </Form.Group> 

            <Form.Group controlId='price'>
                <Form.Label>Price</Form.Label>
                <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e)=>setPrice(e.target.value)}
                ></Form.Control>
            </Form.Group> 

            <Form.Group controlId='image'>
                <Form.Label>Image</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter image"
                value={image}
                onChange={(e)=>setImage(e.target.value)}
                ></Form.Control>

                 <Form.Control
                 label="Choose file"
                 onChange={uploadFileHandler}
                  type="file" />
                {uploading && (<Loader/>)}
            </Form.Group> 

            <Form.Group controlId='brand'>
                <Form.Label>Brand</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e)=>setBrand(e.target.value)}
                ></Form.Control>
            </Form.Group> 

            <Form.Group controlId='countInStock'>
                <Form.Label>CountInStock</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e)=>setCountInStock(e.target.value)}
                ></Form.Control>
            </Form.Group> 

            <Form.Group controlId='category'>
                <Form.Label>Category</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e)=>setCategory(e.target.value)}
                ></Form.Control>
            </Form.Group> 
            
            <Form.Group controlId='description'>
                <Form.Label>Description</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                ></Form.Control>
            </Form.Group> 
        
         
            <Button type="submit" variant='primary' className="my-3">Update</Button>
        </Form>
       )} 

    </FormContainer> 

    </div>
    )
}

export default ProductEditScreen
