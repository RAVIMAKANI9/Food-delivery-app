import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import './Profile.css';

const ProfileDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser ] = useState(null);
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        country: 'India'
    });
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token'); // Assuming you store a token for authentication
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser (data);
                    setFormData({
                        street: data.address.street || '',
                        city: data.address.city || '',
                        state: data.address.state || '',
                        zipCode: data.address.zipCode || '',
                        phone: data.address.phone || '',
                        country: data.address.country || 'India'
                    });
                    setProfilePhoto(data.profilePhoto || null);
                } else {
                    console.error('Failed to fetch user profile:', response.statusText);
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                navigate('/login');
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        
        if (!formData.phone.match(/^[0-9]{10}$/)) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }
        
        if (!formData.zipCode.match(/^[0-9]{6}$/)) {
            setError('Please enter a valid 6-digit ZIP code');
            return;
        }

        const updatedUser   = { 
            ...user, 
            address: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: formData.country,
                phone: formData.phone
            }
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedUser  ),
            });

            if (response.ok) {
                setUser (updatedUser  );
                alert("Profile Updated Successfully!");
                navigate('/homepage');
            } else {
                alert('Failed to update profile. Please try again.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handlePhotoUpload = async (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch('http://localhost:5000/api/profile/photo', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ photo: reader.result }),
                    });

                    if (response.ok) {
                        const updatedUser   = await response.json();
                        setProfilePhoto(updatedUser  .profilePhoto);
                    } else {
                        setError('Failed to upload photo. Please try again.');
                    }
                } catch (error) {
                    console.error('Error uploading photo:', error);
                }
            };
            reader.readAsDataURL(file);
        } else {
            setError('Please upload a valid image file');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="profile-dashboard container mt-5">
            <h2 className="text-center mb-4">Profile Settings</h2>
            
            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

            <Row className="g-4">
                {/* Profile Photo Section */}
                <Col md={4} className="text-center">
                    <div className="profile-photo-section mb-4">
                        <div className="profile-photo-wrapper">
                            <img 
                                src={profilePhoto || "https://via.placeholder.com/150"} 
                                alt="Profile" 
                                className="profile-photo rounded-circle img-thumbnail"
                            />
                                                            <label className="photo-upload-label btn btn-secondary mt-3">
                                    <i className="bi bi-camera-fill me-2"></i>
                                    Upload Photo
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handlePhotoUpload} 
                                        className="d-none" 
                                    />
                                </label>
                            </div>
                        </div>
                    </Col>

                    {/* Personal Information */}
                    <Col md={8}>
                        <div className="profile-card p-4 shadow-sm">
                            <h4 className="mb-4 border-bottom pb-2">Personal Information</h4>
                            <Form onSubmit={handleSaveAddress}>
                                <Row className="g-3">
                                    <Form.Group as={Col} md={6} controlId="formName">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            value={user?.fullName || ''} 
                                            disabled 
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} md={6} controlId="formEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control 
                                            type="email" 
                                            value={user?.email || ''} 
                                            disabled 
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} md={6} controlId="formPhone">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Enter 10-digit phone number"
                                            pattern="[0-9]{10}"
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} md={6} controlId="formStreet">
                                        <Form.Label>Street Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            placeholder="House number and street name"
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} md={4} controlId="formCity">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="Enter city"
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} md={4} controlId="formState">
                                        <Form.Label>State</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            placeholder="Enter state"
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} md={4} controlId="formZipCode">
                                        <Form.Label>ZIP Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            placeholder="6-digit code"
                                            pattern="[0-9]{6}"
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group as={Col} md={12} controlId="formCountry">
                                        <Form.Label>Country</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                        >
                                            <option>India</option>
                                            <option>United States</option>
                                            <option>United Kingdom</option>
                                            <option>Canada</option>
                                        </Form.Control>
                                    </Form.Group>

                                    <div className="mt-4 d-flex justify-content-between">
                                        <Button variant="primary" type="submit" className="me-2">
                                            Save Changes
                                        </Button>
                                        <Button variant="outline-danger" onClick={handleLogout}>
                                            Sign Out
                                        </Button>
                                    </div>
                                </Row>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    };

    export default ProfileDashboard;