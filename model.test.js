import { BudgetModel, toCents, formatCurrency } from './model.js';

// ===== toCents =====
test('toCents: converts normal amount correctly', () => {
  expect(toCents('10.00')).toBe(1000);
});

test('toCents: handles decimal values', () => {
  expect(toCents('9.99')).toBe(999);
});

test('toCents: handles integer input', () => {
  expect(toCents('5')).toBe(500);
});

test('toCents: returns 0 for invalid input', () => {
  expect(toCents('abc')).toBe(0);
});

// ===== formatCurrency =====
test('formatCurrency: formats cents correctly', () => {
  expect(formatCurrency(1000)).toBe('10.00');
});

test('formatCurrency: formats decimal cents correctly', () => {
  expect(formatCurrency(999)).toBe('9.99');
});

test('formatCurrency: formats zero correctly', () => {
  expect(formatCurrency(0)).toBe('0.00');
});

// ===== addEntry =====
test('addEntry: adds an income entry successfully', () => {
  const model = new BudgetModel();
  model.addEntry('income', 'Salary', 1000);
  expect(model.entries.length).toBe(1);
  expect(model.entries[0]).toEqual({ type: 'income', title: 'Salary', amount: 1000 });
});

test('addEntry: adds an expense entry successfully', () => {
  const model = new BudgetModel();
  model.addEntry('expense', 'Rent', 500);
  expect(model.entries[0].type).toBe('expense');
});

test('addEntry: allows zero amount', () => {
  const model = new BudgetModel();
  model.addEntry('income', 'Gift', 0);
  expect(model.entries[0].amount).toBe(0);
});

test('addEntry: throws TypeError for negative amount', () => {
  const model = new BudgetModel();
  expect(() => model.addEntry('income', 'Test', -100)).toThrow(TypeError);
});

test('addEntry: throws TypeError for empty title', () => {
  const model = new BudgetModel();
  expect(() => model.addEntry('income', '', 100)).toThrow(TypeError);
});

test('addEntry: throws TypeError for whitespace-only title', () => {
  const model = new BudgetModel();
  expect(() => model.addEntry('income', '   ', 100)).toThrow(TypeError);
});

test('addEntry: throws RangeError for invalid type', () => {
  const model = new BudgetModel();
  expect(() => model.addEntry('savings', 'Test', 100)).toThrow(RangeError);
});

// ===== removeEntry =====
test('removeEntry: removes an entry successfully', () => {
  const model = new BudgetModel();
  model.addEntry('income', 'Salary', 1000);
  model.removeEntry(0);
  expect(model.entries.length).toBe(0);
});

test('removeEntry: throws RangeError for non-existent index', () => {
  const model = new BudgetModel();
  expect(() => model.removeEntry(0)).toThrow(RangeError);
});

test('removeEntry: throws RangeError for negative index', () => {
  const model = new BudgetModel();
  expect(() => model.removeEntry(-1)).toThrow(RangeError);
});

// ===== totalIncome / totalExpense / balance =====
test('totalIncome: calculates total income correctly', () => {
  const model = new BudgetModel();
  model.addEntry('income', 'Salary', 1000);
  model.addEntry('income', 'Bonus', 500);
  expect(model.totalIncome).toBe(1500);
});

test('totalExpense: calculates total expense correctly', () => {
  const model = new BudgetModel();
  model.addEntry('expense', 'Rent', 800);
  model.addEntry('expense', 'Food', 200);
  expect(model.totalExpense).toBe(1000);
});

test('balance: returns income minus expense', () => {
  const model = new BudgetModel();
  model.addEntry('income', 'Salary', 2000);
  model.addEntry('expense', 'Rent', 800);
  expect(model.balance).toBe(1200);
});

test('balance: returns 0 when no entries', () => {
  const model = new BudgetModel();
  expect(model.balance).toBe(0);
});

// ===== getEntry =====
test('getEntry: returns correct entry at index', () => {
  const model = new BudgetModel();
  model.addEntry('income', 'Salary', 1000);
  expect(model.getEntry(0)).toEqual({ type: 'income', title: 'Salary', amount: 1000 });
});

test('getEntry: returns null for out-of-bounds index', () => {
  const model = new BudgetModel();
  expect(model.getEntry(5)).toBeNull();
});