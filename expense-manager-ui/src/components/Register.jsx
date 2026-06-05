import React, { useState } from 'react';
import { authService } from '../services/authService';

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // 1. Client-Side Validation: Catch mismatches before making an API call
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await authService.register(username, email, password);
      setSuccessMessage("Registration successful! Redirecting to login...");
      
      // Auto-switch to login screen after a brief delay
      setTimeout(() => {
        onRegisterSuccess();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '60px auto', background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#007bff', margin: '0 0 10px 0', fontSize: '32px', fontWeight: 'bold' }}>Sign Up</h1>
      <p style={{ color: '#6c757d', marginBottom: '25px', fontSize: '14px' }}>Create your account to start managing your personal finances.</p>

      {error && <div style={{ color: '#dc3545', background: '#f8d7da', padding: '10px', borderRadius: '6px', fontSize: '14px', marginBottom: '15px' }}>{error}</div>}
      {successMessage && <div style={{ color: '#148650', background: '#d1e7dd', padding: '10px', borderRadius: '6px', fontSize: '14px', marginBottom: '15px' }}>{successMessage}</div>}

      <form onSubmit={handleRegister}>
        {/* Username Field */}
        <div style={{ marginBottom: '16px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#495057', marginBottom: '6px', fontWeight: '500' }}>UserName</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box', outline: 'none', fontSize: '15px' }} 
            required 
          />
        </div>

        {/* Email Field */}
        <div style={{ marginBottom: '16px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#495057', marginBottom: '6px', fontWeight: '500' }}>EmailAddress</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box', outline: 'none', fontSize: '15px' }} 
            required 
          />
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: '16px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#495057', marginBottom: '6px', fontWeight: '500' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box', outline: 'none', fontSize: '15px' }} 
            required 
          />
        </div>

        {/* Confirm Password Field */}
        <div style={{ marginBottom: '25px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#495057', marginBottom: '6px', fontWeight: '500' }}>Confirm Password</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '6px', boxSizing: 'border-box', outline: 'none', fontSize: '15px' }} 
            required 
          />
        </div>

        {/* Register Button - Matching your layout's explicit blue color */}
        <button type="submit" style={{ width: '100%', background: '#007bff', color: '#fff', border: 'none', padding: '14px', borderRadius: '24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px', transition: 'background 0.2s' }}>
          Register
        </button>
      </form>

      <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
        Already have an account? <span onClick={onSwitchToLogin} style={{ color: '#007bff', cursor: 'pointer', fontWeight: '600' }}>Login here</span>
      </p>
    </div>
  );
};

export default Register;