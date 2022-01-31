import {createStore,combineReducers,applyMiddleware} from "redux"
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension"

import {productListReducers,
    productDetailsReducers,
    productDeleteReducers,
    productCreateReducers,
    productUpdateReducers,
    productReviewCreateReducers,
    productTopRatedReducers,

} from "./reducers/productReducer"

import {cartReducer} from "./reducers/cartReducers";
import {userLoginReducers,
        userRegisterReducers,
        userDetailsReducers,
        userUpdateProfileReducers,
        userListReducers,
        userDeleteducers,
        userUpdateducers,

        } from "./reducers/userReducer"

import {orderCreateReducer,
        orderDetailsReducer,
        orderPayReducer,
        orderListMyReducer,
        orderListReducer,
        orderDeliverReducer,

         } from "./reducers/orderReducers"

const reducer=combineReducers({
    productList:productListReducers,
    productDetails:productDetailsReducers,
    productDelete:productDeleteReducers,
    productCreate:productCreateReducers,
    productUpdate:productUpdateReducers,
    productReviewCreate:productReviewCreateReducers,
    productTopRated:productTopRatedReducers,

    cart:cartReducer,
    userLogin:userLoginReducers,
    userRegister:userRegisterReducers,
    userDetails:userDetailsReducers,
    userList:userListReducers,
    userDelete:userDeleteducers,
    userUpdate:userUpdateducers,
    userUpdateProfile:userUpdateProfileReducers,
    
    orderCreate:orderCreateReducer,
    orderDetails:orderDetailsReducer,
    orderPay:orderPayReducer,
    orderListMy:orderListMyReducer,
    orderList:orderListReducer,
    orderDeliver:orderDeliverReducer,


   
})

const cartItemsFromStorange=localStorage.getItem('cartItems') ?
      JSON.parse(localStorage.getItem('cartItems')) :[] 

const userInforStorange=localStorage.getItem('userInfor') ?
JSON.parse(localStorage.getItem('userInfor')) :null

const shippingAddressStorange=localStorage.getItem('shippingAddress') ?
JSON.parse(localStorage.getItem('shippingAddress')) :{}


const initialState={
    cart:{
        cartItems:cartItemsFromStorange,
        shippingAddress:shippingAddressStorange
    },
    userLogin:{userInfor:userInforStorange},

    
}
 
const middleware=[thunk]

const store=createStore(reducer,initialState,
    composeWithDevTools(applyMiddleware(...middleware)))


export default store;