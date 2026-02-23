class App {
    static init() {
        // Inicializar vistas
        UI.displayTransactions();

        // Evento Formulario
        document.getElementById('form').addEventListener('submit', (e) => {
            e.preventDefault();

            const text = document.getElementById('text').value;
            const amount = parseFloat(document.getElementById('amount').value);

            const transaction = { id: Date.now(), text, amount };

            // Guardar y renderizar
            Store.addTransaction(transaction);
            UI.displayTransactions();
            UI.clearFields();

            // --- LÓGICA ISSUE 4: LLAMAR A LA ALERTA DE ÉXITO ---
            UI.showAlert('Transacción realizada exitosamente!');
        });

        // Navegación de Pestañas
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
        UI.displayTransactions();
    }
}

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', App.init);