/**
 * Rwanda Tech Learning Hub - Dashboard Localization Engine
 * Supports 13 Languages with persistent user preference & Arabic RTL support
 */
const DashboardI18n = (function() {
  const STORAGE_KEY = 'rtlh_lang_pref';

  const translations = {
    en: {
      portal_subtitle: "E-Class Dashboard",
      nav_overview: "Overview", nav_courses: "My Courses", nav_eclass: "E-Class Hub",
      nav_assessments: "Assignments", nav_certificates: "Certificates", nav_library: "E-Library",
      nav_community: "Community", nav_settings: "Account Settings", btn_signout: "Sign Out",
      ph_search: "Search my courses, lessons...", welcome_back: "Welcome back",
      welcome_sub: "Your learning journey continues. Keep growing your knowledge and skills.",
      btn_explore_catalog: "Explore Catalog", btn_resume_study: "Resume Last Study",
      stat_enrolled: "Enrolled Courses", stat_in_progress: "In Progress", stat_completed: "Completed",
      stat_certificates: "Certificates", stat_streak: "Study Streak", badge_recent: "MOST RECENT ACTIVITY",
      btn_continue: "Continue Lesson ➔", title_my_courses: "My Learning Library",
      desc_my_courses: "Track and manage all your registered courses", link_find_more: "+ Find More Courses",
      filter_all: "All", filter_in_progress: "In Progress", filter_completed: "Completed",
      filter_free: "Free", filter_paid: "Paid", title_assessments: "Assignments & Quizzes",
      empty_assessments: "No pending assignments or active quizzes found.", title_certificates: "Earned Certificates",
      empty_certificates: "Complete a course to unlock your server-verified certificate.", link_earn_more: "Earn More",
      title_study_goal: "Weekly Learning Target", sub_study_goal: "Set target in account settings to maintain study momentum.",
      title_eclass_live: "E-Class Live Hub", link_open_eclass: "Open Class", btn_join: "Join Room",
      title_recommended: "Recommended For You", notif_title: "Notifications", notif_mark_read: "Mark all as read",
      notif_empty: "No new notifications", ph_ai_input: "Ask Theo about your course..."
    },
    rw: {
      portal_subtitle: "Dashboard ya E-Class",
      nav_overview: "Inshamake", nav_courses: "Amasomo Yanjye", nav_eclass: "Ishuri rya E-Class",
      nav_assessments: "Ibizami & Imikoro", nav_certificates: "Impamyabumenyi", nav_library: "Isomero",
      nav_community: "Umuryango", nav_settings: "Ihitamo rya Konti", btn_signout: "Sohoka",
      ph_search: "Shakisha amasomo...", welcome_back: "Murakaza neza",
      welcome_sub: "Urugendo rwawe rwo kwiga rurakomeje. Komeza kwagura ubumenyi bwawe.",
      btn_explore_catalog: "Shakisha Amasomo", btn_resume_study: "Komeza Kwiga",
      stat_enrolled: "Amasomo Wanditsemo", stat_in_progress: "Ayo Urikwiga", stat_completed: "Ayo Warangije",
      stat_certificates: "Impamyabumenyi", stat_streak: "Iminsi Ukurikiranya", badge_recent: "IYO WAHARIYE GWIKORERA",
      btn_continue: "Komeza Isomo ➔", title_my_courses: "Inzu y'Amasomo Yanjye",
      desc_my_courses: "Cunga no gukurikirana amasomo yose wiyandikishijemo", link_find_more: "+ Shaka Ayandi Masomo",
      filter_all: "Yose", filter_in_progress: "Ayo Urikwiga", filter_completed: "Ayarangiye",
      filter_free: "Abo ku Buntu", filter_paid: "Ayishyurwa", title_assessments: "Imikoro n'Ibizami",
      empty_assessments: "Nta mukoro utarasozwa ugaragaye.", title_certificates: "Impamyabumenyi Wagize",
      empty_certificates: "Rangiza isomo kugira ngo uhabwe impamyabumenyi yemewe.", link_earn_more: "Bona Izindi",
      title_study_goal: "Icyerekezo cy'Icyumweru", sub_study_goal: "Shyiraho intego z'amasaha yo kwiga.",
      title_eclass_live: "Ishuri Ryana Mbonankubone", link_open_eclass: "Fungura Ishuri", btn_join: "Injira Muri Chumba",
      title_recommended: "Ibyo Wajya Kwiga", notif_title: "Ibyamenyeshejwe", notif_mark_read: "Soma byose",
      notif_empty: "Nta mabaruwa mashya gariho", ph_ai_input: "Baza Theo ku masomo yawe..."
    },
    fr: {
      portal_subtitle: "Tableau de Bord E-Class",
      nav_overview: "Aperçu", nav_courses: "Mes Cours", nav_eclass: "E-Class Hub",
      nav_assessments: "Devoirs & Quiz", nav_certificates: "Certificats", nav_library: "E-Bibliothèque",
      nav_community: "Communauté", nav_settings: "Paramètres", btn_signout: "Déconnexion",
      ph_search: "Rechercher des cours...", welcome_back: "Bon retour",
      welcome_sub: "Votre parcours d'apprentissage continue.", btn_explore_catalog: "Explorer le Catalogue",
      btn_resume_study: "Reprendre l'Étude", stat_enrolled: "Cours Inscrits", stat_in_progress: "En Cours",
      stat_completed: "Terminés", stat_certificates: "Certificats", stat_streak: "Jours Consecutifs",
      badge_recent: "DERNIÈRE ACTIVITÉ", btn_continue: "Continuer le Cours ➔", title_my_courses: "Ma Bibliothèque de Cours",
      desc_my_courses: "Gérez tous vos cours inscrits", link_find_more: "+ Plus de Cours",
      filter_all: "Tous", filter_in_progress: "En Cours", filter_completed: "Terminés",
      filter_free: "Gratuits", filter_paid: "Payants", title_assessments: "Devoirs et Évaluations",
      empty_assessments: "Aucun devoir en attente.", title_certificates: "Certificats Obtenus",
      empty_certificates: "Terminez un cours pour débloquer votre certificat vérifié.", link_earn_more: "En Obtenir Plus",
      title_study_goal: "Objectif Hebdomadaire", sub_study_goal: "Définissez vos objectifs d'étude.",
      title_eclass_live: "E-Class En Direct", link_open_eclass: "Ouvrir le Cours", btn_join: "Rejoindre",
      title_recommended: "Recommandé Pour Vous", notif_title: "Notifications", notif_mark_read: "Tout marquer comme lu",
      notif_empty: "Aucune nouvelle notification", ph_ai_input: "Posez une question à Theo..."
    },
    sw: {
      portal_subtitle: "Dashboard ya E-Class",
      nav_overview: "Muhtasari", nav_courses: "Kozi Zangu", nav_eclass: "Kituo cha E-Class",
      nav_assessments: "Pamoja na Maswali", nav_certificates: "Vyeti", nav_library: "Maktaba ya Mtandao",
      nav_community: "Jamii", nav_settings: "Mipangilio ya Akaunti", btn_signout: "Ondoka",
      ph_search: "Tafuta kozi na masomo...", welcome_back: "Karibu tena",
      welcome_sub: "Safari yako ya kujifunza inaendelea.", btn_explore_catalog: "Tazama Kozi",
      btn_resume_study: "Endelea Kujifunza", stat_enrolled: "Kozi Zilizosajiliwa", stat_in_progress: "Zinazoendelea",
      stat_completed: "Zilizokamilika", stat_certificates: "Vyeti", stat_streak: "Siku za Mfululizo",
      badge_recent: "SHUGHULI YA HIVI KARIBUNI", btn_continue: "Endelea na Somo ➔", title_my_courses: "Maktaba Yangu ya Kozi",
      desc_my_courses: "Simamia kozi zako zote", link_find_more: "+ Tafuta Kozi Zaidi",
      filter_all: "Zote", filter_in_progress: "Zinazoendelea", filter_completed: "Zilizokamilika",
      filter_free: "Za Libre", filter_paid: "Za Malipo", title_assessments: "Kazi na Maswali",
      empty_assessments: "Hakuna kazi zilizobaki.", title_certificates: "Vyeti Ulivyopata",
      empty_certificates: "Kamilisha kozi ili kupata cheti kilichothibitishwa.", link_earn_more: "Pata Zaidi",
      title_study_goal: "Lengo la Wiki", sub_study_goal: "Weka malengo yako ya masomo.",
      title_eclass_live: "E-Class Live", link_open_eclass: "Fungua Darasa", btn_join: "Jiunge",
      title_recommended: "Iliyopendekezwa Kwako", notif_title: "Arifa", notif_mark_read: "Soma zote",
      notif_empty: "Hakuna arifa mpya", ph_ai_input: "Muulize Theo kuhusu masomo..."
    },
    ar: {
      portal_subtitle: "لوحة تحكم الفصل الإلكتروني",
      nav_overview: "نظرة عامة", nav_courses: "دوراتي", nav_eclass: "مركز الفصول",
      nav_assessments: "الواجبات والاختبارات", nav_certificates: "الشهادات", nav_library: "المكتبة الرقمية",
      nav_community: "المجتمع", nav_settings: "إعدادات الحساب", btn_signout: "تسجيل الخروج",
      ph_search: "البحث في الدورات والدروس...", welcome_back: "مرحبًا بعودتك",
      welcome_sub: "رحلتك التعليمية مستمرة. واصل تنمية مهاراتك ومعرفتك.",
      btn_explore_catalog: "استكشاف الدورات", btn_resume_study: "متابعة الدراسة",
      stat_enrolled: "الدورات المسجلة", stat_in_progress: "قيد التقدم", stat_completed: "المكتملة",
      stat_certificates: "الشهادات", stat_streak: "أيام التتابع", badge_recent: "آخر نشاط تعليمي",
      btn_continue: "متابعة الدرس ➔", title_my_courses: "مكتبة التعلم الخاصة بي",
      desc_my_courses: "إدارة ومتابعة جميع دوراتك المسجلة", link_find_more: "+ البحث عن المزيد",
      filter_all: "الكل", filter_in_progress: "قيد التقدم", filter_completed: "المكتملة",
      filter_free: "المجانية", filter_paid: "المدفوعة", title_assessments: "الواجبات والاختبارات",
      empty_assessments: "لا توجد واجبات معلقة حاليًا.", title_certificates: "الشهادات المكتسبة",
      empty_certificates: "أكمل دورة تعليمية للحصول على شهادتك المعتمدة.", link_earn_more: "كسب المزيد",
      title_study_goal: "هدف التعلم الأسبوعي", sub_study_goal: "حدد أهدافك الدراسية للحفاظ على مستواك.",
      title_eclass_live: "الفصول المباشرة", link_open_eclass: "فتح الفصل", btn_join: "انضمام",
      title_recommended: "موصى به لك", notif_title: "الإشعارات", notif_mark_read: "تحديد الكل كقراءة",
      notif_empty: "لا توجد إشعارات جديدة", ph_ai_input: "اسأل المساعد الذكي ثيو..."
    }
  };

  function setLanguage(lang) {
    const selectedLang = translations[lang] ? lang : 'en';
    localStorage.setItem(STORAGE_KEY, selectedLang);
    
    // Toggle Text Direction for Arabic
    if (selectedLang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', selectedLang);
    }

    const dict = translations[selectedLang] || translations['en'];

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });
  }

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY) || 'en';
    const selector = document.getElementById('languageSelector');
    if (selector) {
      selector.value = saved;
      selector.addEventListener('change', (e) => setLanguage(e.target.value));
    }
    setLanguage(saved);
  }

  return { init, setLanguage };
})();

document.addEventListener('DOMContentLoaded', DashboardI18n.init);