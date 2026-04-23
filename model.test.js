import { BudgetModel } from './model.js';

// ===== addEntry =====
test('addEntry: 正常添加一条收入', () => {
  const model = new BudgetModel();
  model.addEntry('income', 'Salary', 1000);
  expect(model.entries.length).toBe(1);
  expect(model.entries[0]).toEqual({ type: 'income', title: 'Salary', amount: 1000 });
});

test('addEntry: 正常添加一条支出', () => {
  const model = new BudgetModel();
  model.addEntry('expense', 'Rent', 500);
  expect(model.entries[0].type).toBe('expense');
});

test('addEntry: 金额为0应该允许', () => {
  const model = new BudgetModel();
  model.addEntry('income', 'Gift', 0);
  expect(model.entries[0].amount).toBe(0);
});

test('addEntry: 负数金额应该报错', () => {
  const model = new BudgetModel();
  expect(() => model.addEntry('income', 'Test', -100)).toThrow(TypeError);
});

test('addEntry: 空title应该报错', () => {
  const model = new BudgetModel();
  expect(() => model.addEntry('income', '', 100)).toThrow(TypeError);
});

test('addEntry: 只有空格的title应该报错', () => {
  const model = new BudgetModel();
  expect(() => model.addEntry('income', '   ', 100)).toThrow(TypeError);
});

test('addEntry: 非法type应该报错', () => {
  const model = new BudgetModel();
  expect(() => model.addEntry('savings', 'Test', 100)).toThrow(RangeError);
});

// ===== removeEntry =====
test('removeEntry: 正常删除一条记录', () => {
  const model = new BudgetModel();
  model.addEntry('income', 'Salary', 1000);
  model.removeEntry(0);
  expect(model.entries.length).toBe(0);
});

test('removeEntry: 删除不存在的index应该报错', () => {
  const model = new BudgetModel();
  expect(() => model.removeEntry(0)).toThrow(RangeError);
});

test('removeEntry: 负数index应该报错', () => {
  const model = new BudgetModel();
  expect(() => model.removeEntry(-1)).toThrow(RangeError);
});

// ===== totalIncome / totalExpense / balance =====
test('totalIncome: 正确计算收入总和', () => {
  const model = new BudgetModel();
  model.addEntry('income', 'Salary', 1000);
  model.addEntry('income', 'Bonus', 500);
  expect(model.totalIncome).toBe(1500);
});

test('totalExpense: 正确计算支出总和', () => {
  const model = new BudgetModel();
  model.addEntry('expense', 'Rent', 800);
  model.addEntry('expense', 'Food', 200);
  expect(model.totalExpense).toBe(1000);
});

test('balance: 收入减支出', () => {
  const model = new BudgetModel();
  model.addEntry('income', 'Salary', 2000);
  model.addEntry('expense', 'Rent', 800);
  expect(model.balance).toBe(1200);
});

test('balance: 没有记录时为0', () => {
  const model = new BudgetModel();
  expect(model.balance).toBe(0);
});

// ===== getEntry =====
test('getEntry: 正确返回指定记录', () => {
  const model = new BudgetModel();
  model.addEntry('income', 'Salary', 1000);
  expect(model.getEntry(0)).toEqual({ type: 'income', title: 'Salary', amount: 1000 });
});

test('getEntry: 越界index返回null', () => {
  const model = new BudgetModel();
  expect(model.getEntry(5)).toBeNull();
});