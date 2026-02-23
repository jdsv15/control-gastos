class App {
    static init() {
        // 1. Mostrar transacciones al cargar la página
        UI.displayTransactions();

        // 2. Manejo del Formulario
        document.getElementById('form').addEventListener('submit', (e) => {
            e.preventDefault();

            const text = document.getElementById('text').value;
            const amount = parseFloat(document.getElementById('amount').value);

            // Crear el objeto de la transacción
            const transaction = { id: Date.now(), text, amount };

            // Guardar y actualizar interfaz
            Store.addTransaction(transaction);
            UI.displayTransactions();
            UI.clearFields();
        });

        // 3. Manejo de Pestañas (Navegación)
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Cambiar clases activas en botones
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Mostrar la sección correspondiente
                const target = btn.getAttribute('data-tab');
                tabContents.forEach(section => {
                    section.style.display = section.id === `section-${target}` ? 'block' : 'none';
                });
            });
        });
    }

    // Método estático para ser llamado desde los botones 'x' en la UI
    static removeTransaction(id) {
        Store.removeTransaction(id);
        UI.displayTransactions();
    }
}

// Iniciar aplicación cuando el DOM termine de cargar
document.addEventListener('DOMContentLoaded', App.init);