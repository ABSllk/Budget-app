export function toCents(amountString) {
  return Math.round(parseFloat(amountString) * 100) || 0;
}

export function formatCurrency(cents) {
  return (cents / 100).toFixed(2);
}

export class BudgetModel {
  #entries = [];

  constructor(initialEntries = []) {
    this.#entries = initialEntries;
  }

  addEntry(type, title, amount) {
    if (!["income", "expense"].includes(type)) throw new RangeError("Invalid type");
    if (typeof title !== "string" || title.trim() === "") throw new TypeError("Title required");
    if (!Number.isFinite(amount) || amount < 0) throw new TypeError("Invalid amount");
    this.#entries.push({ type, title: title.trim(), amount });
  }

  removeEntry(index) {
    if (index < 0 || index >= this.#entries.length) throw new RangeError("Invalid index");
    this.#entries.splice(index, 1);
  }

  getEntry(index) {
    if (index < 0 || index >= this.#entries.length) return null;
    return { ...this.#entries[index] };
  }
  
  get entries() { 
    return this.#entries.map(e => ({ ...e })); 
  }
  
  get totalIncome() { 
    return this.#sumByType("income"); 
  }
  
  get totalExpense() { 
    return this.#sumByType("expense"); 
  }
  
  get balance() { 
    return this.totalIncome - this.totalExpense; 
  }

  #sumByType(type) {
    return this.#entries
      .filter(e => e.type === type)
      .reduce((sum, e) => sum + e.amount, 0);
  }
}
