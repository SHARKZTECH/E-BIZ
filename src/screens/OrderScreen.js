import React,{useState,useEffect} from 'react'
import {useDispatch,useSelector} from "react-redux"
import {useNavigate,Link,useParams} from "react-router-dom"
import {Row,Col,Button,Image,ListGroup,Card} from 'react-bootstrap';
import Message from "../components/Message"
import Loader from "../components/Loader"
import { getOrderDetails,payOrder,deliverOrder } from '../actions/orderActions';
import {PayPalButton} from "react-paypal-button-v2"
import {ORDER_PAY_RESET,ORDER_DELIVER_RESET} from "../constants/orderConstants"

const OrderScreen = () => {
    const navigate=useNavigate()
    const params=useParams()
    const orderId=params.id;
    const dispatch=useDispatch();

    const [sdkReady,setSdkReady]=useState(false)

    const orderDetails=useSelector(state=>state.orderDetails)
    const {order,error,loading}=orderDetails;

    const orderPay=useSelector(state=>state.orderPay)
    const {success:successPay,loading:loadingPay}=orderPay;
 
    const orderDeliver=useSelector(state=>state.orderDeliver)
    const {success:successDeliver,loading:loadingDeliver}=orderDeliver;
    
    const userLogin=useSelector(state=>state.userLogin)
    const {userInfor}=userLogin;

    if(!loading && !error){
    order.itemsPrice=order.orderItems.reduce((acc,item)=>acc+item.price*item.qty,0).toFixed(2)
    }

     const addPaypalScript=()=>{
         const script=document.createElement('script')
         script.type="text/javascript"
         script.src="https://www.paypal.com/sdk/js?client-id=AbZDN6soec8-E-qH0B7bt4SaX6L7K_TIUJrxC7nRj6nXW05l4kJE6fLIQAV_50yShhxOom6g6Tx_dgLd"
         script.async=true
         script.onload=()=>{
             setSdkReady(true)
         }
         document.body.appendChild(script)
        }

     useEffect(()=>{ 
         if(!userInfor){
             navigate("/login")
         }
         if(!order || successPay || order._id !==Number(orderId) || successDeliver) {   
            dispatch({type:ORDER_PAY_RESET})
            dispatch({type:ORDER_DELIVER_RESET})
            dispatch(getOrderDetails(orderId))
         }else if(!order.isPaid){
             if(!window.paypal){
                addPaypalScript()
             }else{
                 setSdkReady(true)
             }
         }      
     },[order,orderId,dispatch,successPay,successDeliver,navigate,userInfor])

    const successPaymentHandler=(paymentResult)=>{
       dispatch(payOrder(orderId,paymentResult))
    }


    const deliverHandler=()=>{
        dispatch(deliverOrder(order))
    }

    return loading ? (
        <Loader/>
    ) : error ? (
        <Message variant="danger">{error}</Message>
    ):
    (
        <div>
            <h1>Order: {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name:</strong>{order.user.name}</p>
                            <p><strong>Email:</strong><a href={`mailto:${order.user.email} `}>{order.user.email}</a></p>
                   
                            <strong>Shipping :</strong>
                            {order.shippingAddress.address},{order.shippingAddress.city}
                            {'  '}
                            {order.shippingAddress.postalcode},
                            {'  '}
                            {order.shippingAddress.country}

                        {order.isDelivered ? (
                              <Message variant="success">Delivered on: {order.paidAt}</Message>
                          ):(
                            <Message variant="warning">Not Delivered</Message>
                          )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                            <strong>Method :</strong>
                            {order.paymentMethod}
                          </p>
                          {order.isPaid ? (
                              <Message variant="success">Paid on: {order.paidAt}</Message>
                          ):(
                            <Message variant="warning">Not Paid</Message>
                          )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                               {order.orderItems.length ===0 ? (
                                   <Message variant="info">Your order is empty</Message>
                               ):(<ListGroup variant="flush">
                                      {order.orderItems.map((item,index)=>(
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
                                   <Col>${order.itemsPrice}</Col>
                               </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                               <Row>
                                   <Col>Shipping:</Col>
                                   <Col>${order.shippingPrice}</Col>
                               </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                               <Row>
                                   <Col>Tax:</Col>
                                   <Col>${order.taxPrice}</Col>
                               </Row>
                            </ListGroup.Item>
                            
                            <ListGroup.Item>
                               <Row>
                                   <Col>Total:</Col>
                                   <Col>${order.totalPrice}</Col>
                               </Row>
                            </ListGroup.Item>

                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader/>}

                                    {!sdkReady?(
                                        <Loader/>
                                    ):(
                                        <PayPalButton
                                          amount={order.totalPrice}
                                          onSuccess={successPaymentHandler}
                                        />
                                    )}
                                </ListGroup.Item>
                            )}
            
                        </ListGroup>
                        {loadingDeliver && <Loader/>}
                        {userInfor && userInfor.isAdmin && order.isPaid && !order.isDelivered &&(
                           <ListGroup.Item className="d-grid">
                               <Button
                               type="button"
                               className="btn btn-block"
                               onClick={deliverHandler}
                               >Mark As Delivered</Button>
                           </ListGroup.Item> 
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderScreen
