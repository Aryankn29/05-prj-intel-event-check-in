// ============================================
// Intel Summit Check-In Application
// ============================================

// Constants
const ATTENDANCE_GOAL = 50;

// State variables
let totalCount = 0;
let waterWiseCount = 0;
let netZeroCount = 0;
let renewablesCount = 0;
let attendees = []; // Array to store attendee objects {name, team}

// DOM element references
const checkInForm = document.getElementById('checkInForm');
const attendeeNameInput = document.getElementById('attendeeName');
const teamSelect = document.getElementById('teamSelect');
const greetingElement = document.getElementById('greeting');
const attendeeCountElement = document.getElementById('attendeeCount');
const progressBar = document.getElementById('progressBar');
const waterCountElement = document.getElementById('waterCount');
const zeroCountElement = document.getElementById('zeroCount');
const powerCountElement = document.getElementById('powerCount');
const celebrationElement = document.getElementById('celebration');
const attendeeListElement = document.getElementById('attendeeList');

// ============================================
// Load data from localStorage on page load
// ============================================
function loadFromLocalStorage() {
  // Load counts
  const savedTotal = localStorage.getItem('totalCount');
  const savedWater = localStorage.getItem('waterWiseCount');
  const savedZero = localStorage.getItem('netZeroCount');
  const savedPower = localStorage.getItem('renewablesCount');
  
  if (savedTotal !== null) {
    totalCount = parseInt(savedTotal, 10);
  }
  if (savedWater !== null) {
    waterWiseCount = parseInt(savedWater, 10);
  }
  if (savedZero !== null) {
    netZeroCount = parseInt(savedZero, 10);
  }
  if (savedPower !== null) {
    renewablesCount = parseInt(savedPower, 10);
  }
  
  // Load attendee list
  const savedAttendees = localStorage.getItem('attendees');
  if (savedAttendees !== null) {
    attendees = JSON.parse(savedAttendees);
  }
  
  // Update UI with loaded data
  updateAllDisplays();
}

// ============================================
// Save data to localStorage
// ============================================
function saveToLocalStorage() {
  localStorage.setItem('totalCount', totalCount);
  localStorage.setItem('waterWiseCount', waterWiseCount);
  localStorage.setItem('netZeroCount', netZeroCount);
  localStorage.setItem('renewablesCount', renewablesCount);
  localStorage.setItem('attendees', JSON.stringify(attendees));
}

// ============================================
// Update greeting message
// ============================================
function updateGreeting(name) {
  greetingElement.textContent = `Welcome, ${name}!`;
  greetingElement.style.display = 'block';
  greetingElement.classList.add('success-message');
}

// ============================================
// Update total attendance count
// ============================================
function updateAttendanceCount() {
  attendeeCountElement.textContent = totalCount;
}

// ============================================
// Update progress bar
// ============================================
function updateProgressBar() {
  const percentage = Math.min(100, (totalCount / ATTENDANCE_GOAL) * 100);
  progressBar.style.width = percentage + '%';
  
  // Update aria attributes for accessibility
  progressBar.setAttribute('aria-valuenow', totalCount);
  progressBar.setAttribute('aria-valuemin', 0);
  progressBar.setAttribute('aria-valuemax', ATTENDANCE_GOAL);
}

// ============================================
// Update team counts display
// ============================================
function updateTeamCounts() {
  waterCountElement.textContent = waterWiseCount;
  zeroCountElement.textContent = netZeroCount;
  powerCountElement.textContent = renewablesCount;
}

// ============================================
// Get team name from value
// ============================================
function getTeamName(teamValue) {
  const teamNames = {
    'water': 'Team Water Wise',
    'zero': 'Team Net Zero',
    'power': 'Team Renewables'
  };
  return teamNames[teamValue] || teamValue;
}

// ============================================
// Update attendee list display (LevelUp)
// ============================================
function updateAttendeeList() {
  attendeeListElement.innerHTML = '';
  
  attendees.forEach(attendee => {
    const listItem = document.createElement('div');
    listItem.className = 'attendee-item';
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'attendee-name';
    nameSpan.textContent = attendee.name;
    
    const teamSpan = document.createElement('span');
    teamSpan.className = 'attendee-team';
    teamSpan.textContent = attendee.team;
    
    listItem.appendChild(nameSpan);
    listItem.appendChild(teamSpan);
    attendeeListElement.appendChild(listItem);
  });
}

// ============================================
// Check for celebration (LevelUp)
// ============================================
function checkCelebration() {
  if (totalCount >= ATTENDANCE_GOAL) {
    // Find winning team(s)
    const teamCounts = {
      'Team Water Wise': waterWiseCount,
      'Team Net Zero': netZeroCount,
      'Team Renewables': renewablesCount
    };
    
    const maxCount = Math.max(waterWiseCount, netZeroCount, renewablesCount);
    const winningTeams = Object.keys(teamCounts).filter(
      team => teamCounts[team] === maxCount
    );
    
    let celebrationMessage = '';
    if (winningTeams.length === 1) {
      celebrationMessage = `🎉 Goal Reached! ${winningTeams[0]} is in the lead! 🎉`;
    } else if (winningTeams.length === 2) {
      celebrationMessage = `🎉 Goal Reached! It's a tie between ${winningTeams[0]} and ${winningTeams[1]}! 🎉`;
    } else {
      celebrationMessage = `🎉 Goal Reached! It's a three-way tie! 🎉`;
    }
    
    celebrationElement.textContent = celebrationMessage;
    celebrationElement.style.display = 'block';
  } else {
    celebrationElement.style.display = 'none';
  }
}

// ============================================
// Update all displays
// ============================================
function updateAllDisplays() {
  updateAttendanceCount();
  updateProgressBar();
  updateTeamCounts();
  updateAttendeeList();
  checkCelebration();
}

// ============================================
// Handle form submission
// ============================================
function handleCheckIn(event) {
  event.preventDefault();
  
  // Get form values
  const attendeeName = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;
  
  // Validate inputs
  if (!attendeeName || !selectedTeam) {
    return;
  }
  
  // Update greeting
  updateGreeting(attendeeName);
  
  // Increment total count
  totalCount++;
  
  // Increment team count based on selection
  if (selectedTeam === 'water') {
    waterWiseCount++;
  } else if (selectedTeam === 'zero') {
    netZeroCount++;
  } else if (selectedTeam === 'power') {
    renewablesCount++;
  }
  
  // Add to attendee list (LevelUp)
  const teamName = getTeamName(selectedTeam);
  attendees.push({
    name: attendeeName,
    team: teamName
  });
  
  // Update all displays
  updateAllDisplays();
  
  // Save to localStorage (LevelUp)
  saveToLocalStorage();
  
  // Reset form
  attendeeNameInput.value = '';
  teamSelect.value = '';
  attendeeNameInput.focus();
}

// ============================================
// Initialize application
// ============================================
function init() {
  // Load saved data from localStorage
  loadFromLocalStorage();
  
  // Attach event listener to form
  checkInForm.addEventListener('submit', handleCheckIn);
  
  // Focus on name input for better UX
  attendeeNameInput.focus();
}

// ============================================
// Run initialization when DOM is ready
// ============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
