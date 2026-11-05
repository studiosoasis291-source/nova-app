// dashboard.js - NOVA Financial Engine with Local Storage

// --- STATE VARIABLES (Loaded from Local Storage or Defaults) ---
let currentBalance = parseFloat(localStorage.getItem('nova_currentBalance')) || 0;
let investCashBalance = parseFloat(localStorage.getItem('nova_investCashBalance')) || 0; 
let portfolioHoldings = JSON.parse(localStorage.getItem('nova_portfolioHoldings')) || []; 
let transactionHistory = JSON.parse(localStorage.getItem('nova_transactionHistory')) || [];

// Save function to update browser memory instantly
function saveData() {
    localStorage.setItem('nova_currentBalance', currentBalance);
    localStorage.setItem('nova_investCashBalance', investCashBalance);
    localStorage.setItem('nova_portfolioHoldings', JSON.stringify(portfolioHoldings));
    localStorage.setItem('nova_transactionHistory', JSON.stringify(transactionHistory));
}

// Micro-Investments with specific return rates
const marketAssets = [
    { id: 1, name: "Market Trader Fund", category: "Petty Trade", price: 100, return: "5% (Est)", returnRate: 0.05 },
    { id: 2, name: "Local Poultry Co-op", category: "Agriculture", price: 500, return: "10% (Est)", returnRate: 0.10 },
    { id: 3, name: "Community Transport", category: "Logistics", price: 1000, return: "8% (Est)", returnRate: 0.08 }
];

// --- DOM ELEMENTS ---
const balanceText = document.getElementById('savings-balance');
const milestoneText = document.getElementById('milestone-text');
const investBalanceHome = document.getElementById('invest-balance-home');
const transactionList = document.getElementById('transaction-list');
const emptyState = document.getElementById('empty-state');

// Invest Tab Elements
const portfolioTotal = document.getElementById('portfolio-total');
const portfolioProfit = document.getElementById('portfolio-profit');
const investCash = document.getElementById('invest-cash');
const assetList = document.getElementById('asset-list');
const holdingsList = document.getElementById('holdings-list');

// AI Modal Elements
const aiModal = document.getElementById('ai-modal');
const btnAiAdvisor = document.getElementById('btn-ai-advisor');
const btnCloseAi = document.getElementById('btn-close-ai');

// --- TAB SWITCHING LOGIC ---
const navButtons = document.querySelectorAll('.nav-item[data-target]');
const appViews = document.querySelectorAll('.app-view');

navButtons.forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        appViews.forEach(view => view.style.display = 'none');
        document.getElementById(targetId).style.display = 'block';
        
        navButtons.forEach(btn => btn.classList.remove('nav-active'));
        this.classList.add('nav-active');
    });
});

// --- HELPER FUNCTIONS ---
function getCurrentTimestamp() {
    const now = new Date();
    return now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderTransactions() {
    transactionList.innerHTML = '';
    if (transactionHistory.length === 0) {
        transactionList.innerHTML = '<p id="empty-state" class="feature-desc" style="text-align: center; padding: 20px 0;">No transactions yet.</p>';
        return;
    }
    
    // Render from newest to oldest
    [...transactionHistory].reverse().forEach(tx => {
        const txItem = document.createElement('div');
        txItem.className = 'tx-item';
        const sign = tx.type === 'in' ? '+' : '-';
        const amountClass = tx.type === 'in' ? 'tx-amount tx-in' : 'tx-amount tx-out';

        txItem.innerHTML = `
            <div class="tx-info">
                <h4>${tx.title} <span style="font-size: 9px; background: #1c3627; padding: 1px 4px; border-radius: 3px; color: #8ca396;">DEMO</span></h4>
                <p>${tx.date}</p>
            </div>
            <div class="${amountClass}">
                ${sign}₦${parseFloat(tx.amount).toFixed(2)}
            </div>
        `;
        transactionList.appendChild(txItem);
    });
}

function addTransaction(title, amount, type) {
    transactionHistory.push({ title, amount, type, date: getCurrentTimestamp() });
    saveData();
    renderTransactions();
}

function updateMainBalances() {
    balanceText.textContent = '₦' + currentBalance.toFixed(2);
    if(milestoneText) milestoneText.textContent = 'Milestone Progress: ₦' + currentBalance.toFixed(0) + ' / ₦500';
    saveData();
}

// --- PORTFOLIO LOGIC ---
function renderMarketplace() {
    assetList.innerHTML = '';
    marketAssets.forEach(asset => {
        const item = document.createElement('div');
        item.className = 'asset-item';
        item.innerHTML = `
            <div class="asset-info">
                <h4>${asset.name}</h4>
                <p>${asset.category} • Return: ${asset.return}</p>
            </div>
            <div class="asset-price">
                ₦${asset.price.toLocaleString()}<br>
                <button class="btn btn-primary" style="font-size: 10px; padding: 4px 8px; margin-top: 4px;" onclick="buyAsset(${asset.id})">Buy</button>
            </div>
        `;
        assetList.appendChild(item);
    });
}

function updatePortfolioUI() {
    let holdingsValue = 0;
    let totalSimulatedProfit = 0;
    holdingsList.innerHTML = '';

    if (portfolioHoldings.length === 0) {
        holdingsList.innerHTML = '<p class="feature-desc" style="text-align: center; padding: 10px 0;">No assets purchased yet.</p>';
        portfolioProfit.textContent = '+₦0.00 (0.00%)';
    } else {
        portfolioHoldings.forEach(asset => {
            holdingsValue += asset.price;
            let assetProfit = asset.price * asset.returnRate;
            totalSimulatedProfit += assetProfit;

            const item = document.createElement('div');
            item.className = 'asset-item';
            item.innerHTML = `
                <div class="asset-info">
                    <h4>${asset.name}</h4>
                    <p>Qty: 1 • Est. Earned: <strong style="color: #2ecc71;">+₦${assetProfit.toFixed(2)}</strong></p>
                </div>
                <div class="asset-price">₦${asset.price.toLocaleString()}</div>
            `;
            holdingsList.appendChild(item);
        });
    }

    const totalWealth = investCashBalance + holdingsValue;
    portfolioTotal.textContent = '₦' + totalWealth.toLocaleString(undefined, {minimumFractionDigits: 2});
    investCash.textContent = '₦' + investCashBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
    investBalanceHome.textContent = '₦' + totalWealth.toLocaleString(undefined, {minimumFractionDigits: 2});

    if (holdingsValue > 0) {
        let profitPercentage = (totalSimulatedProfit / holdingsValue) * 100;
        portfolioProfit.textContent = `+₦${totalSimulatedProfit.toLocaleString(undefined, {minimumFractionDigits: 2})} (${profitPercentage.toFixed(2)}%)`;
    }
    saveData();
}

window.buyAsset = function(id) {
    const asset = marketAssets.find(a => a.id === id);
    if (investCashBalance >= asset.price) {
        investCashBalance -= asset.price;
        portfolioHoldings.push(asset);
        addTransaction(`Purchased ${asset.name}`, asset.price, 'out');
        updatePortfolioUI();
        alert(`Successfully invested in ${asset.name}!`);
    } else {
        alert(`Insufficient investment cash. You need ₦${asset.price.toLocaleString()} but only have ₦${investCashBalance.toLocaleString()}.\n\nTransfer funds from Savings first.`);
    }
};

// --- BANKING & TRANSFER LOGIC ---
document.getElementById('btn-deposit').addEventListener('click', function() {
    let inputAmount = prompt("Enter deposit amount (Minimum ₦10):");
    let depositAmount = Number(inputAmount);
    if (depositAmount >= 10) {
        currentBalance += depositAmount;
        updateMainBalances();
        addTransaction('Savings Deposit', depositAmount, 'in');
    }
});

document.getElementById('btn-withdraw').addEventListener('click', function() {
    let inputAmount = prompt("Enter withdrawal amount:");
    let withdrawAmount = Number(inputAmount);
    if (withdrawAmount > 0 && currentBalance >= withdrawAmount) {
        currentBalance -= withdrawAmount;
        updateMainBalances();
        addTransaction('Savings Withdrawal', withdrawAmount, 'out');
    }
});

function handleTransfer() {
    let inputAmount = prompt("Amount to transfer from Savings to NOVA INVEST Portfolio:");
    let transferAmount = Number(inputAmount);
    if (transferAmount > 0 && currentBalance >= transferAmount) {
        currentBalance -= transferAmount;
        updateMainBalances();
        investCashBalance += transferAmount;
        updatePortfolioUI();
        addTransaction('Funded Portfolio', transferAmount, 'out');
        alert("Portfolio successfully funded. You can now buy assets in the Invest tab.");
    } else {
        alert("Insufficient savings balance.");
    }
}

if(document.getElementById('btn-transfer')) document.getElementById('btn-transfer').addEventListener('click', handleTransfer);
if(document.getElementById('btn-invest-transfer')) document.getElementById('btn-invest-transfer').addEventListener('click', handleTransfer);

// --- REWARDS LOGIC ---
if(document.getElementById('btn-view-earn')) {
    document.getElementById('btn-view-earn').addEventListener('click', function() {
        let action = prompt("NOVA EARN (DEMO):\n1. Daily Bonus (₦50)\n\nEnter 1:");
        if (action === "1") {
            currentBalance += 50;
            updateMainBalances();
            addTransaction('Daily Login Bonus', 50, 'in');
        }
    });
}

if(document.getElementById('btn-refer')) {
    document.getElementById('btn-refer').addEventListener('click', function() {
        if (confirm("Simulate a successful referral? (₦3,500 bonus)")) {
            currentBalance += 3500;
            updateMainBalances();
            addTransaction('Referral Bonus', 3500, 'in');
        }
    });
}

// --- AI ADVISOR MODAL LOGIC ---
if(btnAiAdvisor) btnAiAdvisor.addEventListener('click', () => aiModal.style.display = 'flex');
if(btnCloseAi) btnCloseAi.addEventListener('click', () => aiModal.style.display = 'none');

// --- INITIALIZE UI ON LOAD ---
updateMainBalances();
renderTransactions();
renderMarketplace();
updatePortfolioUI();