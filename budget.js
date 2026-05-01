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

// INPUT BUTTONS
const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title-input");
const expenseAmount = document.getElementById("expense-amount-input");
const expenseError = document.getElementById("expense-error");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");
const incomeError = document.getElementById("income-error");

const DELETE = "delete";
const EDIT = "edit";

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
  const cents = validateEntry(expenseTitle, expenseAmount, expenseError);
  if (cents === null) return;

  model.addEntry("expense", expenseTitle.value.trim(), cents);

  updateUI();
  clearInput([expenseTitle, expenseAmount]);
  clearError(expenseError);
});

addIncome.addEventListener("click", function () {
  const cents = validateEntry(incomeTitle, incomeAmount, incomeError);
  if (cents === null) return;

  model.addEntry("income", incomeTitle.value.trim(), cents);

  updateUI();
  clearInput([incomeTitle, incomeAmount]);
  clearError(incomeError);
});

expenseTitle.addEventListener("input", function () {
  clearError(expenseError);
});

expenseAmount.addEventListener("input", function () {
  clearError(expenseError);
});

incomeTitle.addEventListener("input", function () {
  clearError(incomeError);
});

incomeAmount.addEventListener("input", function () {
  clearError(incomeError);
});

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

// HELPER FUNCTIONS
function getText(key) {
  if (window.tBudgetApp) {
    return window.tBudgetApp(key);
  }

  const fallbackText = {
    titleRequired: "Please enter a title.",
    amountRequired: "Please enter an amount.",
    validAmount: "Please enter a valid amount greater than or equal to 0.01."
  };

  return fallbackText[key] || key;
}

function showError(errorElement, message) {
  if (!errorElement) {
    alert(message);
    return;
  }

  errorElement.textContent = message;
}

function clearError(errorElement) {
  if (!errorElement) return;
  errorElement.textContent = "";
}

function validateEntry(titleInput, amountInput, errorElement) {
  const titleValue = titleInput.value.trim();
  const amountValue = amountInput.value.trim();

  if (!titleValue) {
    showError(errorElement, getText("titleRequired"));
    return null;
  }

  if (!amountValue) {
    showError(errorElement, getText("amountRequired"));
    return null;
  }

  const cents = toCents(amountValue);

  if (cents < 1) {
    showError(errorElement, getText("validAmount"));
    return null;
  }

  clearError(errorElement);
  return cents;
}

function deleteOrEdit(event) {
  const targetBtn = event.target;
  const entry = targetBtn.parentNode;

  if (targetBtn.id === EDIT) {
    editEntry(entry);
  } else if (targetBtn.id === DELETE) {
    deleteEntry(entry);
  }
}

function deleteEntry(entry) {
  model.removeEntry(Number(entry.id));
  updateUI();
}

function editEntry(entry) {
  const selectedEntry = model.getEntry(Number(entry.id));
  if (!selectedEntry) return;

  if (selectedEntry.type === "income") {
    incomeTitle.value = selectedEntry.title;
    incomeAmount.value = selectedEntry.amount / 100;

    show(incomeEl);
    hide([expenseEl, allEl]);
    active(incomeBtn);
    inactive([expenseBtn, allBtn]);
  } else if (selectedEntry.type === "expense") {
    expenseTitle.value = selectedEntry.title;
    expenseAmount.value = selectedEntry.amount / 100;

    show(expenseEl);
    hide([incomeEl, allEl]);
    active(expenseBtn);
    inactive([incomeBtn, allBtn]);
  }

  deleteEntry(entry);
}

function updateUI() {
  const income = model.totalIncome;
  const outcome = model.totalExpense;
  const balance = Math.abs(model.balance);
  const sign = model.totalIncome >= model.totalExpense ? "$" : "-$";

  // UPDATE BALANCE
  balanceEl.innerHTML = "";
  const bSmall = document.createElement("small");
  bSmall.textContent = sign;
  balanceEl.append(bSmall, formatCurrency(balance));

  // UPDATE OUTCOME
  outcomeTotalEl.innerHTML = "";
  const oSmall = document.createElement("small");
  oSmall.textContent = "$";
  outcomeTotalEl.append(oSmall, formatCurrency(outcome));

  // UPDATE INCOME
  incomeTotalEl.innerHTML = "";
  const iSmall = document.createElement("small");
  iSmall.textContent = "$";
  incomeTotalEl.append(iSmall, formatCurrency(income));

  clearElement([expenseList, incomeList, allList]);

  model.entries.forEach((entry, index) => {
    const formattedAmount = formatCurrency(entry.amount);

    if (entry.type === "expense") {
      showEntry(expenseList, entry.type, entry.title, formattedAmount, index);
    } else if (entry.type === "income") {
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

  const editDiv = document.createElement("button");
  editDiv.type = "button";
  editDiv.id = "edit";
  editDiv.setAttribute("aria-label", `Edit ${title}`);

  const deleteDiv = document.createElement("button");
  deleteDiv.type = "button";
  deleteDiv.id = "delete";
  deleteDiv.setAttribute("aria-label", `Delete ${title}`);

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
  element.setAttribute("aria-selected", "true");
}

function inactive(elements) {
  elements.forEach((element) => {
    element.classList.remove("focus");
    element.setAttribute("aria-selected", "false");
  });
}