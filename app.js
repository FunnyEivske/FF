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

// --- ROUTER & NAVIGATION ---
const router = {
    currentPageId: null,

    navigate: function (view, param = null) {
        // Hide all views
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

        // Show target view
        const targetView = document.getElementById(`view-${view}`);
        if (targetView) targetView.classList.add('active');

        // Update Sidebar
        if (view === 'home') {
            document.querySelector('.nav-btn[onclick*="home"]').classList.add('active');
            this.loadHome();
        } else if (view === 'category') {
            document.querySelector(`.nav-btn[onclick*="${param}"]`)?.classList.add('active');
            this.loadCategory(param);
        } else if (view === 'page') {
            this.loadPage(param);
        } else if (view === 'edit') {
            this.loadEditor(param);
        }
    },

    createPage: function () {
        if (!auth.currentUser) {
            alert("You must be logged in to create pages.");
            openModal('login-modal');
            return;
        }
        this.navigate('edit', null); // null param means new page
    },

    back: function () {
        if (this.currentPageId) {
            this.navigate('page', this.currentPageId);
        } else {
            this.navigate('home');
        }
    },

    // --- DATA LOADING ---

    loadHome: function () {
        const featuredList = document.getElementById('featured-list');
        const recentList = document.getElementById('recent-list');

        featuredList.innerHTML = '<div class="loading">Loading featured...</div>';

        // Fetch random/featured pages (simulated by just fetching 3)
        db.collection('pages').limit(3).get().then(snapshot => {
            featuredList.innerHTML = '';
            if (snapshot.empty) {
                featuredList.innerHTML = '<p>No pages found. Create one!</p>';
                return;
            }
            snapshot.forEach(doc => {
                const page = doc.data();
                const card = document.createElement('div');
                card.className = 'wiki-card';
                card.onclick = () => this.navigate('page', doc.id);
                card.innerHTML = `
                    <h4>${page.title}</h4>
                    <div class="meta">${page.category}</div>
                `;
                featuredList.appendChild(card);
            });
        });

        // Fetch recent changes
        db.collection('pages').orderBy('lastEditedAt', 'desc').limit(5).get().then(snapshot => {
            recentList.innerHTML = '';
            snapshot.forEach(doc => {
                const page = doc.data();
                const item = document.createElement('div');
                item.className = 'wiki-card'; // Reuse style
                item.style.marginBottom = '0.5rem';
                item.onclick = () => this.navigate('page', doc.id);
                item.innerHTML = `
                    <div style="display:flex; justify-content:space-between;">
                        <strong>${page.title}</strong>
                        <span style="font-size:0.8rem; color:var(--wiki-blue)">${page.category}</span>
                    </div>
                    <div class="meta">Updated ${page.lastEditedAt ? new Date(page.lastEditedAt.toDate()).toLocaleDateString() : 'Recently'}</div>
                `;
                recentList.appendChild(item);
            });
        });
    },

    loadCategory: function (category) {
        document.getElementById('category-title').textContent = category;
        const list = document.getElementById('category-list');
        list.innerHTML = '<div class="loading">Loading...</div>';

        db.collection('pages').where('category', '==', category).get().then(snapshot => {
            list.innerHTML = '';
            if (snapshot.empty) {
                list.innerHTML = '<p>No pages in this category.</p>';
                return;
            }
            snapshot.forEach(doc => {
                const page = doc.data();
                const card = document.createElement('div');
                card.className = 'wiki-card';
                card.onclick = () => this.navigate('page', doc.id);
                card.innerHTML = `
                    <h4>${page.title}</h4>
                    <div class="meta">Updated ${page.lastEditedAt ? new Date(page.lastEditedAt.toDate()).toLocaleDateString() : 'N/A'}</div>
                `;
                list.appendChild(card);
            });
        });
    },

    loadPage: function (pageId) {
        this.currentPageId = pageId;
        const contentDiv = document.getElementById('page-content');
        contentDiv.innerHTML = '<div class="loading">Loading...</div>';

        db.collection('pages').doc(pageId).get().then(doc => {
            if (!doc.exists) {
                contentDiv.innerHTML = '<p>Page not found.</p>';
                return;
            }
            const page = doc.data();

            // Header
            document.getElementById('page-title').textContent = page.title;

            // Content (Simple Markdown-ish to HTML)
            // Replace newlines with <br>, **text** with <b>
            let htmlContent = page.content
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                .replace(/## (.*?)(<br>|$)/g, '<h2>$1</h2>');

            contentDiv.innerHTML = htmlContent;

            // Infobox
            document.getElementById('infobox-title').textContent = page.title;
            const img = document.getElementById('infobox-image');
            if (page.imageUrl) {
                img.src = page.imageUrl;
                img.style.display = 'block';
            } else {
                img.style.display = 'none';
            }

            const infoboxData = document.getElementById('infobox-data');
            infoboxData.innerHTML = '';
            if (page.infobox) {
                for (const [key, value] of Object.entries(page.infobox)) {
                    infoboxData.innerHTML += `
                        <div class="infobox-row">
                            <span class="infobox-label">${key}</span>
                            <span>${value}</span>
                        </div>
                    `;
                }
            }

            // Edit Button Logic
            const editBtn = document.getElementById('edit-page-btn');
            editBtn.onclick = () => {
                if (auth.currentUser) {
                    this.navigate('edit', pageId);
                } else {
                    alert('Please log in to edit.');
                    openModal('login-modal');
                }
            };
        });
    },

    loadEditor: function (pageId) {
        const form = document.getElementById('edit-form');
        form.reset();

        if (pageId) {
            // Editing existing page
            db.collection('pages').doc(pageId).get().then(doc => {
                const page = doc.data();
                document.getElementById('edit-title').value = page.title;
                document.getElementById('edit-category').value = page.category;
                document.getElementById('edit-content').value = page.content;
                document.getElementById('edit-image-url').value = page.imageUrl || '';
                document.getElementById('edit-infobox-data').value = JSON.stringify(page.infobox || {}, null, 2);

                form.onsubmit = (e) => this.savePage(e, pageId);
            });
        } else {
            // New Page
            form.onsubmit = (e) => this.savePage(e, null);
        }
    },

    savePage: function (e, pageId) {
        e.preventDefault();

        const title = document.getElementById('edit-title').value;
        const category = document.getElementById('edit-category').value;
        const content = document.getElementById('edit-content').value;
        const imageUrl = document.getElementById('edit-image-url').value;
        let infobox = {};

        try {
            const jsonStr = document.getElementById('edit-infobox-data').value;
            if (jsonStr.trim()) infobox = JSON.parse(jsonStr);
        } catch (err) {
            alert("Invalid JSON in Infobox Data. Please fix it.");
            return;
        }

        const data = {
            title, category, content, imageUrl, infobox,
            lastEditedAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastEditedBy: auth.currentUser.uid
        };

        if (pageId) {
            db.collection('pages').doc(pageId).update(data).then(() => {
                this.navigate('page', pageId);
            });
        } else {
            db.collection('pages').add(data).then((docRef) => {
                this.navigate('page', docRef.id);
            });
        }
    }
};

// --- AUTHENTICATION ---
const loginBtn = document.getElementById('login-modal-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const loginArea = document.getElementById('login-area');

auth.onAuthStateChanged((user) => {
    if (user) {
        userInfo.style.display = 'block';
        loginArea.style.display = 'none';
        document.getElementById('user-email').textContent = user.email.split('@')[0];
    } else {
        userInfo.style.display = 'none';
        loginArea.style.display = 'block';
    }
});

loginBtn.onclick = () => openModal('login-modal');
logoutBtn.onclick = () => auth.signOut();

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => closeModal('login-modal'))
        .catch((error) => {
            document.getElementById('login-error').textContent = error.message;
        });
});

// --- MODAL UTILS ---
function openModal(id) { document.getElementById(id).style.display = 'block'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// --- INITIALIZATION ---
// Start at Home
router.navigate('home');
