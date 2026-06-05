import React, { useState, useEffect } from 'react';
import { categoryService, expenseService, incomeService } from '../services/transactionService';

const TransactionForm = ({ type = 'expense', onTransactionSaved, onCancel }) => {
  const isExpense = type === 'expense';
  
  // Form input states
  const [amount, setAmount] = useState('0.00');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-06-01'); // Standardizing on your 2026 baseline layout
  
  // Operational lookup states
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch the backend lookup values when the component renders
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (err) {
        setErrorMessage('Failed to load transaction categories from API.');
      }
    };
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Field Validation Checks
    if (!categoryId) {
      setErrorMessage('Please select a valid category.');
      return;
    }
    if (parseFloat(amount) <= 0) {
      setErrorMessage('Amount must be greater than zero.');
      return;
    }

    // Match the exact DTO payloads expected by our ASP.NET controllers
    const payload = {
      title: description || (isExpense ? "Logged Expense" : "Logged Income"),
      amount: parseFloat(amount),
      description: description,
      date: new Date(date).toISOString(),
      categoryId: parseInt(categoryId),
      userId: 1 // hardcoded to map with our backend seed user ID
    };

    try {
      if (isExpense) {
        await expenseService.create(payload);
      } else {
        await incomeService.create(payload);
      }
      if (onTransactionSaved) onTransactionSaved();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'An error occurred while saving.');
    }
  };

  // Color theme definitions matching your layouts
  const themeColor = isExpense ? '#d93847' : '#148650';

  return (
    <div style={{ maxWidth: '450px', background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontFamily: 'sans-serif', margin: '20px auto' }}>
      
      {/* Dynamic Header Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{ fontSize: '28px' }}>{isExpense ? '💸' : '💰'}</span>
        <h2 style={{ margin: 0, color: themeColor, fontSize: '26px', fontWeight: 'bold' }}>
          Log New {isExpense ? 'Expense' : 'Income'}
        </h2>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #e9ecef', marginBottom: '20px' }} />

      {errorMessage && <p style={{ color: '#d93847', fontSize: '14px', marginBottom: '15px' }}>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        
        {/* Amount Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#212529', fontSize: '14px' }}>Amount</label>
          <div style={{ display: 'flex', border: '1px solid #ced4da', borderRadius: '8px', overflow: 'hidden' }}>
            <span style={{ background: '#e9ecef', padding: '12px 16px', color: '#495057', borderRight: '1px solid #ced4da', fontSize: '15px' }}>Rs.</span>
            <input 
              type="number" 
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: '100%', border: 'none', padding: '12px', outline: 'none', fontSize: '16px' }}
            />
          </div>
        </div>

        {/* Category Selection Dropdown */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#212529', fontSize: '14px' }}>Category</label>
          <select 
            value={categoryId} 
            onChange={(e) => setCategoryId(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '8px', background: '#fff', fontSize: '15px', color: '#495057', outline: 'none' }}
          >
            <option value="">-- Select Category --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Description Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#212529', fontSize: '14px' }}>Description</label>
          <input 
            type="text" 
            placeholder={isExpense ? "What was this expense for?" : "What was the source of this income?"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '8px', boxSizing: 'border-box', fontSize: '15px', outline: 'none' }}
          />
        </div>

        {/* Date Selector */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#212529', fontSize: '14px' }}>Date</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '8px', boxSizing: 'border-box', fontSize: '15px', color: '#495057', outline: 'none' }}
          />
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="submit" 
            style={{ flex: 2, background: themeColor, color: '#fff', border: 'none', padding: '14px', borderRadius: '24px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s' }}
          >
            Save Transaction
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            style={{ flex: 1, background: '#f8f9fa', color: '#212529', border: 'none', padding: '14px', borderRadius: '24px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
};

export default TransactionForm;