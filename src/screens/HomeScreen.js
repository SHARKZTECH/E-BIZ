import React,{useEffect} from 'react'
import {Row,Col} from "react-bootstrap";
import {useDispatch,useSelector} from "react-redux"
import Product from '../components/Product';
import {listProducts} from "../actions/productActions";
import Loader from '../components/Loader';
import Message from "../components/Message"
import Paginate from '../components/Paginate'
import ProductCarousel from './../components/ProductCarousel';

const HomeScreen = ({keyw}) => {
    const dispatch=useDispatch()    

    const productList=useSelector(state=>state.productList)
    const {error,loading,products,page,pages}=productList;
    
     let keyword=window.location.search

    // console.log("keyword_home=",keyword)
    // console.log("key_home=",keyw)
     let key=keyw.keyword

    useEffect(()=>{
        dispatch(listProducts(keyword))
    },[dispatch,keyword,key])

    return (
        <div>
          {!key && <ProductCarousel/>}
          
             <h1>Latet Products</h1>
            {loading? <Loader/> 
            :error? <Message variant={'danger'}>{error}</Message>
            :
            <div>
            <Row>
            {products.map((product)=>(
              <Col key={product._id}  sm={12} md={6} lg={4} xl={3} >
                   <Product  product={product}/>
              </Col>  
            ))}
        </Row>
          <Paginate page={page} pages={pages} keyword={keyword} />
         </div>

          }
          
        </div>
    )
}

export default HomeScreen
