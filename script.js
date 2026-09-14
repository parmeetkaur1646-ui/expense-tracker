let expenses = [];
let totalBudget = 0;
 
const categoryIcons = {
  General: '📝',
  Food: '🍔',
  Travel: '✈️',
  Bills: '🧾',
  Shopping: '🛍️',
  Other: '📦'
};
 
const nameInput = document.getElementById('expenseName');
const amountInput = document.getElementById('expenseAmount');
const categoryInput = document.getElementById('expenseCategory');
const addBtn = document.getElementById('addBtn');
const expenseList = document.getElementById('expenseList');
const emptyMsg = document.getElementById('emptyMsg');
const clearAllBtn = document.getElementById('clearAllBtn');
 
const budgetInput = document.getElementById('budgetInput');
const setBudgetBtn = document.getElementById('setBudgetBtn');
 
const totalBudgetVal = document.getElementById('totalBudgetVal');
const usedVal = document.getElementById('usedVal');
const remainVal = document.getElementById('remainVal');
const budgetBarFill = document.getElementById('budgetBarFill');
const barPercentLabel = document.getElementById('barPercentLabel');
const barCountLabel = document.getElementById('barCountLabel');
 
function formatCurrency(num) {
  const sign = num < 0 ? '-' : '';
  return sign + '₹' + Math.abs(num).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
 
function todayLabel() {
  const d = new Date();
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
 
function render() {
  expenseList.innerHTML = '';
 
  if (expenses.length === 0) {
    emptyMsg.style.display = 'block';
  } else {
    emptyMsg.style.display = 'none';
  }
 
  expenses.forEach((exp) => {
    const li = document.createElement('li');
    li.className = 'expense-item';
    li.innerHTML = `
      <div class="expense-left">
        <div class="expense-icon">${categoryIcons[exp.category] || '📝'}</div>
        <div class="expense-info">
          <span class="expense-name">${exp.name}</span>
          <span class="expense-meta">${exp.category} • ${exp.date}</span>
        </div>
      </div>
      <div class="expense-right">
        <span class="expense-amount">${formatCurrency(exp.amount)}</span>
        <button class="delete-btn" data-id="${exp.id}">✕</button>
      </div>
    `;
    expenseList.appendChild(li);
  });
 
  const used = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget - used;
  const percent = totalBudget > 0 ? Math.min(100, (used / totalBudget) * 100) : 0;
 
  totalBudgetVal.textContent = formatCurrency(totalBudget);
  usedVal.textContent = formatCurrency(used);
  remainVal.textContent = formatCurrency(remaining);
  remainVal.classList.toggle('negative', remaining < 0);
 
  budgetBarFill.style.width = percent + '%';
  barPercentLabel.textContent = percent.toFixed(0) + '% used';
  barCountLabel.textContent = expenses.length + (expenses.length === 1 ? ' expense' : ' expenses');
}
 
function addExpense() {
  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;
 
  if (!name) {
    alert('Please enter an expense name.');
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount greater than 0.');
    return;
  }
 
  expenses.push({
    id: Date.now(),
    name,
    amount,
    category,
    date: todayLabel()
  });
 
  nameInput.value = '';
  amountInput.value = '';
  categoryInput.value = 'General';
  nameInput.focus();
 
  render();
}
 
function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  render();
}
 
function setBudget() {
  const val = parseFloat(budgetInput.value);
  if (isNaN(val) || val < 0) {
    alert('Please enter a valid budget amount.');
    return;
  }
  totalBudget = val;
  budgetInput.value = '';
  render();
}
 
addBtn.addEventListener('click', addExpense);
setBudgetBtn.addEventListener('click', setBudget);
 
[nameInput, amountInput].forEach(el => {
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addExpense();
  });
});
budgetInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') setBudget();
});
 
expenseList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const id = Number(e.target.getAttribute('data-id'));
    deleteExpense(id);
  }
});
 
clearAllBtn.addEventListener('click', () => {
  if (expenses.length === 0) return;
  if (confirm('Clear all expenses?')) {
    expenses = [];
    render();
  }
});
 
render();
 