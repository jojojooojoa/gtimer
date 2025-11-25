// ---------------------------
// CANVAS BACKGROUND ANIMATION
// ---------------------------

const canvas = document.getElementById("cyberCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for (let i = 0; i < 200; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedY: Math.random() * 1 + 0.5,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
}

function animate() {
    ctx.fillStyle = "rgba(13,13,13,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = p.color;
        ctx.fill();

        p.y += p.speedY;
        if (p.y > canvas.height) p.y = 0;
    });

    requestAnimationFrame(animate);
}
animate();


// ---------------------------
// PAGE SWITCH (START BUTTON)
// ---------------------------

const startButton = document.getElementById("startButton");
const loadingScreen = document.getElementById("loadingScreen");
const timerScreen = document.getElementById("timerScreen");

startButton.addEventListener("click", () => {
    loadingScreen.style.display = "none";
    timerScreen.style.display = "flex";
    startGroupTimers();
});


// ---------------------------
// USER TIMER SYSTEM (localStorage)
// ---------------------------

let users = [
    { id: "user1", name: "Ralph", startTime: 0 },
    { id: "user2", name: "Nick", startTime: 0 },
    { id: "user3", name: "Jun", startTime: 0 },
    { id: "user4", name: "Nansen", startTime: 0 },
    { id: "user5", name: "Dinesh", startTime: 0 },
    { id: "user6", name: "Dustin", startTime: 0 },
    { id: "user7", name: "Tean", startTime: 0 },
];

// Load or create timers
users.forEach(u => {
    let saved = localStorage.getItem("start_" + u.id);
    if (saved) {
        u.startTime = parseInt(saved);
    } else {
        u.startTime = Date.now();
        localStorage.setItem("start_" + u.id, u.startTime);
    }
});

// Main timer loop
function startGroupTimers() {
    setInterval(() => {
        users.forEach(u => {
            const now = Date.now();
            const elapsed = Math.floor((now - u.startTime) / 1000);

            const minutes = Math.floor(elapsed / 60).toString().padStart(2, "0");
            const seconds = (elapsed % 60).toString().padStart(2, "0");

            document.getElementById(u.id).textContent =
                `${u.name}: ${minutes}:${seconds}`;
        });

        updateLeaderboard();

    }, 1000);
}


// ---------------------------
// RESET BUTTONS + NOTIFICATIONS
// ---------------------------

const resetButtons = document.querySelectorAll(".resetButton");
resetButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const userId = btn.dataset.user;
        const user = users.find(u => u.id === userId);

        if (user) {
            user.startTime = Date.now();
            localStorage.setItem("start_" + userId, user.startTime);

            if (Notification.permission === "granted") {
                new Notification("Goon Timer", {
                    body: `${user.name} has GOONED!`,
                    icon: "https://i.imgur.com/6NfmR5J.png"
                });
            }
        }
    });
});


// ---------------------------
// LEADERBOARD (TOP 3)
// ---------------------------

function updateLeaderboard() {
    const leaderboard = document.getElementById("leaderboard");

    if (!leaderboard) return;

    // Calculate elapsed times
    let sorted = users
        .map(u => ({
            name: u.name,
            elapsed: Math.floor((Date.now() - u.startTime) / 1000)
        }))
        .sort((a, b) => b.elapsed - a.elapsed)
        .slice(0, 3);

    leaderboard.innerHTML = "";

    sorted.forEach((u, index) => {
        let div = document.createElement("div");
        div.className = "leaderboardItem";

        if (index === 0) div.classList.add("gold");
        if (index === 1) div.classList.add("silver");
        if (index === 2) div.classList.add("bronze");

        const minutes = Math.floor(u.elapsed / 60).toString().padStart(2, "0");
        const seconds = (u.elapsed % 60).toString().padStart(2, "0");

        div.textContent = `${index + 1}. ${u.name} — ${minutes}:${seconds}`;
        leaderboard.appendChild(div);
    });
}
