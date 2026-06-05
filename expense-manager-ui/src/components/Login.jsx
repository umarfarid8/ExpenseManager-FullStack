import React, { useState } from 'react';
import { authService } from '../services/authService';

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await authService.login(username, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Username or Password credentials.');
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '80px auto', background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#148650', margin: '0 0 25px 0', fontSize: '32px', fontWeight: 'bold' }}>Welcome Back</h1>
      
      {error && <p style={{ color: '#dc3545', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '18px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#6c757d', marginBottom: '6px', fontWeight: '500' }}>UserName</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box', outline: 'none', fontSize: '15px' }} 
            required 
          />
        </div>

        <div style={{ marginBottom: '25px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#6c757d', marginBottom: '6px', fontWeight: '500' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box', outline: 'none', fontSize: '15px' }} 
            required 
          />
        </div>

        <button type="submit" style={{ width: '100%', background: '#148650', color: '#fff', border: 'none', padding: '14px', borderRadius: '24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px' }}>
          Login
        </button>
      </form>

      <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
        New here? <span onClick={onSwitchToRegister} style={{ color: '#007bff', cursor: 'pointer', fontWeight: '600' }}>Create account</span>
      </p>
    </div>
  );
};

export default Login;