// Load saved applications from the browser (or start empty if none)
let applications = JSON.parse(localStorage.getItem("applications")) || [];

// Save the current list to the browser
function saveApplications() {
  localStorage.setItem("applications", JSON.stringify(applications));
}
// All possible statuses
const statuses = ["Applied", "OA", "Interview", "Offer", "Rejected"];
// Update the four stat cards
function updateStats() {
  document.getElementById("stat-total").textContent = applications.length;
  document.getElementById("stat-interview").textContent =
    applications.filter(function (a) { return a.status === "Interview"; }).length;
  document.getElementById("stat-offer").textContent =
    applications.filter(function (a) { return a.status === "Offer"; }).length;
  document.getElementById("stat-rejected").textContent =
    applications.filter(function (a) { return a.status === "Rejected"; }).length;
}

// Draw the table rows from the applications array
// Draw the table rows from the applications array
function renderApplications() {
  const list = document.getElementById("app-list");
  list.innerHTML = "";
  updateStats();

  if (applications.length === 0) {
    list.innerHTML = `<tr><td colspan="5" class="empty">No applications yet. Add your first one above!</td></tr>`;
    return;
  }

  // Read what the user typed / selected in the toolbar
  const searchText = document.getElementById("search").value.toLowerCase();
  const filterStatus = document.getElementById("filter-status").value;

  let shown = 0; // counts how many rows match

  applications.forEach(function (app, index) {
    const matchesSearch =
      app.company.toLowerCase().includes(searchText) ||
      app.role.toLowerCase().includes(searchText);
    const matchesStatus = filterStatus === "All" || app.status === filterStatus;

    // Skip this application if it doesn't match
    if (!matchesSearch || !matchesStatus) return;

    shown++;

    const row = document.createElement("tr");

    const options = statuses.map(function (s) {
      const selected = s === app.status ? "selected" : "";
      return `<option value="${s}" ${selected}>${s}</option>`;
    }).join("");

    row.innerHTML = `
      <td><strong>${app.company}</strong></td>
      <td>${app.role}</td>
      <td><span class="badge ${app.status}">${app.status}</span></td>
      <td>${app.date}</td>
      <td>
        <select class="status-select" onchange="updateStatus(${index}, this.value)">
          ${options}
        </select>
        <button class="delete-btn" onclick="deleteApplication(${index})">Delete</button>
      </td>
    `;

    list.appendChild(row);
  });

  // If nothing matched, tell the user
  if (shown === 0) {
    list.innerHTML = `<tr><td colspan="5" class="empty">No applications match your search.</td></tr>`;
  }
}

// Change the status of one application
function updateStatus(index, newStatus) {
  applications[index].status = newStatus;
  saveApplications();
  renderApplications();
}

// Remove one application
function deleteApplication(index) {
  applications.splice(index, 1);
  saveApplications();
  renderApplications();
}

// Handle the form submit
const form = document.getElementById("app-form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const application = {
    company: document.getElementById("company").value,
    role: document.getElementById("role").value,
    status: document.getElementById("status").value,
    date: document.getElementById("date").value
  };

  applications.push(application);
  saveApplications();
  renderApplications();
  form.reset();
});
// Re-draw the table whenever the search or filter changes
document.getElementById("search").addEventListener("input", renderApplications);
document.getElementById("filter-status").addEventListener("change", renderApplications);
// Show the table when the page first loads
renderApplications();