import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import TransactionTracker from './components/TransactionTracker';
import TransactionForm from './components/TransactionForm';
import Login from './components/Login';
import Register from './components/Register';
import { authService } from './services/authService';

function App() {
  const [user, setUser] = useState(authService.getCurrentUser());
  
  // Set default view to 'dashboard' to match your initial screen choice
  const [currentTab, setCurrentTab] = useState('dashboard'); 
  const [showFormModal, setShowFormModal] = useState(false);
  const [authView, setAuthView] = useState('login');

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentTab('dashboard');
    setAuthView('login');
  };

  if (!user) {
    return (
      <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingTop: '40px' }}>
        {authView === 'login' ? (
          <Login onLoginSuccess={() => setUser(authService.getCurrentUser())} onSwitchToRegister={() => setAuthView('register')} />
        ) : (
          <Register onRegisterSuccess={() => setAuthView('login')} onSwitchToLogin={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  // Active Tab Styling Helper matching your layout design
  const navTabStyle = (tabName) => ({
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '15px',
    color: currentTab === tabName ? '#148650' : '#495057',
    paddingBottom: '6px',
    borderBottom: currentTab === tabName ? '3px solid #148650' : '3px solid transparent',
    transition: 'all 0.15s ease'
  });

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '50px' }}>
      
      {/* Main Top Navigation Header */}
      <nav style={{ background: '#fff', padding: '15px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>📂</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#148650', fontFamily: 'sans-serif' }}>ExpenseManager</span>
        </div>
        
        {/* All Three Core Interface Tabs */}
        <div style={{ display: 'flex', gap: '25px', fontFamily: 'sans-serif' }}>
          <div style={navTabStyle('dashboard')} onClick={() => setCurrentTab('dashboard')}>📊 Dashboard</div>
          <div style={navTabStyle('income')} onClick={() => setCurrentTab('income')}>📈 My Income</div>
          <div style={navTabStyle('expense')} onClick={() => setCurrentTab('expense')}>📉 My Expenses</div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontFamily: 'sans-serif' }}>
          <span style={{ color: '#212529', fontWeight: '500' }}>Hello, <b>{user.username}</b> !</span>
          <button onClick={handleLogout} style={{ background: '#f8f9fa', border: '1px solid #ced4da', padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', color: '#495057', fontSize: '13px' }}>Logout</button>
        </div>
      </nav>

      {/* Main Render Panel Switchboard */}
      <div style={{ paddingTop: '30px' }}>
        {currentTab === 'dashboard' && (
          <Dashboard onViewTabChange={(targetTab) => setCurrentTab(targetTab)} />
        )}
        {(currentTab === 'income' || currentTab === 'expense') && (
          <TransactionTracker type={currentTab} onAddNewClick={() => setShowFormModal(true)} />
        )}
      </div>

      {/* Unified Transaction Entry Form Modal */}
      {showFormModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <TransactionForm 
            type={currentTab}
            onTransactionSaved={() => {
              setShowFormModal(false);
              // Simple reload to reset state bounds across tracking summaries
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