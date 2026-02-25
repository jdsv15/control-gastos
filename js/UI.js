class UI {

    // Instancia del gráfico para actualizarlo
    static chartInstance = null;

    // Mostrar historial global (con filtros)
    static displayTransactions(filterCategory = 'Todas') {
        const transactions = Store.getTransactions();
        const globalList = document.getElementById('list-global');
        globalList.innerHTML = ''; // Limpiar lista 

        // Filtrar la lista según la categoría
        const filtered = filterCategory === 'Todas'
            ? transactions
            : transactions.filter(t => t.category === filterCategory);

        // Mapear resultados
        filtered.forEach(t => UI.addTransactionToList(t, globalList));

        // Actualizar balance, máximos y gráficos por filtrado
        UI.updateValues(filtered);
    }

    // Mostrar sesión actual
    static displaySessionTransactions(sessionData) {
        const sessionList = document.getElementById('list-session');
        sessionList.innerHTML = '';

        // Se pasa 'false' para evitar que se puedan borrar desde esta vista
        sessionData.forEach(t => UI.addTransactionToList(t, sessionList, false));
    }

    // Dar formato a la transacción
    static addTransactionToList(transaction, listElement, allowDelete = true) {
        const li = document.createElement('li');
        li.className = `list-item ${transaction.amount < 0 ? 'minus' : 'plus'}`;

        // Generar botón de borrar solo si está permitido
        const deleteBtnHTML = allowDelete
            ? `<button class="delete-btn" onclick="App.removeTransaction(${transaction.id})">x</button>`
            : '';

        // Formato textos secundarios
        const categoryText = transaction.category || 'Otros';
        const dateText = transaction.date ? ` | ${transaction.date}` : '';

        // Estructura de la transacción
        li.innerHTML = `
      ${deleteBtnHTML}
      <div class="details">
        <span>${transaction.text}</span>
        <small>${categoryText}${dateText}</small>
      </div>
      <span>${transaction.amount < 0 ? '-' : '+'}$${Math.abs(transaction.amount).toFixed(2)}</span>
    `;
        listElement.appendChild(li);
    }

    // Actualizar balances, máximos y alertas
    static updateValues(transactions) {
        const amounts = transactions.map(t => t.amount);
        const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

        // Arrays separados para calcular máximos y totales
        const incomes = amounts.filter(item => item > 0);
        const expenses = amounts.filter(item => item < 0);

        const totalIncome = incomes.reduce((acc, item) => (acc += item), 0);
        const totalExpense = (expenses.reduce((acc, item) => (acc += item), 0) * -1);

        // Actualizar balance principal y su color
        const balanceAmount = document.getElementById('balance-amount');
        balanceAmount.innerText = `$${total.replace('.00', '')}`;
        balanceAmount.style.color = total < 0 ? 'var(--danger-red)' : '#fff';

        // Lógica de alerta de presupuesto
        const budgetWarning = document.getElementById('budget-warning');
        if (budgetWarning) {
            budgetWarning.style.display = total < 0 ? 'block' : 'none';
        }

        // Lógica de valores máximos (Max Gasto y Max Ingreso)
        const maxIncome = incomes.length ? Math.max(...incomes).toFixed(2) : '0.00';
        const maxExpense = expenses.length ? Math.abs(Math.min(...expenses)).toFixed(2) : '0.00';

        document.getElementById('max-income').innerText = `$${maxIncome}`;
        document.getElementById('max-expense').innerText = `$${maxExpense}`;

        // Refrescar la visualización de datos
        UI.updateChart(totalIncome, totalExpense);
    }

    // Dibujar y actualizar el gráfico de barras horizontales (Chart.js)
    static updateChart(income, expense) {
        const ctx = document.getElementById('expense-chart').getContext('2d');

        // Destruir instancia previa
        if (UI.chartInstance) {
            UI.chartInstance.destroy();
        }

        // Barra gris si no hay datos
        const displayIncome = (income === 0 && expense === 0) ? 1 : income;
        const displayExpense = (income === 0 && expense === 0) ? 1 : expense;
        const colorIncome = (income === 0 && expense === 0) ? '#444' : '#2ecc71';
        const colorExpense = (income === 0 && expense === 0) ? '#444' : '#e74c3c';

        // Nueva instancia de Chart.js
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
                indexAxis: 'y', // Convertir a barra horizontal
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { stacked: true, display: false },
                    y: { stacked: true, display: false }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: (income !== 0 || expense !== 0) } // Desactivar tooltip si no hay datos
                },
                animation: { duration: 500 }
            }
        });
    }

    // Mensaje temporal info
    static showAlert(message) {
        const msgEl = document.getElementById('msg');
        if (msgEl) {
            msgEl.innerText = message;
            // Ocultar mensaje automáticamente después de 3 segundos
            setTimeout(() => msgEl.innerText = '', 3000);
        }
    }

    // Limpiar los campos del formulario tras una transacción
    static clearFields() {
        document.getElementById('text').value = '';
        document.getElementById('amount').value = '';
        // Restaurar a la fecha de hoy
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
    }
}