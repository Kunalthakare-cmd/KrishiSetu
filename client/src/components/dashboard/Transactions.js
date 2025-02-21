import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/farmer/transactions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-section">
      <h2>Transactions</h2>
      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <div className="transactions-list">
          {transactions.length > 0 ? (
            transactions.map(transaction => (
              <div key={transaction.id} className="transaction-card">
                <div className="transaction-header">
                  <h3>{transaction.type}</h3>
                  <span className={`amount ${transaction.type === 'credit' ? 'credit' : 'debit'}`}>
                    {transaction.type === 'credit' ? '+' : '-'} ${transaction.amount}
                  </span>
                </div>
                <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
                <p>Description: {transaction.description}</p>
              </div>
            ))
          ) : (
            <p>No transactions found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Transactions; 