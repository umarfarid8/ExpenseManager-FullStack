import React, { useState, useEffect } from 'react';
import { expenseService, incomeService } from '../services/transactionService';
import { authService } from '../services/authService';

const Dashboard = ({ onViewTabChange }) => {
  const [totals, setTotals] = useState({ inflows: 0, outgoings: 0, savings: 0 });
  const [loading, setLoading] = useState(true);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchCalculatedSummary = async () => {
      if (!currentUser) return;
      try {
        // Concurrently fetch both streams to eliminate network waterfalls
        const [incomes, expenses] = await Promise.all([
          incomeService.getByUserId(currentUser.userId),
          expenseService.getByUserId(currentUser.userId)
        ]);

        const totalInflows = incomes.reduce((sum, item) => sum + item.amount, 0);
        const totalOutgoings = expenses.reduce((sum, item) => sum + item.amount, 0);

        setTotals({
          inflows: totalInflows,
          outgoings: totalOutgoings,
          savings: totalInflows - totalOutgoings
        });
      } catch (err) {
        console.error("Error loading dashboard indices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalculatedSummary();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>Analyzing financial health...</div>;

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Welcome Alert Panel */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', marginBottom: '35px', textAlign: 'left', borderLeft: '6px solid #148650' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#212529', fontWeight: 'bold' }}>
          Welcome Back, {currentUser?.username} ! 👋
        </h1>
        <p style={{ margin: 0, color: '#6c757d', fontSize: '15px', lineHeight: '1.5' }}>
          Here is your real-time financial tracking health overview. Keep tabs on your income flow and incoming expense barriers effortlessly.
        </p>
      </div>

      {/* Metric Cards Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        
        {/* Card 1: Total Cash Inflows */}
        <div style={{ background: '#148650', color: '#fff', padding: '25px', borderRadius: '14px', boxShadow: '0 4px 15px rgba(20,134,80,0.15)', textAlign: 'left' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px', opacity: 0.85, textTransform: 'uppercase' }}>Total Cash Inflows</span>
          <h2 style={{ fontSize: '34px', margin: '12px 0 20px 0', fontWeight: 'bold' }}>
            Rs. {totals.inflows.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
          <button onClick={() => onViewTabChange('income')} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
            View Inflows →
          </button>
        </div>

        {/* Card 2: Total Outgoing Costs */}
        <div style={{ background: '#d93847', color: '#fff', padding: '25px', borderRadius: '14px', boxShadow: '0 4px 15px rgba(217,56,71,0.15)', textAlign: 'left' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px', opacity: 0.85, textTransform: 'uppercase' }}>Total Outgoing Costs</span>
          <h2 style={{ fontSize: '34px', margin: '12px 0 20px 0', fontWeight: 'bold' }}>
            Rs. {totals.outgoings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
          <button onClick={() => onViewTabChange('expense')} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
            View Outgoings →
          </button>
        </div>

        {/* Card 3: Net Disposable Savings */}
        <div style={{ background: '#ffc107', color: '#212529', padding: '25px', borderRadius: '14px', boxShadow: '0 4px 15px rgba(255,193,7,0.15)', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px', opacity: 0.8, textTransform: 'uppercase' }}>Net Disposable Savings</span>
            <h2 style={{ fontSize: '34px', margin: '12px 0 15px 0', fontWeight: 'bold' }}>
              Rs. {totals.savings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
          </div>
          
          {/* Dynamic Deficit Warning Engine directly from your screen layout */}
          {totals.savings < 0 ? (
            <div style={{ background: '#fff', color: '#d93847', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', alignSelf: 'flex-start', border: '1px solid #d93847', fontFamily: 'monospace' }}>
              ⚠️ Budget Deficit Warning
            </div>
          ) : (
            <div style={{ background: '#fff', color: '#148650', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', alignSelf: 'flex-start', fontFamily: 'monospace' }}>
              ✓ Budget Stable
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;