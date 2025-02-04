const express = require("express");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const createError = require("http-errors");

// Import route handlers
const indexRouter = require("./routes/index");

// Import budget utility functions
const { readBudget, writeBudget } = require("./public/javascripts/budgetUtils");

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// API Routes

// Get budget
app.get("/api/budget", (req, res) => {
  res.json(readBudget());
});

// Add a new expense
app.post("/api/budget/expense", (req, res) => {
  const { id, category, amount, date } = req.body;
  const budget = readBudget();
  budget.expenses.push({ id, date, category, amount });
  writeBudget(budget);
  res.json({ message: "Expense added successfully", budget });
});

// Update income
app.post("/api/budget/income", (req, res) => {
  const { income } = req.body;
  if (!income || isNaN(income) || parseFloat(income) <= 0) {
    return res.status(400).json({ error: "Invalid income value" });
  }
  const budget = readBudget();
  budget.income = parseFloat(income);
  writeBudget(budget);
  res.json({ message: "Income updated successfully", income: budget.income });
});

// Delete an expense
app.delete("/api/budget/expense/:id", (req, res) => {
  const budget = readBudget();
  const expenseId = req.params.id;
  const updatedExpenses = budget.expenses.filter(
    (expense) => expense.id !== expenseId,
  );

  if (updatedExpenses.length === budget.expenses.length) {
    return res.status(404).json({ error: "Expense not found" });
  }

  budget.expenses = updatedExpenses;
  writeBudget(budget);
  res.json({ message: "Expense deleted successfully", budget });
});

// Sort budget expenses
app.get("/api/sort-budget", (req, res) => {
  const criteria = req.query.criteria || "category";
  const budget = readBudget();

  budget.expenses.sort((a, b) => {
    if (criteria === "amount") {
      return a.amount - b.amount;
    } else if (criteria === "date") {
      return new Date(a.date) - new Date(b.date);
    } else {
      return a.category.localeCompare(b.category);
    }
  });

  res.json(budget);
});

// Route to serve the main page
app.get("/", (req, res) => res.render("index"));

// Error Handling

// Catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// Start server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));

module.exports = app;
