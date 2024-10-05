import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css";

const CreateUserModal = ({ onAddUser, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '', // Auto-filled
    address: { street: '', city: '' },
    company: { name: '' },
    website: ''
  });
  const [errors, setErrors] = useState({});

  // Auto-fill username when name is entered
  useEffect(() => {
    if (formData.name.length >= 3) {
      setFormData((prevData) => ({
        ...prevData,
        username: `USER-${formData.name.replace(/\s+/g, '-').toLowerCase()}`
      }));
      setErrors((prevErrors) => {
        const { username, ...otherErrors } = prevErrors; // Remove username error if present
        return otherErrors;
      });
    }
  }, [formData.name]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [key, subKey] = name.split('.');
      setFormData({ ...formData, [key]: { ...formData[key], [subKey]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Form validation logic
  const validate = () => {
    let newErrors = {};

    // Name validation: Required, minimum 3 characters
    if (formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';

    // Email validation: Required, must be valid
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

    // Phone validation: Required, must be a valid phone number
    if (!/^\d+$/.test(formData.phone)) newErrors.phone = 'Phone number must be numeric';

    // Address validation: Street and City required
    if (!formData.address.street) newErrors.street = 'Street is required';
    if (!formData.address.city) newErrors.city = 'City is required';

    // Company validation: Optional, but must be at least 3 characters if provided
    if (formData.company.name && formData.company.name.length < 3) {
      newErrors.company = 'Company name must be at least 3 characters';
    }

    // Website validation: Optional, but must be a valid URL if provided
    if (formData.website && !/^(https?:\/\/[^\s$.?#].[^\s]*)$/.test(formData.website)) {
      newErrors.website = 'Invalid website URL';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Post request to add new user
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/users', formData);
      onAddUser(response.data); // Call onAddUser to update the UI with the new user
      onClose(); // Close modal after success
    } catch (error) {
      alert('Error creating user');
      console.error(error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create New User</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <span>{errors.name}</span>}
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span>{errors.email}</span>}
          </div>
          <div>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <span>{errors.phone}</span>}
          </div>
          <div>
            <label>Username (Auto-filled)</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              readOnly
            />
            {errors.username && <span>{errors.username}</span>}
          </div>
          <div>
            <label>Street</label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              required
            />
            {errors.street && <span>{errors.street}</span>}
          </div>
          <div>
            <label>City</label>
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              required
            />
            {errors.city && <span>{errors.city}</span>}
          </div>
          <div>
            <label>Company (Optional)</label>
            <input
              type="text"
              name="company.name"
              value={formData.company.name}
              onChange={handleChange}
            />
            {errors.company && <span>{errors.company}</span>}
          </div>
          <div>
            <label>Website (Optional)</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
            {errors.website && <span>{errors.website}</span>}
          </div>
          <div className="button-group">
            <button type="submit">Create</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
