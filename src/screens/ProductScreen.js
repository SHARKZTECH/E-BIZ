import React,{useState,useEffect} from 'react'
import {Link,useParams} from "react-router-dom";
import {Row,Col,Image,ListGroup,Button,Card,Form} from "react-bootstrap";
import Rating from "../components/Rating";
import {useDispatch,useSelector} from "react-redux"
import {listProductsDetails,createProductReview}  from "../actions/productActions";
import Loader from '../components/Loader';
import Message from "../components/Message"
import {PRODUCT_CREATE_REVIEW_RESET} from "../constants/productConstants"

const ProductScreen = (props) => {
    const [qty,setQty]=useState(1);
    const [rating,setRating]=useState(0)
    const [comment,setComment]=useState('')

    const params = useParams()
    const dispatch=useDispatch()

    const productDetails=useSelector(state=>state.productDetails)
    const {loading,error,product}=productDetails;

    const userLogin=useSelector(state=>state.userLogin)
    const {userInfor}=userLogin;

    const productReviewCreate=useSelector(state=>state.productReviewCreate)
    const {loading:loadingReview,error:errorReview,success:successReview}=productReviewCreate;

    useEffect(()=>{
        if(successReview){
            setRating(0)
            setComment('')
            dispatch({type:PRODUCT_CREATE_REVIEW_RESET})
        }
        dispatch(listProductsDetails(params.id))
    },[dispatch,params,successReview])
  
    const submitHandler=(e)=>{
        e.preventDefault()
        dispatch(createProductReview(
            params.id,{
               rating,
               comment, 
            }
        ))
    }

    let redirect=window.location.pathname.substring(1,);

   const {name,image, description,price,countInStock,numReviews}=product;
    return (
        <div>
         <Link to="/" className='arrow btn btn-light my-3'><i className='fas fa-arrow-left'></i></Link>
         {loading
          ?<Loader/> 
            :error
            ? <Message variant={'danger'}>{error}</Message>
            :(
            <div>
            <Row>

                <Col md={6}>
                <Image src={image} alt={name} fluid/>
                </Col>
   
                <Col md={3}>
                    <ListGroup variant="flush"> 
                     <ListGroup.Item>
                          <h3>{name}</h3>
                     </ListGroup.Item>
   
                     <ListGroup.Item>
                          <Rating value={product.rating} text={`${numReviews} reviews`} color={'#f8e825'}/>
                     </ListGroup.Item>
   
                     <ListGroup.Item>
                          Price: ${price}
                     </ListGroup.Item>
   
                     <ListGroup.Item>
                         Description: {description}
                     </ListGroup.Item>
                    </ListGroup>
                </Col>
   
                <Col md={3}>
                    <Card>
                        <ListGroup variant="flush">
                           <ListGroup.Item>
                               <Row>
                                   <Col>Price:</Col>
                                   <Col>
                                   <strong>${price}</strong>
                                   </Col>
                               </Row>
                           </ListGroup.Item>
   
                           <ListGroup.Item>
                               <Row>
                                   <Col>Status:</Col>
                                   <Col>
                                   {
                                     countInStock >0 ?
                                     'In Stock ' :
                                     'Out of Stock'                                  
                                   }
                                   </Col>
                               </Row>
                           </ListGroup.Item>
                           
                           {
                               countInStock>0 && (
                                 <ListGroup.Item>
                                     <Row>
                                         <Col>Qty</Col>
                                         <Col xs="auto" className="my-1">
                                         <Form.Control
                                         as="select"
                                         value={qty}
                                         onChange={(e)=>setQty(e.target.value)}
                                         >
                                             {
                                                 [...Array(countInStock).keys()].map((x)=>(
                                                     <option key={x+1} value={x+1}>{x+1}</option>
                                                 ))
                                             }

                                         </Form.Control>
                                         </Col>
                                     </Row>
                                 </ListGroup.Item>  
                               )
                           }

                           <ListGroup.Item>
                               <Link to={`/cart/${params.id}`}
                                state={{qty:qty}}
                               >
                               <Button  disabled={countInStock===0 }  className="btn-block" type='button'>Add to Cart</Button>
                               </Link>
                           </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
   
            </Row>
            <Row>
                <Col md={6}>
                    <h3>Reviews</h3>
                    {product.reviews.length === 0 && <Message variant="info">{'No Reviews'}</Message> }
                    <ListGroup variant='flus'>
                        {product.reviews.map((review)=>(
                            <ListGroup.Item key={review._id}>
                              <strong>{review.name}</strong>
                              <Rating color='#f8e825' value={review.rating}/>
                              <p>{review.createdAt.substring(0,10)}</p>
                              <p>{review.comment}</p>
                            </ListGroup.Item>
                        ))}
                        <ListGroup.Item>
                            <h4>Write a review</h4>
                            {loadingReview && <Loader/>}
                            {successReview && <Message variant='success'>Review submitted successful!</Message>}
                            {errorReview && <Message variant='danger'>{errorReview}</Message>}
                            {userInfor ? (
                                <Form onSubmit={submitHandler}>
                                    <Form.Group controlId='rating'>
                                        <Form.Label>Rating</Form.Label>
                                        <Form.Control
                                         as='select'
                                         value={rating}
                                         onChange={(e)=>setRating(e.target.value)}
                                        >
                                           <option value=''>Select ...</option> 
                                           <option value='1'>1-Poor</option> 
                                           <option value='2'>2-Fair</option> 
                                           <option value='3'>3-Good</option> 
                                           <option value='4'>4-Very Good</option> 
                                           <option value='5'>5-Excellent</option> 

                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId='comment'>
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control
                                        as='textarea'
                                        row='5'
                                        placeholder='write a comment...'
                                        value={comment}
                                        onChange={(e)=>setComment(e.target.value)}
                                        ></Form.Control>
                                    </Form.Group>
                                    <Button
                                    disabled={loadingReview}
                                    type='submit'
                                    className='mt-3'
                                    >Submit</Button>
                                </Form>
                            ):(
                               <Message variant='info'>Please <Link to={`/login?redirect=${redirect}`} >login</Link> to write a review </Message> 
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            </div>)
         
          }
        </div>
    )
}

export default ProductScreen
