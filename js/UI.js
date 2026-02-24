class UI {
    static chartInstance = null;

    static displayTransactions() {
        const transactions = Store.getTransactions();
        const globalList = document.getElementById('list-global');
        globalList.innerHTML = '';

        transactions.forEach(t => UI.addTransactionToList(t, globalList));
        UI.updateValues(transactions);
    }

    // --- NUEVO: Mostrar lista de sesión ---
    static displaySessionTransactions(sessionData) {
        const sessionList = document.getElementById('list-session');
        sessionList.innerHTML = '';

        // allowDelete se pasa como false para que no se puedan borrar desde la sesión temporal
        sessionData.forEach(t => UI.addTransactionToList(t, sessionList, false));
    }

    static addTransactionToList(transaction, listElement, allowDelete = true) {
        const li = document.createElement('li');
        li.className = `list-item ${transaction.amount < 0 ? 'minus' : 'plus'}`;

        const deleteBtnHTML = allowDelete
            ? `<button class="delete-btn" onclick="App.removeTransaction(${transaction.id})">x</button>`
            : '';

        // --- NUEVO: Se agregan detalles (categoría y fecha) ---
        const categoryText = transaction.category ? transaction.category : 'Otros';
        const dateText = transaction.date ? transaction.date : '';

        li.innerHTML = `
      ${deleteBtnHTML}
      <div class="details">
        <span>${transaction.text}</span>
        <small>${categoryText} | ${dateText}</small>
      </div>
      <span>${transaction.amount < 0 ? '-' : '+'}$${Math.abs(transaction.amount).toFixed(2)}</span>
    `;
        listElement.appendChild(li);
    }

    static updateValues(transactions) {
        const amounts = transactions.map(t => t.amount);
        const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
        const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0);
        const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1);

        const balanceAmount = document.getElementById('balance-amount');
        balanceAmount.innerText = `$${total.replace('.00', '')}`;
        balanceAmount.style.color = total < 0 ? 'var(--danger-red)' : '#fff';

        const budgetWarning = document.getElementById('budget-warning');
        if (budgetWarning) {
            budgetWarning.style.display = total < 0 ? 'block' : 'none';
        }

        UI.updateChart(income, expense);
    }

    static updateChart(income, expense) {
        const ctx = document.getElementById('expense-chart').getContext('2d');

        if (UI.chartInstance) {
            UI.chartInstance.destroy();
        }

        const displayIncome = (income === 0 && expense === 0) ? 1 : income;
        const displayExpense = (income === 0 && expense === 0) ? 1 : expense;
        const colorIncome = (income === 0 && expense === 0) ? '#444' : '#2ecc71';
        const colorExpense = (income === 0 && expense === 0) ? '#444' : '#e74c3c';

        UI.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [''],
                datasets: [
                    { data: [displayIncome], backgroundColor: colorIncome, barThickness: 25, borderWidth: 0 },
                    { data: [displayExpense], backgroundColor: colorExpense, barThickness: 25, borderWidth: 0 }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { stacked: true, display: false },
                    y: { stacked: true, display: false }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: (income !== 0 || expense !== 0) }
                },
                animation: { duration: 500 }
            }
        });
    }

    static showAlert(message) {
        const msgEl = document.getElementById('msg');
        if (msgEl) {
            msgEl.innerText = message;
            setTimeout(() => msgEl.innerText = '', 3000);
        }
    }

    static clearFields() {
        document.getElementById('text').value = '';
        document.getElementById('amount').value = '';
        // Reseteamos la fecha a hoy
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
    }
}