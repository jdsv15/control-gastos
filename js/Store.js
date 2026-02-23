class Store {
    static getTransactions() {
        let transactions;
        if (localStorage.getItem('transactions') === null) {
            transactions = [];
        } else {
            transactions = JSON.parse(localStorage.getItem('transactions'));
        }
        return transactions;
    }

    static addTransaction(transaction) {
        const transactions = Store.getTransactions();
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    static removeTransaction(id) {
        const transactions = Store.getTransactions();
        const updatedTransactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    }
}