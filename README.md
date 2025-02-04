# Budget Tracker - Node.js Express Server

This is a simple **Node.js Express** server for managing a budget tracker. It allows users to track their income and
expenses using a JSON file (`budget.json`).

## 🚀 Features

- **Express.js API** to handle income and expense updates.
- **Automatic budget file creation** if `budget.json` does not exist.
- **Vue.js frontend** integration for user interaction.
- **Chart.js support** for data visualization.

---

## 📌 Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [npm](https://www.npmjs.com/) (Comes with Node.js)

---

## 📥 Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/Tx-redcore/budget-tracker.git

2. **Navigate to the project**
    ```sh
   cd budget-tracker

3. **Install dependencies**
    ```sh
   npm install

4. **Create budget.json in root if issues with saving**
    - budget.json should automatically get created but if it dosen't autocreate, add the file to root and run app.js
      again


5. **Run the server**
    - Run in editor by choosing app.js or run this in the terminal.
    ```sh
   node app.js
