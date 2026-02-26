// Clase App: Es el controlador principal. 
// Une los datos (Store) con lo visual (UI) y maneja los eventos de los botones y el formulario.

// Array para guardar transacciones de la sesión actual 
let sessionTransactions = [];

class App {

    // INICIALIZACIÓN DE LA APLICACIÓN
    static init() {

        // Cargar transacciones aplicando el filtro seleccionado por defecto
        UI.displayTransactions(document.getElementById('filter-category').value);

        // Establecer la fecha actual
        document.getElementById('date').value = new Date().toISOString().split('T')[0];

        // CAMBIO DE FILTRO
        document.getElementById('filter-category').addEventListener('change', (e) => {
            UI.displayTransactions(e.target.value);
        });

        // ENVÍO DE FORMULARIO (NUEVA TRANSACCIÓN)
        document.getElementById('form').addEventListener('submit', (e) => {
            e.preventDefault();

            // Capturar valores de los inputs
            const text = document.getElementById('text').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const category = document.getElementById('category').value;
            const date = document.getElementById('date').value;

            // Crear objeto de la transacción
            const transaction = { id: Date.now(), text, amount, category, date };

            // Guardar en LocalStorage y en estado temporal (Sesión)
            Store.addTransaction(transaction);
            sessionTransactions.push(transaction);

            // Actualizar las listas en pantalla manteniendo el filtro actual
            const currentFilter = document.getElementById('filter-category').value;
            UI.displayTransactions(currentFilter);
            UI.displaySessionTransactions(sessionTransactions);

            // Resetear formulario y mostrar notificación
            UI.clearFields();
            UI.showAlert('Transacción realizada exitosamente!');
        });

        // NAVEGACIÓN POR PESTAÑAS (TABS)
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Actualizar botón activo
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Mostrar el contenido de la pestaña seleccionada
                const target = btn.getAttribute('data-tab');
                tabContents.forEach(section => {
                    section.style.display = section.id === `section-${target}` ? 'block' : 'none';
                });

                // Quitar filtro en "Sesión Actual"
                const filterElement = document.getElementById('filter-category');
                if (target === 'session') {
                    filterElement.style.display = 'none';
                } else {
                    filterElement.style.display = 'block';
                }
            });
        });
    }

    // ELIMINACIÓN DE TRANSACCIÓN
    static removeTransaction(id) {
        // Borrar de LocalStorage y de la sesión temporal
        Store.removeTransaction(id);
        sessionTransactions = sessionTransactions.filter(t => t.id !== id);

        // Renderizar vistas actualizadas respetando el filtro
        const currentFilter = document.getElementById('filter-category').value;
        UI.displayTransactions(currentFilter);
        UI.displaySessionTransactions(sessionTransactions);
    }
}

// ARRANQUE DEL SISTEMA AL CARGAR EL DOM
document.addEventListener('DOMContentLoaded', App.init);