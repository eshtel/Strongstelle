// stats.js - for handling stats and saving calories per day

// Get the element where stats will be listed
const statsList = document.getElementById("stats-list");

// Function to save the calorie data of the day
function saveCaloriesForToday() {
    const today = new Date();
    const dateString = today.toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric' });

    // Get the total calories from localStorage (set to 0 if not available)
    const totalCalories = parseFloat(localStorage.getItem("totalCalories")) || 0;

    // Get the daily stats from localStorage (initialize as an empty array if not available)
    const dailyStats = JSON.parse(localStorage.getItem("dailyStats")) || [];

    // Add today's stats to the list
    dailyStats.push({ date: dateString, calories: totalCalories });

    // Save the updated list back to localStorage
    localStorage.setItem("dailyStats", JSON.stringify(dailyStats));

    // Reset total calories for the next day
    localStorage.setItem("totalCalories", "0");
}

// Function to load and display the daily calorie stats
function loadDailyStats() {
    const dailyStats = JSON.parse(localStorage.getItem("dailyStats")) || [];

    // Clear the stats list first
    statsList.innerHTML = "";

    // Loop through each day and display it in a table row
    dailyStats.forEach(stat => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${stat.date}</td><td>${stat.calories.toFixed(0)}</td>`;
        statsList.appendChild(row);
    });
}

// Load the stats on page load
window.addEventListener("load", loadDailyStats);
