import React,{useEffect} from 'react'
import {useDispatch,useSelector} from "react-redux"
import {useNavigate,Link} from "react-router-dom"
import {Row,Col,Button,Image,ListGroup,Card} from 'react-bootstrap';
import Message from "../components/Message"
import CheckoutSteps from "../components/CheckoutSteps"
import { createOrder } from '../actions/orderActions';
import {ORDER_CREATE_RESET} from "../constants/orderConstants"

const PlaceOrderScreen = () => {
    const orderCreate=useSelector(state=>state.orderCreate)
    const {order,error,success}=orderCreate;
    const navigate=useNavigate()
    const dispatch=useDispatch();
    const cart=useSelector(state=>state.cart)

    cart.itemsPrice=cart.cartItems.reduce((acc,item)=>acc+item.price*item.qty,0).toFixed(2)
    cart.shippingPrice=(cart.itemsPrice > 100 ? 0 : 10).toFixed(2)
    cart.taxPrice=((0.082)*cart.itemsPrice).toFixed(2)
    cart.totalPrice=(Number(cart.itemsPrice)+Number(cart.shippingPrice)+Number(cart.taxPrice)).toFixed(2)


  
     useEffect(()=>{
        if(!cart.paymentMethod){
            navigate('/payment')
        }
    
        if(success){
            navigate(`/orders/${order._id}`)
            dispatch({type:ORDER_CREATE_RESET})
        }
     },[success,navigate,cart.paymentMethod,dispatch,order._id])

    const placeOrder=(e)=>{
       e.preventDefault()
       dispatch(createOrder({
           orderItems:cart.cartItems,
           shippingAddress:cart.shippingAddress,
           paymentMethod:cart.paymentMethod,
           itemsPrice:cart.itemsPrice,
           shippingPrice:cart.shippingPrice,
           taxPrice:cart.taxPrice,
           totalPrice:cart.totalPrice,
       }))
    }

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4/>
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <strong>Shipping :</strong>
                            {cart.shippingAddress.address},{cart.shippingAddress.city}
                            {'  '}
                            {cart.shippingAddress.postalcode},
                            {'  '}
                            {cart.shippingAddress.country}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <strong>Method :</strong>
                            {cart.paymentMethod}
                          
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                               {cart.cartItems.length ===0 ? (
                                   <Message variant="info">Your Cart is empty</Message>
                               ):(<ListGroup variant="flush">
                                      {cart.cartItems.map((item,index)=>(
                                          <ListGroup.Item key={index}>
                                               <Row>
                                                   <Col xs={4} md={1}>
                                                   <Image src={item.image} alt={item.name} fluid rounded />
                                                   </Col>
                                                   <Col>
                                                       <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                   </Col>
                                                   <Col md={4}>
                                                       {item.qty} x ${item.price}={(item.qty * item.price).toFixed(2)}                                                       
                                                   </Col>
                                               </Row>
                                          </ListGroup.Item>
                                      ))}
                                   </ListGroup>
                               )}                                            
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                               <Row>
                                   <Col>Item:</Col>
                                   <Col>${cart.itemsPrice}</Col>
                               </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                               <Row>
                                   <Col>Shipping:</Col>
                                   <Col>${cart.shippingPrice}</Col>
                               </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                               <Row>
                                   <Col>Tax:</Col>
                                   <Col>${cart.taxPrice}</Col>
                               </Row>
                            </ListGroup.Item>
                            
                            <ListGroup.Item>
                               <Row>
                                   <Col>Total:</Col>
                                   <Col>${cart.totalPrice}</Col>
                               </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                               {error && <Message variant={"danger"}>{error}</Message> }
                            </ListGroup.Item>
                      
                              <ListGroup.Item className="d-grid">
                              <Button 
                              type="button" 
                              disabled={cart.cartItems === 0}
                              onClick={placeOrder}
                              >Place Order</Button>
                            </ListGroup.Item>                           
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default PlaceOrderScreen
