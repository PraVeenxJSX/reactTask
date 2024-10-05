import React, { useState } from 'react';
import axios from 'axios';
import "./App.css";

const UserForm = ({ onSave, user = {} }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    username: user.username || 'USER-' + user.name?.split(' ').join('-'),
    street: user.address?.street || '',
    city: user.address?.city || '',
    company: user.company?.name || '',
    website: user.website || '',
  });

  const [errors, setErrors] = useState({});

  // Helper for validation
  const validate = () => {
    let validationErrors = {};
    if (!formData.name || formData.name.length < 3) {
      validationErrors.name = 'Name must be at least 3 characters long.';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = 'Please provide a valid email address.';
    }
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      validationErrors.phone = 'Please provide a valid phone number.';
    }
    if (!formData.street) {
      validationErrors.street = 'Street address is required.';
    }
    if (!formData.city) {
      validationErrors.city = 'City is required.';
    }
    if (formData.company && formData.company.length < 3) {
      validationErrors.company = 'Company name must be at least 3 characters long.';
    }
    if (formData.website && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.website)) {
      validationErrors.website = 'Please provide a valid URL.';
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    axios.post('https://jsonplaceholder.typicode.com/users', formData)
      .then((response) => {
        onSave(response.data);
      })
      .catch((error) => {
        alert('Error creating user');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required minLength={3} placeholder="Name" />
        {errors.name && <p>{errors.name}</p>}
      </div>
      <div>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" />
        {errors.email && <p>{errors.email}</p>}
      </div>
      <div>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone" />
        {errors.phone && <p>{errors.phone}</p>}
      </div>
      <div>
        <input type="text" name="username" value={formData.username} disabled placeholder="Username" />
      </div>
      <div>
        <input type="text" name="street" value={formData.street} onChange={handleChange} required placeholder="Street" />
        {errors.street && <p>{errors.street}</p>}
      </div>
      <div>
        <input type="text" name="city" value={formData.city} onChange={handleChange} required placeholder="City" />
        {errors.city && <p>{errors.city}</p>}
      </div>
      <div>
        <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company (optional)" />
        {errors.company && <p>{errors.company}</p>}
      </div>
      <div>
        <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="Website (optional)" />
        {errors.website && <p>{errors.website}</p>}
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default UserForm;
