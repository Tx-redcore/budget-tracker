const fs = require("fs");
const path = require("path");

// File where the budget data is stored
const budgetFile = path.join(__dirname, "budget.json");

// Default budget structure
const defaultBudget = { income: 5000, expenses: [] };

// Ensure budget file exists
const ensureBudgetFileExists = () => {
  if (!fs.existsSync(budgetFile)) {
    try {
      fs.writeFileSync(
        budgetFile,
        JSON.stringify(defaultBudget, null, 2),
        "utf8",
      );
      console.log("Budget file created with default values.");
    } catch (error) {
      console.error("Error creating budget file:", error);
    }
  }
};

// Read budget data
const readBudget = () => {
  ensureBudgetFileExists();
  try {
    return JSON.parse(fs.readFileSync(budgetFile, "utf8"));
  } catch (error) {
    console.error("Error reading budget file:", error);
    return defaultBudget; // Return default if there's an error
  }
};

// Write budget data
const writeBudget = (budget) => {
  try {
    fs.writeFileSync(budgetFile, JSON.stringify(budget, null, 2), "utf8");
    console.log("Budget successfully updated:", budget);
  } catch (error) {
    console.error("Error writing budget file:", error);
  }
};

// Ensure the file exists at startup
ensureBudgetFileExists();

module.exports = { readBudget, writeBudget };
