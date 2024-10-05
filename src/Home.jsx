import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import EditUserModal from './EditUserModel';
import "./App.css";
import CreateUserModal from './CreateUserModal'; // Import the new CreateUserModal component

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState(null); // For edit functionality
  const [showCreateModal, setShowCreateModal] = useState(false); // For create user modal

  // Function to delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      setFilteredUsers(filteredUsers.filter(user => user.id !== id));
    } catch (error) {
      alert('Error deleting user');
      console.error('Delete request failed:', error);
    }
  };
  
  
  // Fetch users on component mount
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data); // Set initial filtered users
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to fetch users');
        setLoading(false);
      });
  }, []);

  // Handle search functionality
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    if (query === '') {
      setFilteredUsers(users); // Reset filtered users when search is cleared
    } else {
      const filtered = users.filter(user => user.name.toLowerCase().includes(query));
      setFilteredUsers(filtered);
    }
  };

  // Handle edit user
  const handleEdit = (user) => {
    setEditUser(user); // Set the user being edited to open the modal
  };

  // Handle save after editing user
  const handleSave = (updatedUser) => {
    const updatedUsers = users.map(user => user.id === updatedUser.id ? updatedUser : user);
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers); // Update filtered users as well
    setEditUser(null); // Close modal after saving
  };

  // Handle modal close
  const handleCloseModal = () => {
    setEditUser(null); // Close the modal
  };

  // Handle adding a new user after creation
  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]); // Add the new user to the users array
    setFilteredUsers([...users, newUser]); // Update filtered users as well
    setShowCreateModal(false); // Close the create user modal
  };

  if (loading) return <ClipLoader color="#36d7b7" loading={loading} />;
  if (error) return <div>{error}</div>;

  return (
    <>
      <button onClick={() => setShowCreateModal(true)}>Create User</button> {/* Button to open create user modal */}

      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search by name..."
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <Link to={`/user/${user.id}`}>View</Link>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render the EditUserModal if an editUser is set */}
      {editUser && (
        <EditUserModal 
          user={editUser} 
          onSave={handleSave} 
          onClose={handleCloseModal} 
        />
      )}

      {/* Render the CreateUserModal if showCreateModal is true */}
      {showCreateModal && (
        <CreateUserModal 
          onAddUser={handleAddUser} 
          onClose={() => setShowCreateModal(false)} 
        />
      )}
    </>
  );
};

export default Home;
