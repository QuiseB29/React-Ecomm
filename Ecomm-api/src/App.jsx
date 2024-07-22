import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import CustomerList from './components/CustomerList';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import NavigationBar from './components/NavigationBar';
import CustomerFormWrapper from './components/CustomerFormWrapper';
import NotFound from './components/NotFound';
import HomePage from './components/HomePage';
import PlaceOrderForm from './components/PlaceOrderForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AppStyles.css';
import OrderList from './components/OrderList';

function App() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
    };

    const handleProductUpdated = () => {
        fetchProducts();
        setSelectedProduct(null);
    };

    const handleProductDeleted = () => {
        fetchProducts();
    };

    return (
        <div className="app-container">
            <NavigationBar />
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/add-customer' element={<CustomerFormWrapper />} />
                <Route path='/edit-customer/:id' element={<CustomerFormWrapper />} />
                <Route path='/customers' element={<CustomerList />} />
                <Route path='/product' element={<ProductForm selectedProduct={selectedProduct} onProductUpdated={handleProductUpdated} />} />
                <Route path='/add-product' element={<ProductList products={products} onEditProduct={handleEditProduct} onProductDeleted={handleProductDeleted}   />} />
                <Route path='/product-form' element={<PlaceOrderForm />} />
                <Route path='/order' element={<OrderList />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
