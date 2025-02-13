let currentPage = 1;
let pageSize = 400;
let currentFetchFunction = fetchIncidents;
let totalPages = 1;

async function fetchIncidents() {
    currentFetchFunction = fetchIncidents; // Set the current fetch function
    try {
        const response = await fetch(`http://localhost:5001/incidents?page=${currentPage}&pageSize=${pageSize}`);
        const result = await response.json();
        const incidents = result.data;
        totalPages = result.totalPages;
        
        const tableBody = document.getElementById("incidentBody");
        tableBody.innerHTML = ""; // Clear previous data

        incidents.forEach(incident => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${incident.id}</td>
                <td>${incident.incident_id}</td>
                <td>${incident.status}</td>
                <td>${incident.severity}</td>
                <td>${incident.summary}</td>
                <td>${incident.created_at}</td>
            `;
            tableBody.appendChild(row);
        });

        updatePageInfo();
        document.getElementById("responseTime").textContent = `Query response time: ${result.duration} ms`;

    } catch (error) {
        console.error("Error fetching incidents", error);
    }
}

async function fetchOpenIncidents() {
    currentFetchFunction = fetchOpenIncidents; // Set the current fetch function
    try {
        const response = await fetch(`http://localhost:5001/open-incidents?page=${currentPage}&pageSize=${pageSize}`);
        const result = await response.json();
        const incidents = result.data;
        totalPages = result.totalPages;
        
        const tableBody = document.getElementById("incidentBody");
        tableBody.innerHTML = ""; // Clear previous data

        incidents.forEach(incident => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${incident.id}</td>
                <td>${incident.incident_id}</td>
                <td>${incident.status}</td>
                <td>${incident.severity}</td>
                <td>${incident.summary}</td>
                <td>${incident.created_at}</td>
            `;
            tableBody.appendChild(row);
        });

        updatePageInfo();
        document.getElementById("responseTime").textContent = `Query response time: ${result.duration} ms`;

    } catch (error) {
        console.error("Error fetching open incidents", error);
    }
}

async function fetchIncidentsOg() {
    currentFetchFunction = fetchIncidentsOg; // Set the current fetch function
    try {
        const response = await fetch(`http://localhost:5001/incidents-og?page=${currentPage}&pageSize=${pageSize}`);
        const result = await response.json();
        const incidents = result.data;
        totalPages = result.totalPages;
        
        const tableBody = document.getElementById("incidentBody");
        tableBody.innerHTML = ""; // Clear previous data

        incidents.forEach(incident => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${incident.id}</td>
                <td>${incident.incident_id}</td>
                <td>${incident.status}</td>
                <td>${incident.severity}</td>
                <td>${incident.summary}</td>
                <td>${incident.created_at}</td>
            `;
            tableBody.appendChild(row);
        });

        updatePageInfo();
        document.getElementById("responseTime").textContent = `Query response time: ${result.duration} ms`;

    } catch (error) {
        console.error("Error fetching incidents from incident_og", error);
    }
}

async function fetchOpenIncidentsOg() {
    currentFetchFunction = fetchOpenIncidentsOg; // Set the current fetch function
    try {
        const response = await fetch(`http://localhost:5001/open-incidents-og?page=${currentPage}&pageSize=${pageSize}`);
        const result = await response.json();
        const incidents = result.data;
        totalPages = result.totalPages;
        
        const tableBody = document.getElementById("incidentBody");
        tableBody.innerHTML = ""; // Clear previous data

        incidents.forEach(incident => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${incident.id}</td>
                <td>${incident.incident_id}</td>
                <td>${incident.status}</td>
                <td>${incident.severity}</td>
                <td>${incident.summary}</td>
                <td>${incident.created_at}</td>
            `;
            tableBody.appendChild(row);
        });

        updatePageInfo();
        document.getElementById("responseTime").textContent = `Query response time: ${result.duration} ms`;

    } catch (error) {
        console.error("Error fetching open incidents from incident_og", error);
    }
}

function changePageSize() {
    const select = document.getElementById("pageSize");
    pageSize = parseInt(select.value);
    currentPage = 1;
    currentFetchFunction();
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        currentFetchFunction();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        currentFetchFunction();
    }
}

function goToPage() {
    const pageInput = document.getElementById("pageInput");
    const page = parseInt(pageInput.value);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        currentFetchFunction();
    }
}

function updatePageInfo() {
    const pageInfo = document.getElementById("pageInfo");
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Load all incidents by default when the page is loaded
window.onload = function() {
    fetchIncidents();
};
