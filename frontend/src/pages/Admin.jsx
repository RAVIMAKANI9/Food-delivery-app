import React, { useState, useEffect } from 'react';
import './Admin.css';
import { Button, Table, Form, Modal, Row, Col } from 'react-bootstrap';

const steps = [
    { id: 'preparing', label: 'Preparing' },
    { id: 'on_the_way', label: 'On the Way' },
    { id: 'delivered', label: 'Delivered' },
];

const AdminDashboard = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newFood, setNewFood] = useState({ 
        name: '',
        price: '', 
        image: '', 
        category: '',
        noOfItems: '' 
    });
    const [newCategory, setNewCategory] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [notification, setNotification] = useState('');
    const [allOrders, setAllOrders] = useState([]);

    useEffect(() => {
        fetchFoodItems();
        fetchCategories();
        fetchOrders();
    }, []);

    const fetchFoodItems = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/food-items');
            if (response.ok) {
                const data = await response.json();
                setFoodItems(data);
            } else {
                console.error('Failed to fetch food items:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching food items:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            } else {
                console.error('Failed to fetch categories:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/orders');
            if (response.ok) {
                const data = await response.json();
                setAllOrders(data);
            } else {
                console.error('Failed to fetch orders:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory) {
            alert('Please enter a category name');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newCategory }),
            });

            if (response.ok) {
                setCategories([...categories, newCategory]);
                setNewCategory('');
                setNotification('Category added successfully!');
                setTimeout(() => setNotification(''), 3000);
            } else {
                alert('Failed to add category');
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleAddFood = async (e) => {
        e.preventDefault();
        if (!newFood.name || !newFood.price || !newFood.image || !newFood.category || !newFood.noOfItems) {
            alert('Please fill all fields');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/food-items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    ...newFood, 
                    price: parseFloat(newFood.price).toFixed(2),
                    noOfItems: parseInt(newFood.noOfItems)
                }),
            });

            if (response.ok) {
                const addedFood = await response.json();
                setFoodItems([...foodItems, addedFood]);
                setNewFood({ name: '', price: '', image: '', category: '', noOfItems: '' });
                setNotification('Food item added!');
                setTimeout(() => setNotification(''), 3000);
            } else {
                alert('Failed to add food item');
            }
        } catch (error) {
            console.error('Error adding food item:', error);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                const updatedOrder = await response.json();
                setAllOrders(allOrders.map(order => 
                    order.id === updatedOrder.id ? updatedOrder : order
                ));
                setNotification('Order status updated!');
                setTimeout(() => setNotification(''), 3000);
            } else {
                alert('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const formatAddress = (address) => {
        if (!address) return "No address";
        if (typeof address === 'string') return address;
        
        return (
            <div className="admin-address">
                {address.doorNo && <>{address.doorNo}, </>}
                {address.street}, {address.city}<br />
                {address.state}, {address.zipCode}<br />
                {address.country}
                {address.phone && <><br />📞 {address.phone}</>}
            </div>
        );
    };

    const handleDeleteFood = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/food-items/${deleteItemId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedItems = foodItems.filter(item => item.id !== deleteItemId);
                setFoodItems(updatedItems);
                setShowModal(false);
                setDeleteItemId(null);
                setNotification('Food item deleted!');
                setTimeout(() => setNotification(''), 3000);
            } else {
                alert('Failed to delete food item');
            }
        } catch (error) {
            console.error('Error deleting food item:', error);
        }
    };

    return (
        <div className="admin-dashboard container mt-5">
            <h1 className="mb-4">Admin Dashboard</h1>
            {notification && <div className="alert alert-success">{notification}</div>}

            {/* Category Management */}
            <section className="mb-5">
                <h2>Manage Categories</h2>
                <Form onSubmit={handleAddCategory} className="mb-4">
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>New Category</Form.Label>
                                <Form.Control
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} className="d-flex align-items-end">
                            <Button variant="info" type="submit">Add Category</Button>
                        </Col>
                    </Row>
                </Form>
            </section>

            {/* Food Management */}
            <section className="mb-5">
                <h2>Manage Menu</h2>
                <Form onSubmit={handleAddFood} className="mb-4">
                    <Row>
                        <Col md={6} lg={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Food Name</Form.Label>
                                <Form.Control
                                    name="name"
                                    value={newFood.name}
                                    onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6} lg={2}>
                            <Form.Group className="mb-3">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={newFood.price}
                                    onChange={(e) => setNewFood({...newFood, price: e.target.value})}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6} lg={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control
                                    name="image"
                                    value={newFood.image}
                                    onChange={(e) => setNewFood({...newFood, image: e.target.value})}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6} lg={2}>
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Select
                                    value={newFood.category}
                                    onChange={(e) => setNewFood({...newFood, category: e.target.value})}
                                    required
                                >
                                                                        <option value="">Select</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6} lg={2}>
                            <Form.Group className="mb-3">
                                <Form.Label>Stock</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={newFood.noOfItems}
                                    onChange={(e) => setNewFood({...newFood, noOfItems: e.target.value})}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col className="d-flex align-items-end">
                            <Button variant="success" type="submit">Add Item</Button>
                        </Col>
                    </Row>
                </Form>

                <div className="table-responsive">
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Item</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {foodItems.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img src={item.image} alt={item.name} 
                                                className="admin-food-img me-3" />
                                            {item.name}
                                        </div>
                                    </td>
                                    <td>{item.category}</td>
                                    <td>₹{item.price}</td>
                                    <td>{item.noOfItems}</td>
                                    <td>
                                        <Button variant="danger" 
                                                onClick={() => {
                                                    setDeleteItemId(item.id);
                                                    setShowModal(true);
                                                }}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </section>

            {/* Order Management */}
            <section className="mb-5">
                <h2>Manage Orders</h2>
                <div className="table-responsive">
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>User Email</th>
                                <th>Items</th>
                                <th>Address</th>
                                <th>Status</th>
                                <th>Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allOrders.map((order) => {
                                const statusIndex = order.status >= 0 && order.status < steps.length ? order.status : 0;

                                return (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.userEmail}</td>
                                        <td>
                                            {order.items?.map(item => (
                                                <div key={item.id}>
                                                    {item.name} (x{item.quantity})
                                                </div>
                                            ))}
                                        </td>
                                        <td>{formatAddress(order.address)}</td>
                                        <td>{steps[statusIndex].label}</td>
                                        <td>
                                            <Form.Select 
                                                onChange={(e) => handleStatusUpdate(order.id, parseInt(e.target.value))}
                                                defaultValue={statusIndex}
                                                className="form-select-sm"
                                            >
                                                {steps.map((step, index) => (
                                                    <option key={step.id} value={index}>{step.label}</option>
                                                ))}
                                            </Form.Select>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            </section>

            {/* Delete Confirmation Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this item?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteFood}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminDashboard;