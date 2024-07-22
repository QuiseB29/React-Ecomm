import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
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
            <Routes>
                <Route path='/add-customer' element={<CustomerForm />} />
                <Route path='/edit-customer' element={<CustomerForm />} />
                <Route path='/customers' element={<CustomerList />} />
                <Route path='/product' element={<ProductForm selectedProduct={selectedProduct} onProductUpdated={handleProductUpdated} />} />
                <Route path='/add-product' element={<ProductList products={products} onEditProduct={handleEditProduct} onProductDeleted={handleProductDeleted}   />} />
                <Route path='/order' element={<OrderList />} />
            </Routes>
        </div>
    );
}

export default App;
