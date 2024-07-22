import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const PlaceOrderForm = ({ customerId, onOrderPlaced }) => {
  const [orderDate, setOrderDate] = useState('');
  const [products, setProducts] = useState([{ productId: '', quantity: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleProductChange = (index, event) => {
    const { name, value } = event.target;
    const newProducts = [...products];
    newProducts[index][name] = value;
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { productId: '', quantity: '' }]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const orderData = {
      orderDate,
      customerId,
      products: products.map(p => ({ productId: p.productId, quantity: p.quantity }))
    };

    axios.post('http://127.0.0.1:5000/orders', orderData)
      .then(response => {
        setIsLoading(false);
        setSuccess(true);
        onOrderPlaced();
        setOrderDate('');
        setProducts([{ productId: '', quantity: '' }]);
      })
      .catch(error => {
        setIsLoading(false);
        setError('Error placing order. Please try again.');
      });
  };

  return (
    <Container>
      {isLoading && <Alert variant="info">Placing order...</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Order placed successfully!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formOrderDate">
          <Form.Label>Order Date</Form.Label>
          <Form.Control type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} required />
        </Form.Group>

        {products.map((product, index) => (
          <div key={index}>
            <Form.Group controlId={`formProductId${index}`}>
              <Form.Label>Product ID</Form.Label>
              <Form.Control
                type="text"
                name="productId"
                value={product.productId}
                onChange={(e) => handleProductChange(index, e)}
                required
              />
            </Form.Group>
            <Form.Group controlId={`formQuantity${index}`}>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={(e) => handleProductChange(index, e)}
                required
              />
            </Form.Group>
          </div>
        ))}

        <Button variant="secondary" onClick={addProduct}>Add Another Product</Button>
        <Button variant="primary" type="submit" className="ml-2">Place Order</Button>
      </Form>
    </Container>
  );
};

export default PlaceOrderForm;
