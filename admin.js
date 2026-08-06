// ==========================================
// LEARNIFY ADMIN DASHBOARD CORE SCRIPT
// Designed & Maintained by Ajmal Mansoori
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // LocalStorage Keys & Data Structure
  const STORAGE_KEY = "learnify_admin_posts";
  const PROFILE_KEY = "learnify_admin_profile";

  // Initial Posts Initializer
  let postsData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  let profileData = JSON.parse(localStorage.getItem(PROFILE_KEY)) || {
    name: "Ajmal Mansoori",
    email: "admin@example.com",
    phone: "",
    address: "Prayagraj, Uttar Pradesh",
    avatar: ""
  };

  // DOM Elements - Sidebar & Mobile Toggle
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");

  // DOM Elements - Header Profile Dropdown
  const profileDropdownBtn = document.getElementById("profileDropdownBtn");
  const profileDropdownMenu = document.getElementById("profileDropdownMenu");
  const logoutBtn = document.getElementById("logoutBtn");

  // DOM Elements - Forms & Modals
  const universalFormModal = document.getElementById("universalFormModal");
  const universalPostForm = document.getElementById("universalPostForm");
  const uniCategorySelect = document.getElementById("uniCategory");

  // ----------------------------------------------------
  // 1. SIDEBAR TOGGLE & MOBILE RESPONSIVENESS
  // ----------------------------------------------------
  function toggleSidebar() {
    if (sidebar) sidebar.classList.toggle("active");
    if (overlay) overlay.classList.toggle("active");
  }

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener("click", toggleSidebar);
  }

  if (overlay) {
    overlay.addEventListener("click", toggleSidebar);
  }

  // ----------------------------------------------------
  // 2. HEADER PROFILE DROPDOWN
  // ----------------------------------------------------
  if (profileDropdownBtn && profileDropdownMenu) {
    profileDropdownBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", () => {
      profileDropdownMenu.classList.remove("show");
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Kya aap sach me logout karna chahte hain?")) {
        alert("Aap successfully logout ho chuke hain.");
        window.location.reload();
      }
    });
  }

  // 3. GLOBAL MODAL CONTROLS (window scope me bind kiya gaya hai)
  window.openUniversalForm = function (defaultCategory = "latestjob") {
    const universalFormModal = document.getElementById("universalFormModal");
    if (universalFormModal) {
      universalFormModal.style.display = "block";
      const uniCategorySelect = document.getElementById("uniCategory");
      if (uniCategorySelect) uniCategorySelect.value = defaultCategory;
    }
  };

  window.closeUniversalForm = function () {
    const universalFormModal = document.getElementById("universalFormModal");
    if (universalFormModal) {
      universalFormModal.style.display = "none";
      const universalPostForm = document.getElementById("universalPostForm");
      if (universalPostForm) universalPostForm.reset();
    }
  };

  // ----------------------------------------------------
  // 4. RENDER DASHBOARD OVERVIEW DATA
  // ----------------------------------------------------
  function renderDashboardData() {
    // Total counters update
    const totalPostsCount = document.getElementById("totalPostsCount");
    if (totalPostsCount) totalPostsCount.textContent = postsData.length;

    // Render Recent Feed on Dashboard
    const dashboardHistoryList = document.getElementById("dashboardHistoryList");
    if (dashboardHistoryList) {
      if (postsData.length === 0) {
        dashboardHistoryList.innerHTML = "<p style='color: #64748b;'>Koi active posts nahi mila. Naya post add karein!</p>";
      } else {
        dashboardHistoryList.innerHTML = createPostTable(postsData);
      }
    }
  }

  // Helper Table Builder
  function createPostTable(list) {
    let html = `
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
          <thead>
            <tr style="border-bottom: 2px solid #e2e8f0; color: #475569;">
              <th style="padding: 10px;">Date</th>
              <th style="padding: 10px;">Title</th>
              <th style="padding: 10px;">Category</th>
              <th style="padding: 10px;">Link / Attachments</th>
              <th style="padding: 10px; text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
    `;

    list.forEach((item) => {
      html += `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px; color: #64748b; white-space: nowrap;">${item.date}</td>
          <td style="padding: 10px; font-weight: 600;">${item.title}</td>
          <td style="padding: 10px;"><span style="background: #e0e7ff; color: #4338ca; padding: 3px 8px; border-radius: 4px; font-size: 0.8rem;">${item.category}</span></td>
          <td style="padding: 10px;">
            ${item.link !== "#" ? `<a href="${item.link}" target="_blank" style="color:#2563eb; margin-right: 8px;"><i class="fa-solid fa-link"></i> Link</a>` : ""}
            ${item.pdfName ? `<span style="color:#dc2626; margin-right:8px;"><i class="fa-solid fa-file-pdf"></i> PDF</span>` : ""}
            ${item.photoName ? `<span style="color:#16a34a;"><i class="fa-solid fa-image"></i> Image</span>` : ""}
          </td>
          <td style="padding: 10px; text-align: right;">
            <button onclick="deletePost(${item.id})" style="background: #fee2e2; color: #dc2626; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });

    html += `</tbody></table></div>`;
    return html;
  }

  // ----------------------------------------------------
  // 5. LOAD PROFILE UI IN HEADER
  // ----------------------------------------------------
  function loadHeaderProfile() {
    const displayAdminName = document.getElementById("displayAdminName");
    const topAvatarInitial = document.getElementById("topAvatarInitial");
    const topAvatarImg = document.getElementById("topAvatarImg");

    if (displayAdminName) displayAdminName.textContent = profileData.name || "Admin";

    if (profileData.avatar) {
      if (topAvatarImg) {
        topAvatarImg.src = profileData.avatar;
        topAvatarImg.style.display = "block";
      }
      if (topAvatarInitial) topAvatarInitial.style.display = "none";
    } else {
      if (topAvatarImg) topAvatarImg.style.display = "none";
      if (topAvatarInitial) {
        topAvatarInitial.style.display = "block";
        topAvatarInitial.textContent = (profileData.name || "A").charAt(0).toUpperCase();
      }
    }
  }

  // INITIALIZATION CALLS FOR ADMIN.HTML
  renderDashboardData();
  loadHeaderProfile();
});

// Firebase SDKs Import करें
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// आपका Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD837pmW5N21lMgeVlpgWPx0FaMisSnxwU",
  authDomain: "theuniversitypage-cc4a7.firebaseapp.com",
  projectId: "theuniversitypage-cc4a7",
  storageBucket: "theuniversitypage-cc4a7.firebasestorage.app",
  messagingSenderId: "31910615607",
  appId: "1:31910615607:web:bee5bd81c8118a16d1bdb2",
  measurementId: "G-6E55FCSXDP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const universalPostForm = document.getElementById("universalPostForm");

  if (universalPostForm) {
    universalPostForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = document.getElementById("uniTitle").value.trim();
      const category = document.getElementById("uniCategory").value.toLowerCase().replace(/\s+/g, ''); // e.g. "latestjob", "result", "admitcard"
      const link = document.getElementById("uniLink").value.trim();

      try {
        // Firestore की 'updates' कलेक्शन में पोस्ट जोड़ें
        await addDoc(collection(db, "updates"), {
          title: title,
          category: category,
          link: link || "#",
          createdAt: serverTimestamp()
        });

        alert("🎉 Post Firebase par safaltapoorvak publish ho gaya hai!");
        universalPostForm.reset();
        if (typeof closeUniversalForm === "function") closeUniversalForm();
      } catch (error) {
        console.error("Firebase Add Error:", error);
        alert("Post Publish karne me error aaya: " + error.message);
      }
    });
  }
});