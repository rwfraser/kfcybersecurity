// Data Models
const services = [
    { id: 1, name: "Asset Mapper 360", vertical: "Identify", desc: "Automated network discovery & inventory.", price: "$5/device" },
    { id: 2, name: "VulnScan Pro", vertical: "Identify", desc: "Continuous vulnerability assessment.", price: "$150/mo" },
    { id: 3, name: "Sentinel Endpoint", vertical: "Protect", desc: "NGAV & Ransomware rollback.", price: "$8/user" },
    { id: 4, name: "ZeroTrust Gateway", vertical: "Protect", desc: "DNS filtering & ZTNA access.", price: "$6/user" },
    { id: 5, name: "EagleEye SIEM", vertical: "Detect", desc: "24/7 Log aggregation & correlation.", price: "$500/mo" },
    { id: 6, name: "RapidResponse SOAR", vertical: "Respond", desc: "Automated incident isolation scripts.", price: "$200/mo" },
    { id: 7, name: "CloudVault BDR", vertical: "Recover", desc: "Immutable cloud backups.", price: "$0.10/GB" },
    { id: 8, name: "PhishSim Trainer", vertical: "Govern", desc: "Employee awareness training.", price: "$2/user" }
];

// Default State
const DEFAULT_DEPLOYMENTS = {
    "Acme Corp": [1, 3, 5, 7],
    "Globex Inc": [3, 4],
    "Soylent Corp": [1, 2, 3, 4, 5, 6, 7, 8]
};

// State Management with localStorage
let isAdminMode = true;
let activeDeployments = {};

// Load state from localStorage
function loadState() {
    try {
        const savedMode = localStorage.getItem('kf_adminMode');
        const savedDeployments = localStorage.getItem('kf_deployments');
        
        if (savedMode !== null) {
            isAdminMode = savedMode === 'true';
        }
        
        if (savedDeployments) {
            activeDeployments = JSON.parse(savedDeployments);
        } else {
            // Use defaults if no saved state
            activeDeployments = JSON.parse(JSON.stringify(DEFAULT_DEPLOYMENTS));
        }
    } catch (error) {
        console.error('Error loading state from localStorage:', error);
        // Fallback to defaults
        activeDeployments = JSON.parse(JSON.stringify(DEFAULT_DEPLOYMENTS));
    }
}

// Save state to localStorage
function saveState() {
    try {
        localStorage.setItem('kf_adminMode', isAdminMode.toString());
        localStorage.setItem('kf_deployments', JSON.stringify(activeDeployments));
    } catch (error) {
        console.error('Error saving state to localStorage:', error);
    }
}

// Toast Notification System
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${icons[type]} toast-icon"></i>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto-remove after duration
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Render Logic
function renderDashboard() {
    const grid = document.getElementById('dashboard-grid');
    const client = document.getElementById('clientSelect').value;
    const deployments = activeDeployments[client] || [];
    
    grid.innerHTML = '';

    services.forEach(service => {
        const isDeployed = deployments.includes(service.id);
        const card = document.createElement('div');
        card.className = 'card';
        
        // Content differs based on Admin vs Client mode
        let buttonHtml = '';
        let statusHtml = '';

        if (isAdminMode) {
            // Admin View
            statusHtml = isDeployed 
                ? `<span style="color: var(--success); font-size: 0.8rem;"><span class="status-dot status-active"></span>Active on ${client}</span>`
                : `<span style="color: var(--text-secondary); font-size: 0.8rem;"><span class="status-dot status-inactive"></span>Not Deployed</span>`;
            
            buttonHtml = isDeployed
                ? `<button class="btn btn-outline" onclick="openAppModal('${service.name}')"><i class="fas fa-sliders-h"></i> Manage App</button>`
                : `<button class="btn btn-primary" onclick="deployService(${service.id})"><i class="fas fa-rocket"></i> Deploy to ${client}</button>`;
        } else {
            // Client View (A la carte)
            statusHtml = `<span style="color: var(--accent); font-weight: bold;">${service.price}</span>`;
            buttonHtml = `<div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px;">
                            <span>${isDeployed ? 'Subscribed' : 'Add to Plan'}</span>
                            <label class="switch">
                                <input type="checkbox" ${isDeployed ? 'checked' : ''} onchange="toggleSubscription(${service.id})">
                                <span class="slider"></span>
                            </label>
                          </div>`;
        }

        card.innerHTML = `
            <div class="card-header">
                <span class="badge badge-${service.vertical.toLowerCase()}">${service.vertical}</span>
                <i class="fas fa-server" style="color: var(--text-secondary)"></i>
            </div>
            <h3>${service.name}</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin: 10px 0 20px;">${service.desc}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                ${statusHtml}
            </div>
            ${buttonHtml}
        `;
        grid.appendChild(card);
    });
}

// Actions
function toggleUserMode() {
    isAdminMode = !isAdminMode;
    saveState();
    
    const btn = document.getElementById('modeBtn');
    const title = document.getElementById('page-title');
    const selector = document.getElementById('client-select-container');

    if (isAdminMode) {
        btn.innerHTML = '<i class="fas fa-user-secret"></i> View as MSP Admin';
        btn.style.background = 'var(--accent)';
        title.innerText = 'Service Command Center';
        selector.style.display = 'block';
    } else {
        btn.innerHTML = '<i class="fas fa-user-tie"></i> View as Client';
        btn.style.background = 'var(--success)';
        title.innerText = 'My Service Portal (A La Carte)';
        selector.style.display = 'none';
    }
    renderDashboard();
}

function deployService(id) {
    const client = document.getElementById('clientSelect').value;
    const service = services.find(s => s.id === id);
    activeDeployments[client].push(id);
    saveState();
    showToast(`${service.name} deployed to ${client}`, 'success');
    renderDashboard();
}

function toggleSubscription(id) {
    const client = document.getElementById('clientSelect').value;
    const index = activeDeployments[client].indexOf(id);
    if (index > -1) {
        activeDeployments[client].splice(index, 1); // Remove
    } else {
        activeDeployments[client].push(id); // Add
    }
    saveState();
    renderDashboard();
}

function switchView(view) {
    // Placeholder for future navigation
    console.log('Switching to view:', view);
}

// Sub-Dashboard Logic
function openAppModal(appName) {
    document.getElementById('appModal').style.display = 'flex';
    document.getElementById('modalTitle').innerText = appName + " // Dashboard";
    
    // Randomize stats for effect
    document.getElementById('stat1').innerText = Math.floor(Math.random() * (100 - 80) + 80) + "%";
    document.getElementById('stat2').innerText = Math.floor(Math.random() * 5);
    
    // Render Chart
    renderChart();
}

function closeModal() {
    document.getElementById('appModal').style.display = 'none';
}

let chartInstance = null;
function renderChart() {
    const ctx = document.getElementById('threatChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();
    
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            datasets: [{
                label: 'Network Traffic Anomalies',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: '#334155' } },
                x: { grid: { display: false } }
            }
        }
    });
}

// Initialize UI based on saved mode
function initializeUI() {
    const btn = document.getElementById('modeBtn');
    const title = document.getElementById('page-title');
    const selector = document.getElementById('client-select-container');

    if (isAdminMode) {
        btn.innerHTML = '<i class="fas fa-user-secret"></i> View as MSP Admin';
        btn.style.background = 'var(--accent)';
        title.innerText = 'Service Command Center';
        selector.style.display = 'block';
    } else {
        btn.innerHTML = '<i class="fas fa-user-tie"></i> View as Client';
        btn.style.background = 'var(--success)';
        title.innerText = 'My Service Portal (A La Carte)';
        selector.style.display = 'none';
    }
}

// Init
loadState();
initializeUI();
renderDashboard();
