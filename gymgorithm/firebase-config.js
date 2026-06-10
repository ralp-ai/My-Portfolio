// firebase-config.js (updated)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyD99rwwCLgY7zuEXefR0BWYSVsZiAwRgKI",
  authDomain: "gymgorithm.firebaseapp.com",
  projectId: "gymgorithm",
  storageBucket: "gymgorithm.firebasestorage.app",
  messagingSenderId: "878669084396",
  appId: "1:878669084396:web:26142604321ed3ec4317c9",
  measurementId: "G-ZK1YXF0PZM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, analytics };