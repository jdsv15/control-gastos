class Store {

    // Obtener todas las transacciones almacenadas
    static getTransactions() {
        let transactions;
        if (localStorage.getItem('transactions') === null) {
            transactions = [];
        } else {
            transactions = JSON.parse(localStorage.getItem('transactions'));
        }
        return transactions;
    }

    // Guardar una nueva transacción
    static addTransaction(transaction) {
        const transactions = Store.getTransactions();
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    // Eliminar una transacción específica por su ID
    static removeTransaction(id) {
        const transactions = Store.getTransactions();
        const updatedTransactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    }
}