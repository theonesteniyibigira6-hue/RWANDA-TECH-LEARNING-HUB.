/**
 * Rwanda Tech Learning Hub - Firebase Integration Module
 * Path: assets/js/rtlh/firebase.js
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    collection, 
    getDocs, 
    query, 
    where 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your Firebase configuration for Rwanda Tech Learning Hub
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "rwanda-tech-learning-hub.firebaseapp.com",
    projectId: "rwanda-tech-learning-hub",
    storageBucket: "rwanda-tech-learning-hub.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * AUTHENTICATION HELPERS
 */

// User Register
export async function registerUser(email, password, fullName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            fullName: fullName,
            email: email,
            role: "student",
            createdAt: new Date().toISOString()
        });

        return { success: true, user };
    } catch (error) {
        console.error("Error registering user:", error.message);
        return { success: false, error: error.message };
    }
}

// User Login
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error("Error logging in:", error.message);
        return { success: false, error: error.message };
    }
}

// User Logout
export async function logoutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error("Error logging out:", error.message);
        return { success: false, error: error.message };
    }
}

// Auth State Monitor
export function monitorAuthState(callback) {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}

/**
 * RTLH FIRESTORE DATA HELPERS
 */

// Fetch User Profile
export async function getUserProfile(userId) {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            return { success: true, data: userDoc.data() };
        } else {
            return { success: false, error: "User profile not found." };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Save User Course Progress
export async function saveCourseProgress(userId, courseId, progressData) {
    try {
        const progressRef = doc(db, "progress", `${userId}_${courseId}`);
        await setDoc(progressRef, {
            userId,
            courseId,
            ...progressData,
            updatedAt: new Date().toISOString()
        }, { merge: true });

        return { success: true };
    } catch (error) {
        console.error("Error saving progress:", error.message);
        return { success: false, error: error.message };
    }
}