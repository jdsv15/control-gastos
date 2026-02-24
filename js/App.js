// --- Array para guardar transacciones de la sesión actual ---
let sessionTransactions = [];

class App {
    static init() {
        UI.displayTransactions();

        // --- NUEVO: Setear fecha de hoy por defecto ---
        document.getElementById('date').value = new Date().toISOString().split('T')[0];

        document.getElementById('form').addEventListener('submit', (e) => {
            e.preventDefault();

            const text = document.getElementById('text').value;
            const amount = parseFloat(document.getElementById('amount').value);

            // --- NUEVO: Capturar fecha y categoría ---
            const category = document.getElementById('category').value;
            const date = document.getElementById('date').value;

            const transaction = { id: Date.now(), text, amount, category, date };

            Store.addTransaction(transaction);

            // --- NUEVO: Agregar a la sesión y actualizar vista ---
            sessionTransactions.push(transaction);

            UI.displayTransactions();
            UI.displaySessionTransactions(sessionTransactions);

            UI.clearFields();
            UI.showAlert('Transacción realizada exitosamente!');
        });

        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const target = btn.getAttribute('data-tab');
                tabContents.forEach(section => {
                    section.style.display = section.id === `section-${target}` ? 'block' : 'none';
                });
            });
        });
    }

    static removeTransaction(id) {
        Store.removeTransaction(id);

        // --- NUEVO: Quitar de la sesión actual si se elimina ---
        sessionTransactions = sessionTransactions.filter(t => t.id !== id);

        UI.displayTransactions();
        UI.displaySessionTransactions(sessionTransactions);
    }
}

document.addEventListener('DOMContentLoaded', App.init);