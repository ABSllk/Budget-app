import { BudgetModel, toCents, formatCurrency } from "./model.js";
import { LocalStorageService } from "./storage.js";

// SELECT ELEMENTS
const balanceEl = document.querySelector(".balance .value");
const incomeTotalEl = document.querySelector(".income-total");
const outcomeTotalEl = document.querySelector(".outcome-total");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const allList = document.querySelector("#all .list");

// SELECT BUTTONS
const expenseBtn = document.querySelector(".first-tab");
const incomeBtn = document.querySelector(".second-tab");
const allBtn = document.querySelector(".third-tab");

// INPUT BTS
const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title-input");
const expenseAmount = document.getElementById("expense-amount-input");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");

const DELETE = "delete", EDIT = "edit";

const storage = new LocalStorageService("entry_list");
const model = new BudgetModel(storage.load());

updateUI();

// EVENT LISTENERS
expenseBtn.addEventListener("click", function () {
  show(expenseEl);
  hide([incomeEl, allEl]);
  active(expenseBtn);
  inactive([incomeBtn, allBtn]);
});
incomeBtn.addEventListener("click", function () {
  show(incomeEl);
  hide([expenseEl, allEl]);
  active(incomeBtn);
  inactive([expenseBtn, allBtn]);
});
allBtn.addEventListener("click", function () {
  show(allEl);
  hide([incomeEl, expenseEl]);
  active(allBtn);
  inactive([incomeBtn, expenseBtn]);
});

addExpense.addEventListener("click", function () {
  if (!expenseTitle.value || !expenseAmount.value) return;
  const cents = toCents(expenseAmount.value);
  if (cents < 1) {
    alert("Please enter a valid amount greater than or equal to 0.01");
    return;
  }
  model.addEntry("expense", expenseTitle.value, cents);
  updateUI();
  clearInput([expenseTitle, expenseAmount]);
});

addIncome.addEventListener("click", function () {
  if (!incomeTitle.value || !incomeAmount.value) return;
  const cents = toCents(incomeAmount.value);
  if (cents < 1) {
    alert("Please enter a valid amount greater than or equal to 0.01");
    return;
  }
  model.addEntry("income", incomeTitle.value, cents);
  updateUI();
  clearInput([incomeTitle, incomeAmount]);
});

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

// HELPER FUNCS
function deleteOrEdit(event) {
  const targetBtn = event.target;
  const entry = targetBtn.parentNode;

  if (targetBtn.id == EDIT) {
    editEntry(entry);
  } else if (targetBtn.id == DELETE) {
    deleteEntry(entry);
  }
}

function deleteEntry(entry) {
  model.removeEntry(Number(entry.id));
  updateUI();
}

function editEntry(entry) {
  const ENTRY = model.getEntry(Number(entry.id));
  if (ENTRY.type == "income") {
    incomeTitle.value = ENTRY.title;
    incomeAmount.value = ENTRY.amount / 100;
  } else if (ENTRY.type == "expense") {
    expenseTitle.value = ENTRY.title;
    expenseAmount.value = ENTRY.amount / 100;
  }
  deleteEntry(entry);
}

function updateUI() {
  const income = model.totalIncome;
  const outcome = model.totalExpense;
  const balance = Math.abs(model.balance);
  let sign = model.totalIncome >= model.totalExpense ? "$" : "-$";

  // UPDATE UI
  balanceEl.innerHTML = "";
  const bSmall = document.createElement("small");
  bSmall.textContent = sign;
  balanceEl.append(bSmall, formatCurrency(balance));

  outcomeTotalEl.innerHTML = "";
  const oSmall = document.createElement("small");
  oSmall.textContent = "$";
  outcomeTotalEl.append(oSmall, formatCurrency(outcome));

  incomeTotalEl.innerHTML = "";
  const iSmall = document.createElement("small");
  iSmall.textContent = "$";
  incomeTotalEl.append(iSmall, formatCurrency(income));

  clearElement([expenseList, incomeList, allList]);

  model.entries.forEach((entry, index) => {
    const formattedAmount = formatCurrency(entry.amount);
    if (entry.type == "expense") {
      showEntry(expenseList, entry.type, entry.title, formattedAmount, index);
    } else if (entry.type == "income") {
      showEntry(incomeList, entry.type, entry.title, formattedAmount, index);
    }
    showEntry(allList, entry.type, entry.title, formattedAmount, index);
  });

  updateChart(income, outcome);
  storage.save(model.entries);
}

function showEntry(list, type, title, amount, id) {
  const li = document.createElement("li");
  li.id = id;
  li.className = type;

  const entryDiv = document.createElement("div");
  entryDiv.className = "entry";
  entryDiv.textContent = `${title} : $${amount}`;

  const editDiv = document.createElement("div");
  editDiv.id = "edit";

  const deleteDiv = document.createElement("div");
  deleteDiv.id = "delete";

  li.append(entryDiv, editDiv, deleteDiv);
  list.prepend(li);
}

function clearElement(elements) {
  elements.forEach((element) => {
    element.innerHTML = "";
  });
}

function clearInput(inputs) {
  inputs.forEach((input) => {
    input.value = "";
  });
}

function show(element) {
  element.classList.remove("hide");
}

function hide(elements) {
  elements.forEach((element) => {
    element.classList.add("hide");
  });
}

function active(element) {
  element.classList.add("focus");
}

function inactive(elements) {
  elements.forEach((element) => {
    element.classList.remove("focus");
  });
}
