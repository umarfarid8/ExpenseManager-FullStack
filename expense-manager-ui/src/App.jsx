import React, { useState } from 'react';
import TransactionTracker from './components/TransactionTracker';
import TransactionForm from './components/TransactionForm';
import Login from './components/Login';
import { authService } from './services/authService';

function App() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [currentTab, setCurrentTab] = useState('expense');
  const [showFormModal, setShowFormModal] = useState(false);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  // 1. If user is not logged in, intercept layout and render Login Screen
  if (!user) {
    return (
      <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingTop: '20px' }}>
        <Login onLoginSuccess={() => setUser(authService.getCurrentUser())} onSwitchToRegister={() => alert("Redirecting to register layout...")} />
      </div>
    );
  }

  // 2. Normal Authenticated Application Screen View
  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '50px' }}>
      <nav style={{ background: '#fff', padding: '15px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>📂</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#148650' }}>ExpenseManager</span>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ cursor: 'pointer', fontWeight: 'bold', color: currentTab === 'income' ? '#148650' : '#495057' }} onClick={() => setCurrentTab('income')}>📈 My Income</div>
          <div style={{ cursor: 'pointer', fontWeight: 'bold', color: currentTab === 'expense' ? '#148650' : '#495057' }} onClick={() => setCurrentTab('expense')}>📉 My Expenses</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>👤 Hello, {user.username}!</span>
          <button onClick={handleLogout} style={{ background: '#f8f9fa', border: '1px solid #ced4da', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>

      <div style={{ paddingTop: '30px' }}>
        <TransactionTracker type={currentTab} onAddNewClick={() => setShowFormModal(true)} />
      </div>

      {showFormModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TransactionForm 
            type={currentTab}
            onTransactionSaved={() => {
              setShowFormModal(false);
              window.location.reload();
            }}
            onCancel={() => setShowFormModal(false)}
          />
        </div>
      )}
    </div>
  );
}

export default App;