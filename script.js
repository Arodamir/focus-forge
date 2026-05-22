let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isRunning = false;

// 1. LOAD SAVED DATA (or start at 0 if it's their first time)
let oreCount = parseInt(localStorage.getItem('focusOres')) || 0;
let userArtifacts = JSON.   parse(localStorage.getItem('focusArtifacts')) || [];

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const oreDisplay = document.getElementById('ore-count');
const artifactGallery = document.getElementById('artifact-gallery');

const artifactsList = ['🗡️', '🛡️', '👑', '💍', '🏆', '🔮'];

// 2. SAVE PROGRESS FUNCTION
function saveProgress() {
    localStorage.setItem('focusOres', oreCount);
    localStorage.setItem('focusArtifacts', JSON.stringify(userArtifacts));
}

// 3. RENDER ARTIFACTS FUNCTION
function renderArtifacts() {
    artifactGallery.innerHTML = ''; // Clear the gallery
    // Loop through saved artifacts and put them on the screen
    userArtifacts.forEach(artifact => {
        const artifactElement = document.createElement('div');
        artifactElement.classList.add('artifact');
        artifactElement.textContent = artifact;
        artifactGallery.appendChild(artifactElement);
    });
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    startBtn.textContent = "Mining...";
    
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerId);
            completeSession();
        }
    }, 1000); // 1000 milliseconds = 1 second
}

function resetTimer() {
    clearInterval(timerId);
    isRunning = false;
    timeLeft = 25 * 60;
    startBtn.textContent = "Start Mining";
    updateDisplay();
}

function completeSession() {
    isRunning = false;
    startBtn.textContent = "Start Mining";
    timeLeft = 25 * 60;
    updateDisplay();
    
    // Reward user and SAVE
    oreCount += Math.floor(Math.random() * 5) + 1; 
    oreDisplay.textContent = oreCount;
    saveProgress(); 
    
    // Check if they can forge
    if (oreCount >= 5) {
        oreCount -= 5;
        oreDisplay.textContent = oreCount;
        forgeArtifact();
    } else {
        alert("Session complete! You mined some ores, but need 5 to forge. Keep focusing!");
    }
}

function forgeArtifact() {
    const randomArtifact = artifactsList[Math.floor(Math.random() * artifactsList.length)];
    
    // Add to our list, SAVE, and update screen
    userArtifacts.push(randomArtifact); 
    saveProgress(); 
    renderArtifacts(); 
    
    alert(`Amazing focus! You forged a new artifact: ${randomArtifact}`);
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

// 4. INITIALIZE SCREEN ON LOAD
oreDisplay.textContent = oreCount;
renderArtifacts();
updateDisplay();