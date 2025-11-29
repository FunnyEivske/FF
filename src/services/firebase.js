import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyC6VZ1JUIfZBmrItbvpCqYAR8JEV4j-bME",
    authDomain: "forestfoundry.firebaseapp.com",
    projectId: "forestfoundry",
    storageBucket: "forestfoundry.firebasestorage.app",
    messagingSenderId: "670933705692",
    appId: "1:670933705692:web:e1e556bec215e23b80e519"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
