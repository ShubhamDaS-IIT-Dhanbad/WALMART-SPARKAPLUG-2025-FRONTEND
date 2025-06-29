import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { login } from '../../appwrite/admin/login.js'; // adjust path
import '../styles/adminLogin.css';

const AdminLogin = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await login(adminId, password);
    console.log(user);
    if (user) {
      Cookies.set('adminid', user.$id, { expires: 1 });
      navigate('/admin/main');
    } else {
      setError('Invalid credentials.');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2 className="admin-login-title">Admin Login</h2>
        {error && <p className="admin-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="adminId">Username</label>
          <input
            type="text"
            id="adminId"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
