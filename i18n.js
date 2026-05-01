const translations = {
  en: {
    privacyPolicy: "Privacy Policy",
    balance: "Balance",
    income: "Income",
    outcome: "Outcome",
    dashboard: "Dashboard",
    expenses: "Expenses",
    all: "All",
    titlePlaceholder: "title",
    addExpenseAlt: "Add expense",
    addIncomeAlt: "Add income",
    expenseTitleLabel: "Expense title",
    expenseAmountLabel: "Expense amount (dollars)",
    incomeTitleLabel: "Income title",
    incomeAmountLabel: "Income amount (dollars)",
    chartAriaLabel: "Income vs expense donut chart",

    cookieTitle: "Cookie Notice",
    cookieText:
      "We use essential cookies and local storage to remember your preferences and improve the app experience.",
    learnMore: "Learn more",
    declineCookies: "Decline",
    acceptCookies: "Accept",

    titleRequired: "Please enter a title.",
    amountRequired: "Please enter an amount.",
    validAmount: "Please enter a valid amount greater than or equal to 0.01.",

    privacyTitle: "Privacy Policy",
    privacyIntro:
      "This Privacy Policy explains how the Budget App handles user data.",
    dataStoredTitle: "Data We Store",
    dataStoredText:
      "The Budget App stores budget entries, language preference, and cookie choice locally in your browser. This data is not sent to an external server.",
    cookieStorageTitle: "Cookies and Local Storage",
    cookieStorageText:
      "The app uses local storage to remember your selected language and cookie banner choice. This improves usability and prevents the same notice from appearing repeatedly.",
    userControlTitle: "User Control",
    userControlText:
      "You can clear your browser storage at any time to remove saved budget records and preferences.",
    noSellingTitle: "Data Sharing",
    noSellingText:
      "This student project does not sell, rent, or share personal data with third parties.",
    backHome: "Back to Budget App",

    landscapeMode: "Landscape",
    landscapeToggleAlt: "Toggle landscape mode"
  },

  zh: {
    privacyPolicy: "隐私政策",
    balance: "余额",
    income: "收入",
    outcome: "支出",
    dashboard: "控制面板",
    expenses: "支出",
    all: "全部",
    titlePlaceholder: "标题",
    addExpenseAlt: "添加支出",
    addIncomeAlt: "添加收入",
    expenseTitleLabel: "支出标题",
    expenseAmountLabel: "支出金额（元）",
    incomeTitleLabel: "收入标题",
    incomeAmountLabel: "收入金额（元）",
    chartAriaLabel: "收入与支出环形图",

    cookieTitle: "Cookie 提示",
    cookieText:
      "我们使用必要的 Cookie 和本地存储来记住你的偏好，并改善应用体验。",
    learnMore: "了解更多",
    declineCookies: "拒绝",
    acceptCookies: "接受",

    titleRequired: "请输入标题。",
    amountRequired: "请输入金额。",
    validAmount: "请输入大于或等于 0.01 的有效金额。",

    privacyTitle: "隐私政策",
    privacyIntro:
      "本隐私政策说明 Budget App 如何处理用户数据。",
    dataStoredTitle: "我们存储的数据",
    dataStoredText:
      "Budget App 会在你的浏览器本地存储预算记录、语言偏好和 Cookie 选择。这些数据不会发送到外部服务器。",
    cookieStorageTitle: "Cookie 和本地存储",
    cookieStorageText:
      "本应用使用本地存储来记住你选择的语言和 Cookie 提示选择，从而提升可用性，并避免重复显示相同提示。",
    userControlTitle: "用户控制权",
    userControlText:
      "你可以随时清除浏览器存储，以删除已保存的预算记录和偏好设置。",
    noSellingTitle: "数据共享",
    noSellingText:
      "本学生项目不会出售、出租或与第三方共享个人数据。",
    backHome: "返回 Budget App",

    landscapeMode: "横屏",
    landscapeToggleAlt: "切换横屏模式"
  }
};

function getCurrentLanguage() {
  return localStorage.getItem("budget_app_language") || "en";
}

function setLanguage(language) {
  const selectedLanguage = translations[language] ? language : "en";

  localStorage.setItem("budget_app_language", selectedLanguage);
  document.documentElement.lang = selectedLanguage === "zh" ? "zh-CN" : "en";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = translations[selectedLanguage][key] || key;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.getAttribute("data-i18n-placeholder");
    element.placeholder = translations[selectedLanguage][key] || key;
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    const key = element.getAttribute("data-i18n-alt");
    element.alt = translations[selectedLanguage][key] || key;
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.getAttribute("data-i18n-aria-label");
    element.setAttribute("aria-label", translations[selectedLanguage][key] || key);
  });

  updateActiveLanguageButton(selectedLanguage);
}

function updateActiveLanguageButton(language) {
  const enButton = document.getElementById("lang-en");
  const zhButton = document.getElementById("lang-zh");

  if (!enButton || !zhButton) return;

  enButton.classList.toggle("active-language", language === "en");
  zhButton.classList.toggle("active-language", language === "zh");
}

function setupLanguageButtons() {
  const enButton = document.getElementById("lang-en");
  const zhButton = document.getElementById("lang-zh");

  if (enButton) {
    enButton.addEventListener("click", () => setLanguage("en"));
  }

  if (zhButton) {
    zhButton.addEventListener("click", () => setLanguage("zh"));
  }
}

function setupCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  const acceptButton = document.getElementById("accept-cookies");
  const declineButton = document.getElementById("decline-cookies");

  if (!banner) return;

  const cookieChoice = localStorage.getItem("budget_app_cookie_choice");

  if (cookieChoice) {
    banner.classList.add("hide-cookie-banner");
  } else {
    banner.classList.remove("hide-cookie-banner");
  }

  if (acceptButton) {
    acceptButton.addEventListener("click", () => {
      localStorage.setItem("budget_app_cookie_choice", "accepted");
      banner.classList.add("hide-cookie-banner");
    });
  }

  if (declineButton) {
    declineButton.addEventListener("click", () => {
      localStorage.setItem("budget_app_cookie_choice", "declined");
      banner.classList.add("hide-cookie-banner");
    });
  }
}

window.tBudgetApp = function (key) {
  const language = getCurrentLanguage();
  return translations[language]?.[key] || translations.en[key] || key;
};

window.setBudgetAppLanguage = setLanguage;

function detectDefaultOrientation() {
  return window.innerWidth >= 600 ? "landscape" : "portrait";
}

function applyOrientation(isLandscape, toggleBtn) {
  document.body.classList.toggle("landscape-mode", isLandscape);
  if (toggleBtn) {
    toggleBtn.setAttribute("aria-pressed", isLandscape ? "true" : "false");
  }
}

function setupOrientationToggle() {
  const toggle = document.getElementById("responsive-toggle");
  if (!toggle) return;

  let userOverride = localStorage.getItem("budget_app_orientation") !== null;
  const saved = localStorage.getItem("budget_app_orientation");
  const initial = saved !== null ? saved : detectDefaultOrientation();
  applyOrientation(initial === "landscape", toggle);

  toggle.addEventListener("click", () => {
    userOverride = true;
    const isLandscape = toggle.getAttribute("aria-pressed") === "true";
    const next = !isLandscape;
    localStorage.setItem("budget_app_orientation", next ? "landscape" : "portrait");
    applyOrientation(next, toggle);
  });

  window.addEventListener("resize", () => {
    if (!userOverride) {
      applyOrientation(detectDefaultOrientation() === "landscape", toggle);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupLanguageButtons();
  setLanguage(getCurrentLanguage());
  setupCookieBanner();
  setupOrientationToggle();
});