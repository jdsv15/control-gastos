/**
 * CONTROL DE GASTOS - VERSIÓN INICIAL (Issues #1 y #2)
 * Script principal consolidado para el primer commit.
 */

// --- 1. REFERENCIAS AL DOM ---
const balanceAmount = document.getElementById('balance-amount');
const form = document.getElementById('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');

// --- 2. ESTADO GLOBAL (Persistencia básica) ---
// Obtenemos las transacciones del LocalStorage o iniciamos un array vacío
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// --- 3. FUNCIONES DE LA INTERFAZ ---

// Actualiza el balance general en el encabezado
function updateBalance() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    // Mostramos el total en el elemento h1
    balanceAmount.innerText = `$${total}`;
}

// --- 4. CONTROLADOR PRINCIPAL ---

// Agrega una nueva transacción desde el formulario
function addTransaction(e) {
    e.preventDefault();

    // Validar que los campos no estén vacíos
    if (textInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('Por favor agrega un texto y una cantidad');
        return;
    }

    // Crear objeto de transacción básico
    const transaction = {
        id: Math.floor(Math.random() * 100000000),
        text: textInput.value,
        amount: +amountInput.value // El símbolo '+' convierte el string a número
    };

    // Agregar al array principal
    transactions.push(transaction);

    // Actualizar la interfaz (solo el balance)
    updateBalance();

    // Guardar en LocalStorage para no perder los datos al recargar
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Limpiar formulario
    textInput.value = '';
    amountInput.value = '';
}

// Inicializar la aplicación
function init() {
    updateBalance();
}

// --- 5. EVENT LISTENERS ---
form.addEventListener('submit', addTransaction);

// Arrancar la app
init();