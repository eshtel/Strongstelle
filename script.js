// Total nutrition tracker
const totals = {
    calories: 0,
    fat: 0,
    carbs: 0,
    sugar: 0,
    protein: 0
};

// Track how many times each food was selected and store nutritional info
const foodCounts = {};

// UI elements for totals
const elements = {
    calories: document.getElementById("calories"),
    fat: document.getElementById("fat"),
    carbs: document.getElementById("carbs"),
    sugar: document.getElementById("sugar"),
    protein: document.getElementById("protein"),
    summaryList: document.getElementById("summary-list"),
    progressBar: document.getElementById("calorie-progress-bar"),
    calorieCurrent: document.getElementById("calorie-current")
};

// Display today's date in French
const dateElement = document.getElementById("date");
const today = new Date();
const options = { weekday: 'long', day: 'numeric', month: 'long' };
const frenchDate = today.toLocaleDateString('fr-FR', options);
dateElement.textContent = frenchDate.charAt(0).toUpperCase() + frenchDate.slice(1);

// Function to save the data to localStorage
function saveData() {
    localStorage.setItem('foodCounts', JSON.stringify(foodCounts));
    localStorage.setItem('totals', JSON.stringify(totals));
}

// Function to load the data from localStorage
function loadData() {
    const savedFoodCounts = localStorage.getItem('foodCounts');
    const savedTotals = localStorage.getItem('totals');

    if (savedFoodCounts) {
        Object.assign(foodCounts, JSON.parse(savedFoodCounts));
    }

    if (savedTotals) {
        Object.assign(totals, JSON.parse(savedTotals));
    }

    updateSummaryUI();
    updateTotalsUI();
}

// Update nutrition totals in UI
function updateTotalsUI() {
    elements.calories.textContent = totals.calories.toFixed(0);
    elements.fat.textContent = totals.fat.toFixed(1);
    elements.carbs.textContent = totals.carbs.toFixed(1);
    elements.sugar.textContent = totals.sugar.toFixed(1);
    elements.protein.textContent = totals.protein.toFixed(1);

    // Calorie progress bar
    const maxCalories = 2500;
    const percentage = Math.min((totals.calories / maxCalories) * 100, 100);
    elements.progressBar.style.width = `${percentage}%`;
    elements.progressBar.style.backgroundColor = totals.calories >= 2200 ? 'orange' : 'green';
    elements.calorieCurrent.textContent = totals.calories.toFixed(0);
}

// Update the summary display
function updateSummaryUI() {
    elements.summaryList.innerHTML = ""; // Clear current summary list

    for (const [foodName, { count }] of Object.entries(foodCounts)) {
        const btn = document.createElement("button");
        btn.textContent = `${foodName}, ${count}x`;
        btn.classList.add("summary-btn"); // Apply the class for styling

        btn.addEventListener("click", () => {
            // When clicked, remove the food from the list and update the totals

            // Reduce the total values
            totals.calories -= foodCounts[foodName].calories * count;
            totals.fat -= foodCounts[foodName].fat * count;
            totals.carbs -= foodCounts[foodName].carbs * count;
            totals.sugar -= foodCounts[foodName].sugar * count;
            totals.protein -= foodCounts[foodName].protein * count;

            // Update the UI after removal
            delete foodCounts[foodName]; // Remove the food from the list
            updateSummaryUI(); // Re-render the list
            updateTotalsUI(); // Update the totals display

            // Save updated data
            saveData();
        });

        // Append the button to the summary list
        elements.summaryList.appendChild(btn);
    }
}

// Add event listeners to all food items
document.querySelectorAll(".food").forEach(food => {
    food.addEventListener("click", () => {
        // Nutrition
        totals.calories += parseFloat(food.dataset.calories);
        totals.fat += parseFloat(food.dataset.fat);
        totals.carbs += parseFloat(food.dataset.carbs);
        totals.sugar += parseFloat(food.dataset.sugar);
        totals.protein += parseFloat(food.dataset.protein);

        // Count this food
        const name = food.dataset.name;
        if (!foodCounts[name]) {
            foodCounts[name] = {
                count: 0,
                calories: parseFloat(food.dataset.calories),
                fat: parseFloat(food.dataset.fat),
                carbs: parseFloat(food.dataset.carbs),
                sugar: parseFloat(food.dataset.sugar),
                protein: parseFloat(food.dataset.protein)
            };
        }
        foodCounts[name].count += 1;

        updateTotalsUI();
        updateSummaryUI();

        // Save updated data
        saveData();
    });
});

// Enhance each .food element by wrapping in a .food-item, adding an Info button and auto-filled details
document.querySelectorAll(".food").forEach(foodEl => {
    const wrapper = document.createElement("div");
    wrapper.className = "food-item";

    // Clone and move the original food button inside the wrapper
    foodEl.parentNode.insertBefore(wrapper, foodEl);
    wrapper.appendChild(foodEl);

    // Create Info button
    const infoButton = document.createElement("button");
    infoButton.className = "info-btn";
    infoButton.textContent = "Info";
    wrapper.appendChild(infoButton);

    // Create nutrition info box
    const infoBox = document.createElement("div");
    infoBox.className = "nutrition-info";
    infoBox.style.display = "none";

    // Fill in nutritional values
    const fields = [
        { key: 'calories', label: 'Calories', unit: 'kcal' },
        { key: 'fat', label: 'Matières grasses', unit: 'g' },
        { key: 'carbs', label: 'Glucides', unit: 'g' },
        { key: 'sugar', label: 'Sucres', unit: 'g' },
        { key: 'protein', label: 'Protéines', unit: 'g' },
    ];

    fields.forEach(({ key, label, unit }) => {
        const value = foodEl.dataset[key];
        if (value !== undefined) {
            const p = document.createElement("p");
            p.textContent = `${label}: ${value} ${unit}`;
            infoBox.appendChild(p);
        }
    });

    wrapper.appendChild(infoBox);

    // Toggle behavior
    infoButton.addEventListener("click", () => {
        infoBox.style.display = infoBox.style.display === "block" ? "none" : "block";
    });
});

// Load saved data on page load
window.addEventListener("load", loadData);

