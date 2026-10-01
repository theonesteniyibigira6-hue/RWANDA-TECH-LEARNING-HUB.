/**
 * Rwanda Tech Learning Hub - Main Dashboard Application Controller
 * Handles Firebase Authentication, Firestore queries, realtime state, and UI binding.
 */
(function() {
  'use strict';

  // State Management
  let currentUser = null;
  let userEnrollments = [];

  // DOM Elements
  const el = {
    userNameHeader: document.getElementById('userNameHeader'),
    userNameMini: document.getElementById('userNameMini'),
    userAvatarMini: document.getElementById('userAvatarMini'),
    rtlhLearnerId: document.getElementById('rtlhLearnerId'),
    statEnrolledCount: document.getElementById('statEnrolledCount'),
    statInProgressCount: document.getElementById('statInProgressCount'),
    statCompletedCount: document.getElementById('statCompletedCount'),
    statCertificatesCount: document.getElementById('statCertificatesCount'),
    statStreakDays: document.getElementById('statStreakDays'),
    recentCourseTitle: document.getElementById('recentCourseTitle'),
    recentLessonTitle: document.getElementById('recentLessonTitle'),
    recentProgressBar: document.getElementById('recentProgressBar'),
    recentProgressPct: document.getElementById('recentProgressPct'),
    recentEstTime: document.getElementById('recentEstTime'),
    continueLearningBtn: document.getElementById('continueLearningBtn'),
    coursesGridContainer: document.getElementById('coursesGridContainer'),
    globalCourseSearch: document.getElementById('globalCourseSearch'),
    signOutBtn: document.getElementById('signOutBtn'),
    hamburgerBtn: document.getElementById('hamburgerBtn'),
    closeDrawerBtn: document.getElementById('closeDrawerBtn'),
    sidebar: document.getElementById('sidebar'),
    drawerOverlay: document.getElementById('drawerOverlay'),
    aiFabBtn: document.getElementById('aiFabBtn'),
    aiDrawer: document.getElementById('aiDrawer'),
    closeAiDrawerBtn: document.getElementById('closeAiDrawerBtn'),
    aiSendBtn: document.getElementById('aiSendBtn'),
    aiInputPrompt: document.getElementById('aiInputPrompt'),
    aiChatBody: document.getElementById('aiChatBody')
  };

  // 1. AUTHENTICATION MONITOR
  function initAuth() {
    if (!window.firebase || !firebase.auth) {
      console.warn("Firebase Auth SDK not detected. Operating in preview mode.");
      renderFallbackDemoData();
      return;
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        currentUser = user;
        updateUserProfileUI(user);
        fetchUserData(user.uid);
      } else {
        // Redirect unauthenticated users to existing auth page
        window.location.href = 'account.html?redirect=my-learning-dashboard.html';
      }
    });
  }

  // 2. UPDATE PROFILE UI
  function updateUserProfileUI(user) {
    const name = user.displayName || user.email.split('@')[0];
    const photo = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00A1DE&color=fff`;

    if (el.userNameHeader) el.userNameHeader.textContent = name;
    if (el.userNameMini) el.userNameMini.textContent = name;
    if (el.userAvatarMini) el.userAvatarMini.src = photo;
    if (el.rtlhLearnerId) el.rtlhLearnerId.textContent = `ID: RTLH-${user.uid.substring(0, 8).toUpperCase()}`;
  }

  // 3. FETCH FIRESTORE USER DATA
  function fetchUserData(uid) {
    const db = firebase.firestore();

    // Fetch user enrollments
    db.collection('users').doc(uid).collection('enrollments')
      .onSnapshot((snapshot) => {
        userEnrollments = [];
        snapshot.forEach((doc) => {
          userEnrollments.push({ id: doc.id, ...doc.data() });
        });
        renderDashboardData(userEnrollments);
      }, (err) => {
        console.error("Firestore read error:", err);
        renderFallbackDemoData();
      });
  }

  // 4. RENDER DASHBOARD COURSES & STATS
  function renderDashboardData(enrollments) {
    if (!enrollments || enrollments.length === 0) {
      renderEmptyState();
      return;
    }

    let inProgress = 0;
    let completed = 0;
    let mostRecent = enrollments[0];

    enrollments.forEach(item => {
      if (item.progress === 100) completed++;
      else inProgress++;

      if (item.lastAccessed && mostRecent && item.lastAccessed > mostRecent.lastAccessed) {
        mostRecent = item;
      }
    });

    if (el.statEnrolledCount) el.statEnrolledCount.textContent = enrollments.length;
    if (el.statInProgressCount) el.statInProgressCount.textContent = inProgress;
    if (el.statCompletedCount) el.statCompletedCount.textContent = completed;
    if (el.statCertificatesCount) el.statCertificatesCount.textContent = completed;

    // Render Recent Hero
    if (mostRecent) {
      if (el.recentCourseTitle) el.recentCourseTitle.textContent = mostRecent.title || 'Web Development Fundamentals';
      if (el.recentLessonTitle) el.recentLessonTitle.textContent = mostRecent.currentLesson || 'Lesson 3: Responsive CSS Grid';
      const pct = mostRecent.progress || 25;
      if (el.recentProgressBar) el.recentProgressBar.style.width = `${pct}%`;
      if (el.recentProgressPct) el.recentProgressPct.textContent = `${pct}% Complete`;
      if (el.recentEstTime) el.recentEstTime.textContent = `${mostRecent.remainingMins || 20} mins remaining`;
      if (el.continueLearningBtn) el.continueLearningBtn.href = `self-paced.html?course=${mostRecent.id}&lesson=${mostRecent.lessonId || 1}`;
    }

    renderCourseCards(enrollments);
  }

  // 5. RENDER COURSE CARDS GRID
  function renderCourseCards(courses) {
    if (!el.coursesGridContainer) return;
    el.coursesGridContainer.innerHTML = '';

    courses.forEach(course => {
      const card = document.createElement('div');
      card.className = 'course-card';
      card.innerHTML = `
        <img class="course-thumb" src="${course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop'}" alt="${course.title}">
        <div class="course-body">
          <span class="course-domain">${course.domain || 'Technology'}</span>
          <h4 class="course-name">${course.title}</h4>
          <div class="progress-bar-bg" style="margin: 10px 0;">
            <div class="progress-bar-fill" style="width: ${course.progress || 0}%;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--text-muted); margin-bottom:12px;">
            <span>${course.progress || 0}% Done</span>
            <span>${course.type || 'Free'}</span>
          </div>
          <a href="self-paced.html?course=${course.id}" class="btn btn-primary btn-sm" style="width:100%;">Continue Study</a>
        </div>
      `;
      el.coursesGridContainer.appendChild(card);
    });
  }

  function renderEmptyState() {
    if (el.coursesGridContainer) {
      el.coursesGridContainer.innerHTML = `
        <div class="empty-state-card" style="grid-column: 1/-1; text-align:center; padding:30px; background:white; border-radius:14px;">
          <h3>No Enrolled Courses Found</h3>
          <p style="color:var(--text-muted); margin:10px 0 16px;">Discover free and paid courses to begin learning today.</p>
          <a href="learning-center.html" class="btn btn-primary">Browse Learning Center</a>
        </div>
      `;
    }
  }

  function renderFallbackDemoData() {
    renderDashboardData([
      { id: 'web-dev-101', title: 'Full-Stack Web Development', currentLesson: 'Module 2: Interactive JavaScript DOM', progress: 45, type: 'Free', domain: 'ICT' },
      { id: 'entrepreneurship-rw', title: 'Entrepreneurship & Business Innovation', currentLesson: 'Module 1: Business Plan Pitch', progress: 10, type: 'Free', domain: 'Business' }
    ]);
  }

  // 6. EVENT LISTENERS & NAVIGATION
  function bindEvents() {
    if (el.signOutBtn) {
      el.signOutBtn.addEventListener('click', () => {
        if (window.firebase && firebase.auth) {
          firebase.auth().signOut().then(() => {
            window.location.href = 'account.html';
          });
        }
      });
    }

    // Drawer toggles
    if (el.hamburgerBtn) el.hamburgerBtn.addEventListener('click', () => el.sidebar.classList.add('open'));
    if (el.closeDrawerBtn) el.closeDrawerBtn.addEventListener('click', () => el.sidebar.classList.remove('open'));
    
    // AI Companion Drawer Toggles
    if (el.aiFabBtn) el.aiFabBtn.addEventListener('click', () => el.aiDrawer.classList.add('open'));
    if (el.closeAiDrawerBtn) el.closeAiDrawerBtn.addEventListener('click', () => el.aiDrawer.classList.remove('open'));

    if (el.aiSendBtn && el.aiInputPrompt) {
      el.aiSendBtn.addEventListener('click', sendAiMessage);
      el.aiInputPrompt.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendAiMessage();
      });
    }
  }

  function sendAiMessage() {
    const prompt = el.aiInputPrompt.value.trim();
    if (!prompt) return;

    // Append user message
    const userMsg = document.createElement('div');
    userMsg.className = 'ai-msg ai-msg-user';
    userMsg.textContent = prompt;
    el.aiChatBody.appendChild(userMsg);

    el.aiInputPrompt.value = '';

    // Simulate response
    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.className = 'ai-msg ai-msg-bot';
      botMsg.textContent = `Theo AI Suggestion: Great question regarding "${prompt}"! Make sure to review your current module inside your dashboard.`;
      el.aiChatBody.appendChild(botMsg);
      el.aiChatBody.scrollTop = el.aiChatBody.scrollHeight;
    }, 800);
  }

  // Initialize Application
  document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    initAuth();
  });
})();