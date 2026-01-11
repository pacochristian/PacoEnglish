const allAvailableCourses = [
    { title: "Business English", level: "Intermediate", icon: "briefcase" },
    { title: "English Grammar 101", level: "Beginner", icon: "book" },
    { title: "IELTS Preparation", level: "Advanced", icon: "graduation-cap" }
];

// --- SEARCH LOGIC ---
function enhancedSearch(input) {
    const query = input.value.toLowerCase();
    const dropdown = document.getElementById("search-results-dropdown");
    const clearBtn = document.getElementById("clear-search");

    clearBtn.style.display = query.length > 0 ? "block" : "none";

    if (query.length < 2) {
        dropdown.style.display = "none";
        filterGrid(query);
        return;
    }

    const filtered = allAvailableCourses.filter(c => c.title.toLowerCase().includes(query));
    renderSearchResults(filtered, dropdown);
    filterGrid(query);
}

function renderSearchResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = `<div style="padding:15px; color:#888;">No courses found...</div>`;
    } else {
        container.innerHTML = results.map(c => `
            <div class="search-result-item" onclick="enrollInSpecificCourse('${c.title}')" 
                 style="padding:12px; cursor:pointer; display:flex; gap:10px; align-items:center; border-bottom:1px solid rgba(255,255,255,0.05)">
                <i class="fas fa-${c.icon}" style="color:#eb5225"></i>
                <div>
                    <div style="font-weight:bold; font-size:0.9rem">${c.title}</div>
                    <small style="color:#888">${c.level}</small>
                </div>
            </div>
        `).join('');
    }
    container.style.display = "block";
}

function filterGrid(query) {
    const cards = document.querySelectorAll(".stat-card");
    cards.forEach(card => {
        const title = card.querySelector("h3").innerText.toLowerCase();
        card.style.display = title.includes(query) ? "flex" : "none";
    });
}

function clearSearch() {
    const input = document.getElementById("course-search");
    input.value = "";
    enhancedSearch(input);
    input.focus();
}

// --- COURSE ENROLLMENT ---
// Function used on course.html
window.enrollInSpecificCourse = function(courseName) {
    // 1. Get existing courses from storage or start empty
    let enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];

    // 2. Check if already enrolled
    if (enrolledCourses.includes(courseName)) {
        alert("You are already enrolled in " + courseName);
        window.location.href = 'dashboard.html';
        return;
    }

    // 3. Add new course to the list
    enrolledCourses.push(courseName);
    localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));

    // 4. Redirect back to dashboard to see the update
    alert("Successfully enrolled in " + courseName + "!");
    window.location.href = 'dashboard.html';
};

// Function to run when Dashboard loads to display the saved courses
function displayEnrolledCourses() {
    const grid = document.getElementById("main-course-grid");
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
    
    // If we are on the dashboard and have a grid
    if (grid) {
        enrolledCourses.forEach(course => {
            // Check if card already exists in HTML to avoid duplicates
            const exists = Array.from(grid.querySelectorAll('h3')).some(h3 => h3.innerText === course);
            
            if (!exists) {
                const newCard = document.createElement("div");
                newCard.className = "stat-card card-glass";
                newCard.innerHTML = `
                    <div class="card-top"><span class="level-tag">Enrolled</span></div>
                    <h3>${course}</h3>
                    <p class="instructor">with Prof. Paco</p>
                    <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: 0%"></div></div>
                `;
                grid.appendChild(newCard);
            }
        });
    }
}

// Run display check on page load
document.addEventListener("DOMContentLoaded", displayEnrolledCourses);
    // Add to Dropdown
    const link = document.createElement("a");
    link.href = "#"; link.textContent = courseName;
    dropdownList.appendChild(link);

    closeModal();
    document.getElementById("search-results-dropdown").style.display = "none";
}

// --- MODAL CONTROLS ---
function openModal() { document.getElementById("course-modal").style.display = "block"; }
function closeModal() { document.getElementById("course-modal").style.display = "none"; }

// Close dropdown when clicking outside
window.onclick = function(event) {
    if (event.target == document.getElementById("course-modal")) closeModal();
}