




import { Component } from "react";
import axios from 'axios';
import PropTypes from 'prop-types';
import { Form, Button, Alert, Container, Modal } from 'react-bootstrap';

class CustomerForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            phone: '',
            errors: {},
            selectedCustomerId: null,
            isLoading: false,
            showSuccessModal: false
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.customerId !== this.props.customerId) {
            this.setState({ selectedCustomerId: this.props.customerId });

            if (this.props.customerId) {
                axios.get(`http://127.0.0.1:5000/customers/${this.props.customerId}`)
                    .then(response => {
                        const customerData = response.data;
                        this.setState({
                            name: customerData.name,
                            email: customerData.email,
                            phone: customerData.phone
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching customer data:', error);
                    });
            } else {
                this.setState({
                    name: '',
                    email: '',
                    phone: ''
                });
            }
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    validateForm = () => {
        const { name, email, phone } = this.state;
        const errors = {};
        if (!name) errors.name = 'Name is required';
        if (!email) errors.email = 'Email is required';
        if (!phone) errors.phone = 'Phone is required';
        return errors;
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const errors = this.validateForm();
        if (Object.keys(errors).length === 0) {
            const customerData = {
                name: this.state.name.trim(),
                email: this.state.email.trim(),
                phone: this.state.phone.trim()
            };
            const apiUrl = this.state.selectedCustomerId
                ? `http://127.0.0.1:5000/customers/${this.state.selectedCustomerId}`
                : 'http://127.0.0.1:5000/customers';

            const httpMethod = this.state.selectedCustomerId ? axios.put : axios.post;

            this.setState({ isLoading: true });

            httpMethod(apiUrl, customerData)
                .then(response => {
                    this.props.onUpdateCustomerList();

                    this.setState({
                        name: '',
                        email: '',
                        phone: '',
                        errors: {},
                        selectedCustomerId: null,
                        isLoading: false,
                        showSuccessModal: true
                    });
                })
                .catch(error => {
                    console.error('Error submitting form', error);
                    this.setState({ isLoading: false });
                });
        
        } else {
            this.setState({ errors });
        }
    };

    closeModal = () => {
        this.setState({
            showSuccessModal: false,
            name: '',
            email: '',
            phone: '',
            errors: {},
            selectedCustomerId: null
        });
        this.props.navigate('/add-customer');
    }

    render() {
        const { name, email, phone, errors, isLoading, showSuccessModal } = this.state;

        return (
            <Container>
                {isLoading && <Alert variant='info'>Submitting customer data...</Alert>}

                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId='formGroupName'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='text'
                            name='name'
                            value={name}
                            onChange={this.handleChange}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type='invalid'>{errors.name}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='formGroupEmail'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type='email'
                            name='email'
                            value={email}
                            onChange={this.handleChange}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type='invalid'>{errors.email}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='formGroupPhone'>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type='tel'
                            name='phone'
                            value={phone}
                            onChange={this.handleChange}
                            isInvalid={!!errors.phone}
                        />
                        <Form.Control.Feedback type='invalid'>{errors.phone}</Form.Control.Feedback>
                    </Form.Group>

                    <Button variant='primary' type='submit'>Submit</Button>
                </Form>

                <Modal show={showSuccessModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Success!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        The customer has been successfully {this.state.selectedCustomerId ? 'updated' : 'added'}.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={this.closeModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}

CustomerForm.propTypes = {
    customerId: PropTypes.number,
    onUpdateCustomerList: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired
};

export default CustomerForm;
