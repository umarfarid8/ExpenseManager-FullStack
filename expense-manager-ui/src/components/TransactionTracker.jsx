import React, { useState, useEffect } from 'react';
import { expenseService, incomeService } from '../services/transactionService';
import { authService } from '../services/authService';

const TransactionTracker = ({ type = 'expense', onAddNewClick }) => {
  const isExpense = type === 'expense';
  
  // FIXED: Dynamic extraction of the authenticated active user ID
  const currentUser = authService.getCurrentUser();
  const userId = currentUser ? currentUser.userId : 1; 

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load transactions from API on mount or type change
  const loadData = async () => {
    setLoading(true);
    try {
      const data = isExpense 
        ? await expenseService.getByUserId(userId)
        : await incomeService.getByUserId(userId);
      setTransactions(data);
    } catch (err) {
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [type]);

  // Handle transaction deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        isExpense ? await expenseService.delete(id) : await incomeService.delete(id);
        // Refresh local state lists instantly
        setTransactions(transactions.filter(t => t.id !== id));
      } catch (err) {
        alert("Failed to delete transaction.");
      }
    }
  };

  // Helper to format dates cleanly (e.g., "Jun 01, 2026")
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate dynamic summary values using Array.reduce
  const totalAmount = transactions.reduce((sum, item) => sum + item.amount, 0);

  // Component Theme Mappings
  const themeColor = isExpense ? '#d93847' : '#148650';
  const pageTitle = isExpense ? 'Expense Tracker' : 'Income Tracker';
  const pageSubtitle = isExpense 
    ? 'Manage and track your personal outgoing transactions' 
    : 'Manage and track your incoming revenues and deposits';
  const bannerLabel = isExpense ? 'TOTAL EXPENSES LOGGED' : 'TOTAL EARNINGS LOGGED';
  const actionButtonText = isExpense ? '+ Add New Expense' : '+ Add New Income';

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>Syncing with database...</div>;

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
        <div>
          <h2 style={{ fontSize: '28px', margin: '0 0 6px 0', color: '#212529', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>{isExpense ? '📋' : '💼'}</span> {pageTitle}
          </h2>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>{pageSubtitle}</p>
        </div>
        <button 
          onClick={onAddNewClick}
          style={{ background: themeColor, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '24px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}
        >
          {actionButtonText}
        </button>
      </div>

      {/* Massive Summary Value Card Block */}
      <div style={{ background: themeColor, color: '#fff', padding: '30px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.5px', opacity: 0.9 }}>{bannerLabel}</span>
        <h1 style={{ fontSize: '42px', margin: '10px 0 0 0', fontWeight: 'bold' }}>
          Rs. {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h1>
      </div>

      {/* Historical Logs Data Grid Table */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '15px' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #edf2f7', color: '#4a5568' }}>
              <th style={{ padding: '16px 20px', fontWeight: 'bold' }}>Date</th>
              <th style={{ padding: '16px 20px', fontWeight: 'bold' }}>Category</th>
              <th style={{ padding: '16px 20px', fontWeight: 'bold' }}>Description</th>
              <th style={{ padding: '16px 20px', fontWeight: 'bold' }}>Amount</th>
              <th style={{ padding: '16px 20px', fontWeight: 'bold', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#a0aec0' }}>No history entries logged yet. Click the action button above to get started!</td>
              </tr>
            ) : (
              transactions.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #edf2f7', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px 20px', color: '#2d3748' }}>{formatDate(item.date)}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ background: isExpense ? '#6c757d' : '#00b4d8', color: '#fff', padding: '4px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: '600' }}>
                      {item.categoryName || 'General'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#4a5568' }}>{item.description || '—'}</td>
                  <td style={{ padding: '16px 20px', fontWeight: 'bold', color: themeColor }}>
                    Rs. {item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button 
                      onClick={() => alert(`Edit item logic for ID ${item.id}`)}
                      style={{ background: 'none', border: 'none', color: '#3182ce', cursor: 'pointer', fontSize: '14px', marginRight: '15px', fontWeight: '500' }}
                    >
                      📝 Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default TransactionTracker;