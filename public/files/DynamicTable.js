export const DynamicTable = {
  template: `
      <div class="container mt-4">
        <h2 class="text-center mb-4">Total Income: {{ income }}</h2>

        <!-- Category filter -->
        <div class="mb-3">
          <label for="categoryFilter" class="form-label">Filter by Category</label>
          <select v-model="selectedCategory" id="categoryFilter" class="form-select">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <table class="table table-bordered table-striped">
          <thead class="thead-dark">
          <tr>
            <th @click="sortBy('date')">Date</th>
            <th @click="sortBy('category')">Category</th>
            <th @click="sortBy('amount')">Amount</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, index) in filteredTableData" :key="index">
            <td>{{ formatDate(row.date) }}</td>
            <td>{{ row.category }}</td>
            <td>{{ row.amount }}</td>
            <td>
              <button @click="deleteExpense(row.id)" class="btn w-100 btn-danger btn-sm">Delete</button>
            </td>
          </tr>
          <tr :class="{'table-danger': remainingBudget < 0, 'table-success': remainingBudget >= 0}">
            <td colspan="2"></td>
            <td><strong>{{ remainingBudget }}</strong></td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </div>
    `,

  data() {
    return {
      income: 0,
      tableData: [],
      selectedCategory: "",
      categories: [],
      refreshInterval: null, // Store interval ID for cleanup
    };
  },

  computed: {
    totalExpenses() {
      return this.filteredTableData.reduce(
        (sum, row) => sum + parseFloat(row.amount),
        0,
      );
    },

    remainingBudget() {
      return this.income - this.totalExpenses;
    },

    filteredTableData() {
      return this.selectedCategory
        ? this.tableData.filter((row) => row.category === this.selectedCategory)
        : this.tableData;
    },
  },

  mounted() {
    this.fetchBudget();
    this.refreshInterval = setInterval(this.fetchBudget, 10000); // Refresh every 10 seconds
  },

  beforeUnmount() {
    clearInterval(this.refreshInterval); // Clean up interval on unmount
  },

  methods: {
    async fetchBudget() {
      try {
        const response = await fetch("/api/budget");
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const data = await response.json();
        this.income = data.income;
        this.tableData = data.expenses;
        this.extractCategories();
      } catch (error) {
        console.error("Error loading budget:", error);
      }
    },

    formatDate(date) {
      return date
        ? new Date(date).toLocaleDateString("nb-NO", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : "Ugyldig dato";
    },

    async deleteExpense(id) {
      try {
        const response = await fetch(`/api/budget/expense/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        this.fetchBudget();
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    },

    async sortBy(field) {
      try {
        const response = await fetch(`/api/sort-budget?criteria=${field}`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const data = await response.json();
        this.tableData = data.expenses;
      } catch (error) {
        console.error("Error sorting budget:", error);
      }
    },

    extractCategories() {
      this.categories = [
        ...new Set(this.tableData.map((expense) => expense.category)),
      ];
    },
  },
};
