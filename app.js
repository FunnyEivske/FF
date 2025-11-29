// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC6VZ1JUIfZBmrItbvpCqYAR8JEV4j-bME",
    authDomain: "forestfoundry.firebaseapp.com",
    projectId: "forestfoundry",
    storageBucket: "forestfoundry.firebasestorage.app",
    messagingSenderId: "670933705692",
    appId: "1:670933705692:web:e1e556bec215e23b80e519"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const navBtns = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');
const loginModal = document.getElementById('login-modal');
const projectModal = document.getElementById('project-modal');
const loginForm = document.getElementById('login-form');
const projectForm = document.getElementById('project-form');
const userInfo = document.getElementById('user-info');
const loginArea = document.getElementById('login-area');
const userEmailSpan = document.getElementById('user-email');
const projectList = document.getElementById('project-list');

// Navigation Logic
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and tabs
        navBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(t => t.classList.remove('active'));

        // Add active class to clicked button
        btn.classList.add('active');

        // Show corresponding tab
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Modal Logic
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal if clicked outside
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

document.getElementById('login-modal-btn').onclick = () => openModal('login-modal');
document.getElementById('logout-btn').onclick = () => auth.signOut();

// Auth Logic
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in.
        userInfo.style.display = 'block';
        loginArea.style.display = 'none';
        userEmailSpan.textContent = user.email;
        loadProjects(); // Load data
    } else {
        // No user is signed in.
        userInfo.style.display = 'none';
        loginArea.style.display = 'block';
        userEmailSpan.textContent = '';
        projectList.innerHTML = '<div class="card"><p>Please log in to view projects.</p></div>';
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error');

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            closeModal('login-modal');
            errorMsg.textContent = '';
            loginForm.reset();
        })
        .catch((error) => {
            errorMsg.textContent = error.message;
        });
});

// Firestore Logic (Projects)
projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('project-title').value;
    const category = document.getElementById('project-category').value;
    const user = auth.currentUser;

    if (user) {
        db.collection('projects').add({
            title: title,
            category: category,
            status: 'In Progress',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid: user.uid
        })
            .then(() => {
                closeModal('project-modal');
                projectForm.reset();
                loadProjects(); // Refresh list
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
                alert("Error creating project: " + error.message);
            });
    }
});

function loadProjects() {
    const user = auth.currentUser;
    if (!user) return;

    projectList.innerHTML = '<div class="loading">Loading...</div>';

    db.collection('projects').where("uid", "==", user.uid)
        .orderBy("createdAt", "desc")
        .get()
        .then((querySnapshot) => {
            projectList.innerHTML = '';
            if (querySnapshot.empty) {
                projectList.innerHTML = '<div class="card"><p>No projects found. Create one!</p></div>';
                return;
            }
            querySnapshot.forEach((doc) => {
                const project = doc.data();
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${project.title}</h3>
                    <p>Category: ${project.category}</p>
                    <p>Status: <span style="color: var(--rust-500)">${project.status}</span></p>
                `;
                projectList.appendChild(card);
            });
        })
        .catch((error) => {
            console.error("Error getting documents: ", error);
            projectList.innerHTML = `<div class="error-msg">Error loading projects: ${error.message}</div>`;
        });
}
