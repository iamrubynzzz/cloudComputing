// DOM Elements
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// Add transaction
async function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
  } else {
    const transaction = {
      text: text.value,
      amount: +amount.value
    };

    try {
      const res = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
      });

      const data = await res.json();

      if (data.success) {
        addTransactionDOM(data.data);
        updateValues(false);
        text.value = '';
        amount.value = '';
      } else {
        console.error('Error occurred:', data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error occurred:', err);
    }
  }
}

// Add transaction to DOM list
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}$${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction('${transaction._id}')">x</button>
  `;

  list.appendChild(item);
}

// Update the balance, income, and expense
async function updateValues(isFirst) {
  try {
    const res = await fetch('http://localhost:5000/api/transactions');
    const data = await res.json();

    if (data.success) {
      const transactions = data.data;
      const amounts = transactions.map(transaction => transaction.amount);
      const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
      const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
      const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);
      if(isFirst === true){
        transactions.map(transaction => {addTransactionDOM(transaction)});
      }
      balance.innerText = `$${total}`;
      money_plus.innerText = `$${income}`;
      money_minus.innerText = `$${expense}`;
    } else {
      console.error('Error occurred:', data.error || 'Unknown error');
    }
  } catch (err) {
    console.error('Error occurred:', err);
  }
}

// Remove transaction by ID
async function removeTransaction(id) {
  try {
    await fetch(`http://localhost:5000/api/transactions/${id}`, {
      method: 'DELETE'
    });

    init(); // Re-fetch and re-render transactions
  } catch (err) {
    console.error('Error:', err);
  }
}

// Initialize app
async function init() {
  list.innerHTML = '';
  await updateValues(true);
}

init(); // Initialize app

// Event listeners
form.addEventListener('submit', addTransaction);
