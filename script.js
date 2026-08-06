/* =========================================================
   ABHINANDAN UPDATES - MAIN LOGIC & FIREBASE SYNC (script.js)
========================================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD837pmW5N21lMgeVlpgWPx0FaMisSnxwU",
  authDomain: "theuniversitypage-cc4a7.firebaseapp.com",
  projectId: "theuniversitypage-cc4a7",
  storageBucket: "theuniversitypage-cc4a7.firebasestorage.app",
  messagingSenderId: "31910615607",
  appId: "1:31910615607:web:bee5bd81c8118a16d1bdb2",
  measurementId: "G-6E55FCSXDP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1. Sidebar Toggle Logic
document.addEventListener("DOMContentLoaded", () => {
  const sidebarToggle = document.getElementById("sidebarToggle") || document.getElementById("menuToggle");
  const navDrawer = document.getElementById("navDrawer");

  if (sidebarToggle && navDrawer) {
    sidebarToggle.addEventListener("click", () => {
      navDrawer.classList.toggle("active");
    });
  }
});

// Helper Function: 1-Line Clean Item HTML Builder (Screenshot Jaisa Same Style)
function createListItemHTML(url, title) {
  return `
    <li>
      <a href="${url}">
        <i class="fas fa-chevron-right"></i>
        <span>${title}</span>
      </a>
    </li>
  `;
}

// 2. LocalStorage Fallback Function
function renderFromLocalStorage() {
  const localAdmits = JSON.parse(localStorage.getItem("learnify_admin_admits")) || [];
  const localCutoffs = JSON.parse(localStorage.getItem("learnify_admin_cutoffs")) || [];
  
  const admitBox = document.getElementById("admitCardList");
  const cutoffBox = document.getElementById("cutoffList");

  if (admitBox && localAdmits.length > 0) {
    admitBox.innerHTML = localAdmits.map(item => 
      createListItemHTML(`admitcard-details.html?id=${item.id}`, item.examTitle || item.title)
    ).join('');
  }

  if (cutoffBox && localCutoffs.length > 0) {
    cutoffBox.innerHTML = localCutoffs.map(item => 
      createListItemHTML(`cutoff-details.html?id=${item.id}`, item.cutoffTitle || item.title)
    ).join('');
  }
}

// 3. Real-Time Firebase Listener
function listenForLiveUpdates() {
  try {
    const q = query(collection(db, "updates"), orderBy("createdAt", "desc"));

    onSnapshot(q, (snapshot) => {
      const admitBox = document.getElementById("admitCardList");
      const cutoffBox = document.getElementById("cutoffList");

      let admitItems = [];
      let cutoffItems = [];

      snapshot.forEach((docSnap) => {
        const item = docSnap.data();
        const docId = docSnap.id;
        const cat = (item.category || "").toLowerCase().trim();

        // Check category string
        if (cat.includes("admit")) {
          admitItems.push({ id: docId, ...item });
        }
        if (cat.includes("cutoff")) {
          cutoffItems.push({ id: docId, ...item });
        }
      });

      // Render Admit Cards in Index List Box
      if (admitBox) {
        if (admitItems.length > 0) {
          admitBox.innerHTML = admitItems.map(item => 
            createListItemHTML(`admitcard-details.html?id=${item.id}`, item.examTitle || item.title)
          ).join('');
        } else {
          // If Firestore is empty, load LocalStorage
          const localAdmits = JSON.parse(localStorage.getItem("learnify_admin_admits")) || [];
          if (localAdmits.length > 0) {
            admitBox.innerHTML = localAdmits.map(item => 
              createListItemHTML(`admitcard-details.html?id=${item.id}`, item.examTitle || item.title)
            ).join('');
          }
        }
      }

      // Render Cutoffs in Index List Box
      if (cutoffBox) {
        if (cutoffItems.length > 0) {
          cutoffBox.innerHTML = cutoffItems.map(item => 
            createListItemHTML(`cutoff-details.html?id=${item.id}`, item.cutoffTitle || item.title)
          ).join('');
        } else {
          const localCutoffs = JSON.parse(localStorage.getItem("learnify_admin_cutoffs")) || [];
          if (localCutoffs.length > 0) {
            cutoffBox.innerHTML = localCutoffs.map(item => 
              createListItemHTML(`cutoff-details.html?id=${item.id}`, item.cutoffTitle || item.title)
            ).join('');
          }
        }
      }

    }, (error) => {
      console.log("Firestore Error, Loading Local Data", error);
      renderFromLocalStorage();
    });
  } catch (e) {
    renderFromLocalStorage();
  }
}

listenForLiveUpdates();