const API_KEY = 'zvUxMTSwefWk0JA_iUgmtSiKFtxkEWGp'; 

const REDDIT_API_URL = 'https://tradestie.com/api/v1/apps/reddit?date=2022-04-03';

let stockChart = null; 

function loadTopStocks() {
    fetch(REDDIT_API_URL)
        .then(response => response.json())
        .then(data => {
            if (data.stocks) {
                const stocks = data.stocks.slice(0, 5); 
                const table = document.getElementById('stocks-table').getElementsByTagName('tbody')[0];
                table.innerHTML = ''; 

                stocks.forEach(stock => {
                    const row = table.insertRow();
                    const tickerCell = row.insertCell(0);
                    const commentsCell = row.insertCell(1);
                    const sentimentCell = row.insertCell(2);

                    tickerCell.innerHTML = `<a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a>`;
                    commentsCell.textContent = stock.comment_count || 'N/A';
                    sentimentCell.innerHTML = stock.sentiment === 'Bullish'
                        ? '<img src="bullish-icon.png" alt="Bullish">'
                        : stock.sentiment === 'Bearish' ? '<img src="bearish-icon.png" alt="Bearish">' : 'Neutral';
                });
            }
        })
        .catch(err => {
            console.error('Error loading Reddit stocks:', err);
        });
}

// Fetch and display stock data
function getStockData() {
    const ticker = document.getElementById('stock-ticker').value;
    const dateRange = document.getElementById('date-range').value;

    if (!ticker) {
        alert('Please enter a stock ticker!');
        return;
    }

    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${getDateRange(dateRange)}?apiKey=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.results) {
                const stockData = data.results;
                renderStockChart(stockData, ticker); 
            } else {
                alert('Stock data not found!');
            }
        })
        .catch(err => {
            console.error('Error fetching stock data:', err);
            alert('Error fetching stock data.');
        });
}

function renderStockChart(stockData, ticker) {
    const labels = stockData.map(item => new Date(item.t * 1000).toLocaleDateString());
    const data = stockData.map(item => item.c);

    if (stockChart) {
        stockChart.destroy(); 
    }

    stockChart = new Chart(document.getElementById('stock-chart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${ticker} Closing Price`,
                data: data,
                borderColor: '#ff6600',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: { autoSkip: true, maxTicksLimit: 20 }
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function getDateRange(days) {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - days);
    return `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
}

// Reddit
document.addEventListener('DOMContentLoaded', loadTopStocks);

}
