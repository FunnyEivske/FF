// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC6VZ1JUIfZBmrItbvpCqYAR8JEV4j-bME",
    authDomain: "forestfoundry.firebaseapp.com",
    projectId: "forestfoundry",
    storageBucket: "forestfoundry.firebasestorage.app",
    messagingSenderId: "670933705692",
    appId: "1:670933705692:web:e1e556bec215e23b80e519",
    measurementId: "G-7MB72KP89G"
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
        // .orderBy("createdAt", "desc") // Requires index
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
                card.style.cursor = 'pointer';
                card.onclick = () => openProject(doc.id, project);

                // Random progress for demo purposes (since it's not in DB yet)
                const randomProgress = Math.floor(Math.random() * 100);

                card.innerHTML = `
                    <h3>${project.title}</h3>
                    <p>${project.status}</p>
                    <div class="progress-bar"><div class="progress-fill" style="width: ${randomProgress}%"></div></div>
                    <div class="skill-tags">
                        <span class="skill-tag">${project.category}</span>
                    </div>
                `;
                projectList.appendChild(card);
            });
        })
        .catch((error) => {
            console.error("Error getting documents: ", error);
            projectList.innerHTML = `<div class="error-msg">Error loading projects: ${error.message}</div>`;
        });
}

// --- MYR ENTERTAINMENT (ASSETS) ---
const assetForm = document.getElementById('asset-form');
const assetList = document.getElementById('asset-list');

assetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('asset-name').value;
    const type = document.getElementById('asset-type').value;
    const status = document.getElementById('asset-status').value;
    const user = auth.currentUser;

    if (user) {
        db.collection('assets').add({
            name: name,
            type: type,
            status: status,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid: user.uid
        }).then(() => {
            closeModal('asset-modal');
            assetForm.reset();
            loadAssets();
        });
    }
});

function loadAssets() {
    const user = auth.currentUser;
    if (!user) return;

    assetList.innerHTML = '<div class="loading">Loading...</div>';

    // Note: This query might also need an index!
    db.collection('assets').where("uid", "==", user.uid)
        // .orderBy("createdAt", "desc") // Requires index
        .get()
        .then((snapshot) => {
            assetList.innerHTML = '';
            if (snapshot.empty) {
                assetList.innerHTML = '<div class="card"><p>No assets found.</p></div>';
                return;
            }
            snapshot.forEach(doc => {
                const asset = doc.data();
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${asset.name}</h3>
                    <p>${asset.status}</p>
                    <div class="skill-tags">
                        <span class="skill-tag">${asset.type}</span>
                    </div>
                `;
                assetList.appendChild(card);
            });
        });

}

// --- THE ARCHIVE (WIKI) ---
const loreForm = document.getElementById('lore-form');
const loreList = document.getElementById('lore-list');
let currentLoreFilter = 'All';

function filterLore(type) {
    currentLoreFilter = type;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.includes(type) || (type === 'All' && btn.textContent === 'All'));
    });
    loadLore();
}

loreForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('lore-title').value;
    const type = document.getElementById('lore-type').value;
    const content = document.getElementById('lore-content').value;
    const imageUrl = document.getElementById('lore-image-url').value;
    const user = auth.currentUser;

    if (user) {
        db.collection('lore').add({
            title: title,
            type: type,
            content: content,
            imageUrl: imageUrl,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid: user.uid
        }).then(() => {
            closeModal('lore-modal');
            loreForm.reset();
            loadLore();
        });
    }
});

function loadLore() {
    const user = auth.currentUser;
    if (!user) return;

    loreList.innerHTML = '<div class="loading">Loading...</div>';

    let query = db.collection('lore').where("uid", "==", user.uid);

    if (currentLoreFilter !== 'All') {
        query = query.where("type", "==", currentLoreFilter);
    }

    query
        // .orderBy("createdAt", "desc") // Requires index
        .get()
        .then((snapshot) => {
            loreList.innerHTML = '';
            if (snapshot.empty) {
                loreList.innerHTML = '<div class="card"><p>No lore entries found.</p></div>';
                return;
            }
            snapshot.forEach(doc => {
                const lore = doc.data();
                const card = document.createElement('div');
                card.className = 'card';
                card.style.cursor = 'pointer';
                card.onclick = () => openWiki(doc.id, lore);

                let imageHtml = lore.imageUrl ? `<img src="${lore.imageUrl}" style="width:100%; height:150px; object-fit:cover; border-radius:4px; margin-bottom:10px;">` : '';

                card.innerHTML = `
                    ${imageHtml}
                    <h3>${lore.title}</h3>
                    <div class="skill-tags">
                        <span class="skill-tag">${lore.type}</span>
                    </div>
                `;
                loreList.appendChild(card);
            });
        });

}

let currentLoreId = null;

function openWiki(id, lore) {
    currentLoreId = id;
    showTab('wiki-detail');

    document.getElementById('wiki-title').textContent = lore.title;
    document.getElementById('wiki-content').innerHTML = lore.content.replace(/\n/g, '<br>'); // Simple formatting

    // Infobox
    const wikiImage = document.getElementById('wiki-image');
    if (lore.imageUrl) {
        wikiImage.src = lore.imageUrl;
        wikiImage.style.display = 'block';
    } else {
        wikiImage.style.display = 'none';
    }

    const statsDiv = document.getElementById('wiki-stats');
    statsDiv.innerHTML = `
        <div class="infobox-row">
            <span class="infobox-label">Type</span>
            <span>${lore.type}</span>
        </div>
        <div class="infobox-row">
            <span class="infobox-label">Author</span>
            <span>Foundry User</span>
        </div>
    `;
}

// --- DETAIL VIEW LOGIC ---
let currentProjectId = null;

function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');

    const navBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
    if (navBtn) navBtn.classList.add('active');
}

function openProject(id, project) {
    currentProjectId = id;
    showTab('project-detail');

    document.getElementById('detail-title').textContent = project.title;
    document.getElementById('detail-category').textContent = project.category;
    document.getElementById('detail-status').textContent = 'Status: ' + project.status;
    document.getElementById('detail-description').textContent = project.description || "No description provided.";

    // Reset progress for now
    document.getElementById('detail-progress').style.width = '50%';

    loadProjectLogs(id);
}

function loadProjectLogs(projectId) {
    const logList = document.getElementById('project-logs');
    logList.innerHTML = '<div class="loading">Loading updates...</div>';

    db.collection('projects').doc(projectId).collection('logs')
        // .orderBy('createdAt', 'desc') // Commented out to avoid index error for now
        .get()
        .then(snapshot => {
            logList.innerHTML = '';
            if (snapshot.empty) {
                logList.innerHTML = '<p>No updates yet. Add one!</p>';
                return;
            }
            snapshot.forEach(doc => {
                const log = doc.data();
                const logCard = document.createElement('div');
                logCard.className = 'log-card';

                let mediaHtml = '';
                if (log.mediaUrl) {
                    if (log.mediaType === 'video') {
                        mediaHtml = `<div class="log-media"><video src="${log.mediaUrl}" controls></video></div>`;
                    } else {
                        mediaHtml = `<div class="log-media"><img src="${log.mediaUrl}"></div>`;
                    }
                }

                logCard.innerHTML = `
                    <div class="log-date">${log.createdAt ? new Date(log.createdAt.toDate()).toLocaleDateString() : 'Just now'}</div>
                    <p>${log.content}</p>
                    ${mediaHtml}
                `;
                logList.appendChild(logCard);
            });
        })
        .catch(err => {
            logList.innerHTML = `<p class="error-msg">Error loading logs: ${err.message}</p>`;
        });
}

// Add Log Listener
const logForm = document.getElementById('log-form');
if (logForm) {
    logForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentProjectId) return;

        const content = document.getElementById('log-content').value;
        const mediaUrl = document.getElementById('log-media-url').value;
        const mediaType = document.getElementById('log-media-type').value;

        db.collection('projects').doc(currentProjectId).collection('logs').add({
            content,
            mediaUrl,
            mediaType,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            closeModal('log-modal');
            logForm.reset();
            loadProjectLogs(currentProjectId);
        });
    });
}

// --- EDIT FUNCTIONS ---
function openEditProjectModal() {
    if (!currentProjectId) return;
    document.getElementById('edit-project-title').value = document.getElementById('detail-title').textContent;
    // Extract status text (remove "Status: ")
    const statusText = document.getElementById('detail-status').textContent.replace('Status: ', '');
    document.getElementById('edit-project-status').value = statusText;
    document.getElementById('edit-project-description').value = document.getElementById('detail-description').textContent;

    openModal('edit-project-modal');
}

function openEditWikiModal() {
    if (!currentLoreId) return;
    document.getElementById('edit-wiki-title').value = document.getElementById('wiki-title').textContent;
    document.getElementById('edit-wiki-content').value = document.getElementById('wiki-content').innerText;

    const img = document.getElementById('wiki-image');
    // Only set if src is not empty/hidden
    document.getElementById('edit-wiki-image-url').value = img.style.display !== 'none' ? img.src : '';

    openModal('edit-wiki-modal');
}

// Edit Listeners
const editProjectForm = document.getElementById('edit-project-form');
if (editProjectForm) {
    editProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentProjectId) return;

        const title = document.getElementById('edit-project-title').value;
        const status = document.getElementById('edit-project-status').value;
        const description = document.getElementById('edit-project-description').value;

        db.collection('projects').doc(currentProjectId).update({
            title, status, description
        }).then(() => {
            closeModal('edit-project-modal');
            document.getElementById('detail-title').textContent = title;
            document.getElementById('detail-status').textContent = 'Status: ' + status;
            document.getElementById('detail-description').textContent = description;
        });
    });
}

const editWikiForm = document.getElementById('edit-wiki-form');
if (editWikiForm) {
    editWikiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentLoreId) return;

        const title = document.getElementById('edit-wiki-title').value;
        const content = document.getElementById('edit-wiki-content').value;
        const imageUrl = document.getElementById('edit-wiki-image-url').value;

        db.collection('lore').doc(currentLoreId).update({
            title, content, imageUrl
        }).then(() => {
            closeModal('edit-wiki-modal');
            document.getElementById('wiki-title').textContent = title;
            document.getElementById('wiki-content').innerHTML = content.replace(/\n/g, '<br>');
            const img = document.getElementById('wiki-image');
            if (imageUrl) {
                img.src = imageUrl;
                img.style.display = 'block';
            } else {
                img.style.display = 'none';
            }
        });
    });
}
