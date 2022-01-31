import { Container } from 'react-bootstrap'
import { HashRouter as Router,Route,Routes} from "react-router-dom"
import {useState} from 'react'

import Header from './components/Header';
import Footer from "./components/Footer";
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from "./screens/CartScreen";
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import UserProfileScreen from "./screens/UserProfileScreen"
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from "./screens/OrderListScreen";



function App() {

  const [keyw,setKeyword]=useState({})

  const keyHandler=({key,keyword})=>{
    setKeyword({key,keyword});
  }
  return (
    <div>
      <Router>
     <Header keyHandler={keyHandler}/>  
     <main className='py-3'>
       <Container>
         <Routes>
          <Route exact path="/" element={<HomeScreen keyw={keyw}/>} />
          <Route path='/cart/:id' element={<CartScreen/>} />
          <Route path='/cart/' element={<CartScreen/>} />
          <Route path="/shipping" element={<ShippingScreen/>} />
          <Route path='/payment' element={<PaymentScreen/>} />
          <Route path='/placeorder' element={<PlaceOrderScreen/>} />
          <Route path='/orders/:id' element={<OrderScreen/>} />

          <Route path="/login" element={<LoginScreen/>}/>
          <Route path="/register" element={<RegisterScreen/>}/>
          <Route  path="/profile" element={<UserProfileScreen/>}/>
          
          {/* ADMIN */}
          <Route path="/userlist" element={<UserListScreen/>}/>
          <Route path="/user/:id/edit" element={<UserEditScreen/>}/>
          <Route path="/productlist" element={<ProductListScreen keyw={keyw}/>}/>
          <Route path="/product/:id/edit" element={<ProductEditScreen/>}/>
          <Route path="/orderlist" element={<OrderListScreen/>}/>


          {/* END ADMIN */}
          <Route path='/product/:id' element={<ProductScreen/>} />

         </Routes>
       </Container>      
     </main>
     <Footer/> 
     </Router>        
    </div>
  );
}

export default App;
