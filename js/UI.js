class UI {
    static chartInstance = null;

    static displayTransactions() {
        const transactions = Store.getTransactions();
        const globalList = document.getElementById('list-global');
        globalList.innerHTML = '';

        transactions.forEach(t => UI.addTransactionToList(t, globalList));
        UI.updateValues(transactions);
    }

    static addTransactionToList(transaction, listElement) {
        const li = document.createElement('li');
        li.className = `list-item ${transaction.amount < 0 ? 'minus' : 'plus'}`;

        // El botón de eliminar llama a App.removeTransaction
        const deleteBtnHTML = `<button class="delete-btn" onclick="App.removeTransaction(${transaction.id})">x</button>`;

        li.innerHTML = `
      ${deleteBtnHTML}
      <span>${transaction.text}</span>
      <span>$${Math.abs(transaction.amount).toFixed(2)}</span>
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
        balanceAmount.style.color = total < 0 ? '#e74c3c' : '#fff';

        // Actualizar Gráfico
        UI.updateChart(income, expense);
    }

    static updateChart(income, expense) {
        const ctx = document.getElementById('expense-chart').getContext('2d');

        if (UI.chartInstance) {
            UI.chartInstance.destroy();
        }

        // Si no hay datos, mostrar barras grises por defecto
        const displayIncome = (income === 0 && expense === 0) ? 1 : income;
        const displayExpense = (income === 0 && expense === 0) ? 1 : expense;
        const colorIncome = (income === 0 && expense === 0) ? '#444' : '#2ecc71';
        const colorExpense = (income === 0 && expense === 0) ? '#444' : '#e74c3c';

        UI.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [''], // Etiqueta vacía para barra horizontal única
                datasets: [
                    {
                        label: 'Ingresos',
                        data: [displayIncome],
                        backgroundColor: colorIncome,
                        barThickness: 25,
                        borderWidth: 0
                    },
                    {
                        label: 'Gastos',
                        data: [displayExpense],
                        backgroundColor: colorExpense,
                        barThickness: 25,
                        borderWidth: 0
                    }
                ]
            },
            options: {
                indexAxis: 'y', // Convierte la barra en horizontal
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

    static clearFields() {
        document.getElementById('text').value = '';
        document.getElementById('amount').value = '';
    }
}