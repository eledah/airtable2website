let records = [];
let currentRecordId = null;

async function fetchRecords() {
    try {
        const response = await fetch('/api/records');
        records = await response.json();
        displayKeyValues();
        if (records.length > 0) {
            loadRecord(records[0].id);
        }
    } catch (error) {
        console.error('Error fetching records:', error);
    }
}

function displayKeyValues() {
    const sidebar = document.getElementById('sidebar');
    const ul = document.createElement('ul');
    records.forEach(record => {
        const li = document.createElement('li');
        li.textContent = record.Name || record.Title || record.id; // Adjust based on your CSV structure
        li.onclick = () => loadRecord(record.id);
        ul.appendChild(li);
    });
    sidebar.innerHTML = '';
    sidebar.appendChild(ul);
}

async function loadRecord(id) {
    try {
        const response = await fetch(`/api/records/${id}`);
        const record = await response.json();
        displayRecord(record);
        currentRecordId = id;
        updateActiveSidebarItem();
    } catch (error) {
        console.error('Error loading record:', error);
    }
}

function displayRecord(record) {
    const content = document.getElementById('content');
    let html = '<h2>' + (record.Name || record.Title || 'Untitled') + '</h2>';
    
    for (const [key, value] of Object.entries(record)) {
        if (key !== 'id' && key !== 'Name' && key !== 'Title') {
            if (key.toLowerCase().includes('image') && value.startsWith('http')) {
                html += `<img src="${value}" alt="${key}" style="max-width: 100%;">`;
            } else if (key.toLowerCase().includes('link') && value.startsWith('http')) {
                html += `<p><strong>${key}:</strong> <a href="${value}" target="_blank">${value}</a></p>`;
            } else {
                html += `<p><strong>${key}:</strong> ${value}</p>`;
            }
        }
    }
    
    content.innerHTML = html;
}

function updateActiveSidebarItem() {
    const sidebarItems = document.querySelectorAll('#sidebar li');
    sidebarItems.forEach(item => {
        item.classList.remove('active');
        if (item.textContent === records.find(r => r.id === currentRecordId).Name) {
            item.classList.add('active');
        }
    });
}

// Fetch records when the page loads
fetchRecords();