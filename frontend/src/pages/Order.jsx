import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaClock, FaTruck, FaMapMarkerAlt, FaBoxOpen } from 'react-icons/fa';
import { Button, Card, Row, Col, Badge } from 'react-bootstrap';
import './Order.css';

const steps = [
    { id: 'preparing', label: 'Preparing', icon: <FaClock /> },
    { id: 'on_the_way', label: 'On the Way', icon: <FaTruck /> },
    { id: 'delivered', label: 'Delivered', icon: <FaCheckCircle /> },
];

const OrderTracking = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        const token = localStorage.getItem('token'); // Assuming you store a token for authentication
        if (!token) return;

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data); // Assuming the response is an array of orders
            } else {
                console.error('Failed to fetch orders:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 2000); // Refresh orders every 2 seconds
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        fetchOrders();
    };

    const formatAddress = (address) => {
        if (!address) return "Address not provided";
        if (typeof address === 'string') return address;
        
        return (
            <div className="address-details">
                <div className="d-flex align-items-center mb-2">
                    <FaMapMarkerAlt className="me-2" />
                    <span className="fw-bold">Delivery Address</span>
                </div>
                <div className="ms-4">
                    {address.doorNo && <div>{address.doorNo}</div>}
                    <div>{address.street}</div>
                    <div>{address.city}, {address.state}</div>
                    <div>{address.zipCode}</div>
                    {address.phone && <div className="text-muted">📞 {address.phone}</div>}
                </div>
            </div>
        );
    };

    const formatOrderId = (id) => {
        try {
            return `#${String(id).slice(-8)}`;
        } catch (error) {
            return `#${id}`;
        }
    };

    return (
        <div className="order-page container py-4" style={{ zIndex: 0 }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="m-0">My Orders <Badge bg="secondary">{orders.length}</Badge></h2>
                <Button variant="outline-primary" onClick={handleRefresh}>
                    Refresh Orders
                </Button>
            </div>

            {orders.length === 0 ? (
                <div className="alert alert-warning text-center py-4">
                    <FaBoxOpen className="mb-3" size={40} />
                    <h4>No orders found!</h4>
                </div>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {orders.map(order => {
                        const statusIndex = Math.min(order.status || 0, steps.length - 1);
                        const orderTotal = order.total?.toFixed(2) || '0.00';

                        return (
                            <Col key={order.id}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Header className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">
                                            {formatOrderId(order.id || 'N/A')}
                                        </span>
                                        <Badge bg={statusIndex === steps.length - 1 ? 'success' : 'warning'}>
                                            {steps[statusIndex]?.label || 'Unknown Status'}
                                        </Badge>
                                    </Card.Header>
                                    
                                    <Card.Body>
                                        <div className="mb-4">
                                            <h5 className="d-flex align-items-center gap-2">
                                                <FaBoxOpen />
                                                <span>Order Items                                            </span>
                                            </h5>
                                            <div className="order-items">
                                                {(order.items || []).map(item => (
                                                    <div key={item.id} className="d-flex justify-content-between py-2 border-bottom">
                                                        <div>
                                                            <span className="fw-bold">{item.quantity || 0}x</span> {item.name || 'Unknown Item'}
                                                        </div>
                                                        <div>
                                                            ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="d-flex justify-content-between mt-3 fw-bold">
                                                <span>Total:</span>
                                                <span>₹{orderTotal}</span>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            {formatAddress(order.deliveryAddress)}
                                        </div>

                                        <div className="status-tracker">
                                            <div className="progress-steps">
                                                {steps.map((step, index) => (
                                                    <div 
                                                        key={step.id} 
                                                        className={`step ${index <= statusIndex ? 'active' : ''}`}
                                                    >
                                                        <div className="step-icon">
                                                            {step.icon}
                                                        </div>
                                                        <div className="step-label">{step.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Card.Body>
                                    
                                    <Card.Footer className="text-muted small">
                                        Estimated delivery: {order.estimatedDelivery || 'Not available'}
                                    </Card.Footer>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </div>
    );
};

export default OrderTracking;