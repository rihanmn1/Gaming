let gameStations = [];

function startGame(stationIndex) {
  const customerName = prompt("Enter customer name:");
  const gameName = prompt("Enter game name (COD or FIFA):").toUpperCase();

  const startTime = new Date().getTime();

  gameStations[stationIndex] = {
    customerName,
    gameName,
    startTime,
    timerInterval: setInterval(() => updateTimer(stationIndex), 1000),
    elapsedTime: 0,
    totalCost: 0
  };

  updateTimer(stationIndex);
}

function updateTimer(stationIndex) {
  const currentTime = new Date().getTime();
  const station = gameStations[stationIndex];
  station.elapsedTime = currentTime - station.startTime;

  const minutes = Math.floor((station.elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((station.elapsedTime % (1000 * 60)) / 1000);

  document.getElementById(`timer${stationIndex}`).innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function endGame(stationIndex) {
  const station = gameStations[stationIndex];
  clearInterval(station.timerInterval);

  const elapsedTime = station.elapsedTime;
  const gamePlayed = station.gameName;
  const totalCost = calculateCost(gamePlayed, elapsedTime);

  station.totalCost = totalCost;

  alert(`Customer Name: ${station.customerName}\nGame Name: ${gamePlayed}\nTime Played: ${formatTime(elapsedTime)}\nTotal Cost: Rs. ${totalCost}`);
}

function calculateCost(game, timePlayed) {
  const gameRates = {
    'COD': 50,
    'FIFA': 50
    // Add rates for other games as needed
  };

  const ratePerHour = gameRates[game] || 0;
  const hours = timePlayed / (1000 * 60 * 60);
  const totalCost = ratePerHour * Math.ceil(hours);
  return totalCost;
}

function formatTime(milliseconds) {
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Creating game stations dynamically
const container = document.getElementById('gameStations');
for (let i = 0; i < 7; i++) {
  const stationDiv = document.createElement('div');
  stationDiv.className = 'gameStation';
  stationDiv.innerHTML = `
    <h3>PS ${i + 1}</h3>
    <p id="timer${i}">00:00</p>
    <button onclick="startGame(${i})">Start Game</button>
    <button onclick="endGame(${i})">End Game</button>
  `;
  container.appendChild(stationDiv);
}


// ... (Previous JavaScript code remains unchanged)

// Create pool table station
const poolStationDiv = document.createElement('div');
poolStationDiv.className = 'poolStation';
poolStationDiv.innerHTML = `
  <h3>Pool Table</h3>
  <p id="timerPool">00:00</p>
  <button onclick="startPool()">Start Game</button>
  <button onclick="endPool()">End Game</button>
`;
container.appendChild(poolStationDiv);

// Functions for pool table
let poolStartTime, poolTimerInterval, poolElapsedTime = 0;

function startPool() {
  poolStartTime = new Date().getTime();
  poolTimerInterval = setInterval(updatePoolTimer, 1000);
}

function updatePoolTimer() {
  const currentTime = new Date().getTime();
  poolElapsedTime = currentTime - poolStartTime;

  const minutes = Math.floor((poolElapsedTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((poolElapsedTime % (1000 * 60)) / 1000);

  document.getElementById('timerPool').innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function endPool() {
  clearInterval(poolTimerInterval);

  const totalCost = calculatePoolCost(poolElapsedTime);
  alert(`Pool Table\nTime Played: ${formatTime(poolElapsedTime)}\nTotal Cost: Rs. ${totalCost}`);
}

function calculatePoolCost(timePlayed) {
  const ratePerHour = 100;
  const ratePerHalfHour = 60;

  const hours = timePlayed / (1000 * 60 * 60);
  const halfHours = timePlayed / (1000 * 60 * 30);

  let totalCost;
  if (hours >= 1) {
    totalCost = ratePerHour * Math.ceil(hours);
  } else {
    totalCost = ratePerHalfHour * Math.ceil(halfHours);
  }
  return totalCost;
}



// Your Google Sheets API client ID and API key
const CLIENT_ID = '486041533651-1ujdsn7v0c93h641j900060su074b1r8.apps.googleusercontent.com';
const API_KEY = 'AIzaSyACzOK-veLIfKwikazRk_iLAvGgfPtR02w';
const SPREADSHEET_ID = '13w0B1pe2vkYipGctiqFAyLucbsov5ZAO6ETKXd-K4dY';

// Authorization scopes required by the API
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// Function to load Google Sheets API client library
function loadSheetsApi() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    scope: SCOPES
  }).then(() => {
    console.log('Google Sheets API loaded successfully');
  }, (error) => {
    console.error('Error loading Google Sheets API:', error);
  });
}

// Function to send data to Google Sheets
function storeData() {
  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1', // Change the sheet name if needed
    valueInputOption: 'RAW',
    resource: {
      values: [
        [givenName, gamePlayed, new Date().toLocaleString()]
 // Change this with the data you want to store
      ]
    }
  }).then((response) => {
    console.log('Data successfully stored:', response);
  }, (error) => {
    console.error('Error storing data:', error);
  });
}

// Load Google Sheets API
gapi.load('client', loadSheetsApi);


// ...

function endGame(stationIndex) {
  const station = gameStations[stationIndex];
  clearInterval(station.timerInterval);

  const elapsedTime = station.elapsedTime;
  const gamePlayed = station.gameName;
  const totalCost = calculateCost(gamePlayed, elapsedTime);

  station.totalCost = totalCost;

  // Store the data in a structured manner (for demonstration purposes, logging is used)
  const dataToStore = {
    customerName: station.customerName,
    gameName: gamePlayed,
    startTime: station.startTime,
    endTime: new Date().getTime(), // Capture the end time
    elapsedTime: elapsedTime,
    totalCost: totalCost
  };

  console.log("Data to Store:", dataToStore);
  // You can use this 'dataToStore' to push into a database or Google Sheets

  alert(`Customer Name: ${station.customerName}\nGame Name: ${gamePlayed}\nTime Played: ${formatTime(elapsedTime)}\nTotal Cost: Rs. ${totalCost}`);
}

function endPool() {
  clearInterval(poolTimerInterval);

  const totalCost = calculatePoolCost(poolElapsedTime);

  // Store the pool table data in a structured manner (for demonstration purposes, logging is used)
  const poolDataToStore = {
    startTime: poolStartTime,
    endTime: new Date().getTime(), // Capture the end time
    elapsedTime: poolElapsedTime,
    totalCost: totalCost
  };

  console.log("Pool Data to Store:", poolDataToStore);
  // You can use this 'poolDataToStore' to push into a database or Google Sheets

  alert(`Pool Table\nTime Played: ${formatTime(poolElapsedTime)}\nTotal Cost: Rs. ${totalCost}`);
}

// ...
