/* ===== ENHANCED PINOY TRANSLATOR SCRIPT (UPDATED FOR NATIVE PERMISSIONS) ===== */

// Global variables
let auth, db;
let voiceTranslator = null;

/* ===== FIREBASE CONFIGURATION ===== */
async function initializeFirebase() {
  try {
    // Import Firebase modules
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
    const { getAuth } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
    const { getFirestore, collection, query, where, getDocs, addDoc, doc, setDoc, getDoc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

    // Firebase config
    const firebaseConfig = {
      apiKey: "AIzaSyDfkQ2LSbksJ9xvq0dwuA52bfQyQyJAZN0",
      authDomain: "webapp-2424c.firebaseapp.com",
      projectId: "webapp-2424c",
      storageBucket: "webapp-2424c.firebasestorage.app",
      messagingSenderId: "905725715873",
      appId: "1:905725715873:web:62cdc756685bc345f3d7e0",
      measurementId: "G-S99Q7T4RFV"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    console.log("🔥 Firebase initialized successfully");

    // Initialize features based on current page
    const currentPage = window.location.pathname.split('/').pop();

    switch(currentPage) {
      case 'index.html':
      case '':
        initializeHomePage();
        break;
      case 'login.html':
        initializeLogin();
        break;
      case 'signup.html':
        initializeSignup();
        break;
      case 'translator.html':
        initializeTranslator();
        break;
      case 'ai-chat.html':
        initializeAIChat();
        break;
      case 'faq.html':
        initializeEnhancedFAQs();
        break;
      case 'about.html':
        initializeAboutPage();
        break;
      case 'profile.html':
        initializeProfile();
        break;
      case 'forgot-pass.html':
        initializeForgotPassword();
        break;
      case 'maps.html':
        initializeMaps();
        break;
    }

  } catch (error) {
    console.error("❌ Firebase initialization error:", error);
    showNotification('Failed to initialize app. Please refresh the page.', 'error');
  }
}

/* ===== ENHANCED ANIMATIONS & INTERACTIONS ===== */
function initializeAnimations() {
  // Add fade-in animation to all cards and containers
  const animatedElements = document.querySelectorAll('.card, .translate-card, .faq-item, .profile-card, .feature-card');
  animatedElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.1}s`;
  });

  // Add hover effects to interactive elements
  initializeHoverEffects();
  initializeButtonAnimations();
  initializePageTransitions();
}

function initializeHoverEffects() {
  const hoverElements = document.querySelectorAll('.btn, .menu-item, .icon-btn, .text-link, .feature-item, .language-tag');

  hoverElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });

    element.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

function initializeButtonAnimations() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Ripple effect
      if (!this.classList.contains('no-ripple')) {
        createRippleEffect(this, e);
      }

      // Add loading state for auth buttons
      if (this.classList.contains('login-btn') || this.classList.contains('signup-btn') || this.classList.contains('save-profile-btn')) {
        this.classList.add('loading');
        setTimeout(() => {
          this.classList.remove('loading');
        }, 2000);
      }
    });
  });
}

function createRippleEffect(button, event) {
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple 0.6s linear;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    pointer-events: none;
  `;

  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.appendChild(ripple);

  setTimeout(() => {
    if (button.contains(ripple)) {
      button.removeChild(ripple);
    }
  }, 600);
}

function initializePageTransitions() {
  const links = document.querySelectorAll('a[href]:not([href^="#"]):not([href*="javascript:"])');

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) {
        e.preventDefault();

        // Add page transition
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';

        setTimeout(() => {
          window.location.href = this.getAttribute('href');
        }, 300);
      }
    });
  });
}

/* ===== PAGE INITIALIZATION FUNCTIONS ===== */
function initializeHomePage() {
  console.log('🏠 Home page initialized');
  initializeAnimations();
}

function initializeAboutPage() {
    console.log('ℹ️ About page initialized');
    initializeAnimations();

    // Add any specific about page animations or interactions
    const featureCards = document.querySelectorAll('.feature-card-improved');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

/* ===== AUTHENTICATION FUNCTIONS ===== */
async function signUpUser(email, password, username) {
  const { createUserWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
  const { setDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

  try {
    showNotification('Creating your account...', 'info');

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email,
      createdAt: new Date(),
      profilePhoto: '',
      lastLogin: new Date()
    });

    showNotification('🎉 Registration successful! Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  } catch (error) {
    console.error("❌ Sign up error:", error);
    showNotification('Error: ' + error.message, 'error');
  }
}

async function loginUser(email, password) {
  const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");

  try {
    showNotification('Signing you in...', 'info');

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update last login
    const { updateDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    await updateDoc(doc(db, "users", user.uid), {
      lastLogin: new Date()
    });

    showNotification('✅ Login successful! Welcome back!', 'success');
    setTimeout(() => {
      window.location.href = "translator.html";
    }, 1500);
  } catch (error) {
    console.error("❌ Login error:", error);
    showNotification('Error: ' + error.message, 'error');
  }
}

async function resetPassword(email) {
  const { sendPasswordResetEmail } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");

  try {
    showNotification('Sending reset email...', 'info');
    await sendPasswordResetEmail(auth, email);
    showNotification('📧 Password reset email sent! Check your inbox.', 'success');
  } catch (error) {
    console.error("❌ Password reset error:", error);
    showNotification('Error: ' + error.message, 'error');
  }
}

/* ===== PAGE-SPECIFIC INITIALIZATIONS ===== */
function initializeSignup() {
  const signupBtn = document.querySelector(".signup-btn");
  if (signupBtn) {
    signupBtn.addEventListener("click", async () => {
      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (!username || !email || !password || !confirmPassword) {
        showNotification("Please fill in all fields.", "warning");
        return;
      }

      if (password !== confirmPassword) {
        showNotification("Passwords do not match!", "error");
        return;
      }

      if (password.length < 6) {
        showNotification("Password should be at least 6 characters long.", "warning");
        return;
      }

      if (!validateEmail(email)) {
        showNotification("Please enter a valid email address.", "warning");
        return;
      }

      await signUpUser(email, password, username);
    });
  }
  initializeAnimations();
}

function initializeLogin() {
  const loginBtn = document.querySelector(".login-btn");
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (email === "" || password === "") {
        showNotification("Please enter both email and password.", "warning");
        return;
      }

      if (!validateEmail(email)) {
        showNotification("Please enter a valid email address.", "warning");
        return;
      }

      await loginUser(email, password);
    });
  }
  initializeAnimations();
}

function initializeForgotPassword() {
  const resetBtn = document.querySelector(".reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value.trim();
      if (!email) {
        showNotification("Please enter your email address.", "warning");
        return;
      }

      if (!validateEmail(email)) {
        showNotification("Please enter a valid email address.", "warning");
        return;
      }

      await resetPassword(email);
    });
  }
  initializeAnimations();
}

/* ===== TRANSLATOR FUNCTIONALITY ===== */
function initializeTranslator() {
  // Initialize voice translator
  voiceTranslator = new EnhancedVoiceTranslator();

  // Initialize menu
  initializeMenu();

  // Initialize floating AI button
  initializeFloatingAIButton();

  // Initialize bottom navigation
  initializeBottomNavigation();

  // Initialize animations
  initializeAnimations();

  // Auto-translate functionality
  const inputBox = document.getElementById("inputText");
  const outputBox = document.getElementById("outputText");
  const fromSelect = document.getElementById("inputLang");
  const toSelect = document.getElementById("outputLang");

  if (inputBox && outputBox) {
    let translateTimeout;

    inputBox.addEventListener("input", () => {
      clearTimeout(translateTimeout);
      translateTimeout = setTimeout(() => {
        autoTranslate();
      }, 500);
    });

    // Auto-translate when language changes
    fromSelect.addEventListener("change", autoTranslate);
    toSelect.addEventListener("change", autoTranslate);
  }

  // Add copy functionality
  const copyBtn = document.querySelector('.icon-btn .fa-copy')?.closest('.icon-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', copyTranslation);
  }

  // Add clear functionality
  const clearBtn = document.querySelector('.icon-btn .fa-eraser')?.closest('.icon-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearText);
  }
}

function autoTranslate() {
  const inputText = document.getElementById("inputText").value.trim();
  const inputLang = document.getElementById("inputLang").value;
  const outputLang = document.getElementById("outputLang").value;
  const outputText = document.getElementById("outputText");

  if (!inputText) {
    outputText.value = "";
    return;
  }

  // Show loading state
  outputText.style.background = 'linear-gradient(90deg, #f0fff4 50%, transparent 50%)';
  outputText.style.backgroundSize = '200% 100%';
  outputText.style.animation = 'shimmer 0.8s ease-in-out';

  setTimeout(() => {
    const translatedText = mockTranslate(inputText, inputLang, outputLang);
    outputText.value = translatedText;
    outputText.style.animation = 'none';
    outputText.style.background = '';
  }, 800);
}

function mockTranslate(text, fromLang, toLang) {
  const translations = {
    'English-Bisaya': {
      'hello': 'kumusta',
      'thank you': 'salamat',
      'how are you': 'kumusta ka',
      'good morning': 'maayong buntag',
      'good afternoon': 'maayong hapon',
      'good evening': 'maayong gabii',
      'yes': 'oo',
      'no': 'dili',
      'please': 'palihug',
      'sorry': 'pasayloa ko',
      'i love you': 'gihigugma ko ikaw',
      'beautiful': 'gwapa/gwapo',
      'food': 'pagkaon',
      'water': 'tubig',
      'house': 'balay',
      'friend': 'amigo/amiga'
    },
    'English-Tagalog': {
      'hello': 'kumusta',
      'thank you': 'salamat',
      'how are you': 'kumusta ka',
      'good morning': 'magandang umaga',
      'good afternoon': 'magandang hapon',
      'good evening': 'magandang gabi',
      'yes': 'oo',
      'no': 'hindi',
      'please': 'pakiusap',
      'sorry': 'paumanhin',
      'i love you': 'mahal kita',
      'beautiful': 'maganda',
      'food': 'pagkain',
      'water': 'tubig',
      'house': 'bahay',
      'friend': 'kaibigan'
    },
    'English-Ilocano': {
      'hello': 'kumusta',
      'thank you': 'agyamanak',
      'how are you': 'kumusta kan',
      'good morning': 'naimbag a bigat',
      'good afternoon': 'naimbag a malem',
      'good evening': 'naimbag a rabii',
      'yes': 'wen',
      'no': 'saan',
      'please': 'pangngaasi',
      'sorry': 'dispensar',
      'i love you': 'ay-ayaten ka',
      'beautiful': 'napintas',
      'food': 'taraon',
      'water': 'danum',
      'house': 'balay',
      'friend': 'gayyem'
    },
    'English-Hiligaynon': {
      'hello': 'kumusta',
      'thank you': 'salamat',
      'how are you': 'kumusta ka',
      'good morning': 'maayong aga',
      'good afternoon': 'maayong hapon',
      'good evening': 'maayong gab-i',
      'yes': 'huo',
      'no': 'indi',
      'please': 'palihog',
      'sorry': 'patawara',
      'i love you': 'palangga ta ka',
      'beautiful': 'gwapa/gwapo',
      'food': 'pagkaon',
      'water': 'tubig',
      'house': 'balay',
      'friend': 'abyan'
    },
    // NEW LANGUAGES ADDED:
    'English-Kapampangan': {
      'hello': 'kumusta',
      'thank you': 'salamat',
      'how are you': 'kumusta ka',
      'good morning': 'mayap a yabak',
      'good afternoon': 'mayap a gatpanapun',
      'good evening': 'mayap a bengi',
      'yes': 'wa',
      'no': 'ali',
      'please': 'paki',
      'sorry': 'patawad',
      'i love you': 'kaluguran daka',
      'beautiful': 'malagu',
      'food': 'pamangan',
      'water': 'danum',
      'house': 'bale',
      'friend': 'kaluguran'
    },
    'English-Bicolano': {
      'hello': 'kumusta',
      'thank you': 'dios mabalos',
      'how are you': 'kumusta ka',
      'good morning': 'marhay na aga',
      'good afternoon': 'marhay na udto',
      'good evening': 'marhay na banggi',
      'yes': 'iyo',
      'no': 'dai',
      'please': 'tabi',
      'sorry': 'patawad',
      'i love you': 'namomotan ta ka',
      'beautiful': 'magayon',
      'food': 'kakanon',
      'water': 'tubig',
      'house': 'harong',
      'friend': 'amigo'
    },
    'English-Waray': {
      'hello': 'kumusta',
      'thank you': 'salamat',
      'how are you': 'kumusta ka',
      'good morning': 'maupay nga aga',
      'good afternoon': 'maupay nga kulop',
      'good evening': 'maupay nga gab-i',
      'yes': 'oo',
      'no': 'dire',
      'please': 'palihug',
      'sorry': 'pasayloa',
      'i love you': 'hinihigugma ko ikaw',
      'beautiful': 'mahusay',
      'food': 'kakanon',
      'water': 'tubig',
      'house': 'balay',
      'friend': 'sangkay'
    },
    'English-Pangasinan': {
      'hello': 'kumusta',
      'thank you': 'salamat',
      'how are you': 'antoy ya kabwasan mo',
      'good morning': 'masantsa ya kabwasan',
      'good afternoon': 'masantsa ya ngarem',
      'good evening': 'masantsa ya labi',
      'yes': 'on',
      'no': 'andi',
      'please': 'paki',
      'sorry': 'patawaren nak',
      'i love you': 'inaaro taka',
      'beautiful': 'maong',
      'food': 'pangan',
      'water': 'danum',
      'house': 'abong',
      'friend': 'kaaro'
    },
    'English-Maguindanao': {
      'hello': 'salam',
      'thank you': 'sukran',
      'how are you': 'antonaa i khasongi ka',
      'good morning': 'mapiya i gawii',
      'good afternoon': 'mapiya i madalem',
      'good evening': 'mapiya i gawii',
      'yes': 'ee',
      'no': 'di',
      'please': 'ayadi',
      'sorry': 'patawad',
      'i love you': 'kakhabaya-an ko ska',
      'beautiful': 'mapiya',
      'food': 'kakanen',
      'water': 'ig',
      'house': 'walay',
      'friend': 'dungan'
    },
    // Reverse translations
    'Bisaya-English': {
      'kumusta': 'hello',
      'salamat': 'thank you',
      'maayong buntag': 'good morning',
      'oo': 'yes',
      'dili': 'no'
    },
    'Tagalog-English': {
      'kumusta': 'hello',
      'salamat': 'thank you',
      'magandang umaga': 'good morning',
      'oo': 'yes',
      'hindi': 'no'
    },
    'Ilocano-English': {
      'kumusta': 'hello',
      'agyamanak': 'thank you',
      'naimbag a bigat': 'good morning',
      'wen': 'yes',
      'saan': 'no'
    },
    'Hiligaynon-English': {
      'kumusta': 'hello',
      'salamat': 'thank you',
      'maayong aga': 'good morning',
      'huo': 'yes',
      'indi': 'no'
    },
    'Kapampangan-English': {
      'kumusta': 'hello',
      'salamat': 'thank you',
      'mayap a yabak': 'good morning',
      'wa': 'yes',
      'ali': 'no'
    },
    'Bicolano-English': {
      'kumusta': 'hello',
      'dios mabalos': 'thank you',
      'marhay na aga': 'good morning',
      'iyo': 'yes',
      'dai': 'no'
    },
    'Waray-English': {
      'kumusta': 'hello',
      'salamat': 'thank you',
      'maupay nga aga': 'good morning',
      'oo': 'yes',
      'dire': 'no'
    },
    'Pangasinan-English': {
      'kumusta': 'hello',
      'salamat': 'thank you',
      'masantsa ya kabwasan': 'good morning',
      'on': 'yes',
      'andi': 'no'
    },
    'Maguindanao-English': {
      'salam': 'hello',
      'sukran': 'thank you',
      'mapiya i gawii': 'good morning',
      'ee': 'yes',
      'di': 'no'
    }
  };

  const key = `${fromLang}-${toLang}`;
  const lowerText = text.toLowerCase();

  if (translations[key] && translations[key][lowerText]) {
    return translations[key][lowerText];
  }

  // Simple word-by-word translation for longer texts
  const words = text.split(' ');
  const translatedWords = words.map(word => {
    const lowerWord = word.toLowerCase();
    return translations[key]?.[lowerWord] || word;
  });

  return translatedWords.join(' ');
}

function copyTranslation() {
  const outputText = document.getElementById("outputText");
  if (outputText && outputText.value) {
    outputText.select();
    document.execCommand("copy");
    showNotification('📋 Translation copied to clipboard!', 'success');
  } else {
    showNotification('No translation to copy', 'warning');
  }
}

function clearText() {
  const inputText = document.getElementById("inputText");
  const outputText = document.getElementById("outputText");

  if (inputText) inputText.value = '';
  if (outputText) outputText.value = '';

  showNotification('Text cleared', 'info');
}

/* ===== ENHANCED VOICE TRANSLATOR (PERMISSIONS FIXED) ===== */
class EnhancedVoiceTranslator {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isRecording = false;
    // this.permissionGranted = false; // <-- REMOVED: Managed by native prompt now

    this.initializeElements();
    this.setupEventListeners();
    this.checkBrowserSupport();
  }

  initializeElements() {
    this.micBtn = document.getElementById('micBtn');
    this.speakBtn = document.getElementById('speakBtn');
    this.inputText = document.getElementById('inputText');
    this.outputText = document.getElementById('outputText');
    this.recordingStatus = document.getElementById('recordingStatus');
  }

  setupEventListeners() {
    // Enhanced microphone button with better feedback
    this.micBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleMicClick();
    });

    this.micBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.handleMicClick();
    });

    // Enhanced speaker button
    this.speakBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.speakTranslation();
    });

    this.speakBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.speakTranslation();
    });
  }

  checkBrowserSupport() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
          this.micBtn.disabled = true;
          this.micBtn.title = "Speech recognition not supported in your browser";
          this.showMessage("Speech recognition is not supported in your browser", 'warning');
          return;
      }

      // Enhanced TTS support check
      if (!this.synthesis || typeof SpeechSynthesisUtterance === 'undefined') {
          this.speakBtn.disabled = true;
          this.speakBtn.title = "Text-to-speech not supported in your browser";
          console.warn("Text-to-speech not supported");
      }

      // Check if we're on mobile
      this.isMobile = /Android|webOS|iPhone|iPad|Ipod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  async handleMicClick() {
    if (this.isRecording) {
      this.stopRecording();
      return;
    }

    try {
      // The native permission check is handled within startRecording's call to getUserMedia()
      await this.startRecording();
    } catch (error) {
      // Catch any final errors not handled by the specific onerror below
      this.showMessage('Error accessing microphone: ' + error.message, 'error');
    }
  }

  // --- REMOVED requestMicrophonePermission function as it's redundant ---

  async startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.showMessage('Speech recognition not supported in your browser', 'error');
      return;
    }

    try {
      // *** CORE FIX: This triggers the native Android pop-up via WebChromeClient ***
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Stop the stream tracks immediately to release the microphone for SpeechRecognition
      stream.getTracks().forEach(track => track.stop());

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = this.getLanguageCode(document.getElementById('inputLang').value);

      this.recognition.onstart = () => {
        this.isRecording = true;
        this.updateRecordingUI(true);
        this.showMessage('🎤 Listening... Speak now!', 'info');
      };

      this.recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript) {
          this.inputText.value = interimTranscript;
          this.inputText.style.background = 'linear-gradient(90deg, #f0fff4 50%, transparent 50%)';
          this.inputText.style.backgroundSize = '200% 100%';
          this.inputText.style.animation = 'shimmer 0.5s ease-in-out';
        }

        if (finalTranscript) {
          this.inputText.value = finalTranscript;
          this.inputText.style.animation = 'none';
          this.inputText.style.background = '';
          autoTranslate();
          this.showMessage('✅ Speech captured successfully!', 'success');
        }
      };

      this.recognition.onend = () => {
        this.isRecording = false;
        this.updateRecordingUI(false);
      };

      this.recognition.onerror = (event) => {
        this.isRecording = false;
        this.updateRecordingUI(false);

        let errorMessage = "Speech recognition error: ";
        switch (event.error) {
          case 'not-allowed':
          case 'permission-denied':
            errorMessage = "Microphone permission denied. Please allow microphone access and try again.";
            // this.permissionGranted = false; // REMOVED
            break;
          case 'audio-capture':
            errorMessage = "No microphone found. Please check your audio input devices.";
            break;
          case 'network':
            errorMessage = "Network error occurred during speech recognition.";
            break;
          case 'no-speech':
            errorMessage = "No speech detected. Please try speaking again.";
            break;
          case 'aborted':
            errorMessage = "Speech recognition was aborted.";
            break;
          default:
            errorMessage += event.error;
        }

        this.showMessage('❌ ' + errorMessage, 'error');
      };

      try {
        this.recognition.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        this.showMessage("Error starting voice recognition. Please try again.", 'error');
      }

    } catch (error) {
        // This catch handles the initial permission denial from getUserMedia()
        this.showMessage('Microphone permission was denied. Please allow access to record.', 'error');
    }
  }

  stopRecording() {
    if (this.recognition) {
      this.recognition.stop();
    }
    this.isRecording = false;
    this.updateRecordingUI(false);
  }

  updateRecordingUI(recording) {
    if (recording) {
      this.micBtn.classList.add('recording');
      this.micBtn.innerHTML = '<i class="fas fa-stop"></i>';
      this.micBtn.style.background = '#e53e3e';
      this.recordingStatus.textContent = "Listening...";
      this.recordingStatus.style.color = "#e53e3e";
    } else {
      this.micBtn.classList.remove('recording');
      this.micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
      this.micBtn.style.background = '';
      this.recordingStatus.textContent = "";
    }
  }

  speakTranslation() {
      const outputText = document.getElementById("outputText");
      const speakBtn = document.getElementById("speakBtn");

      if (!outputText || !outputText.value) {
          this.showMessage('No text to speak', 'warning');
          return;
      }

      const text = outputText.value.trim();

      // Cancel any ongoing speech
      if (this.synthesis) {
          this.synthesis.cancel();
      }

      // Check if speech synthesis is supported
      if (!this.synthesis) {
          this.showMessage('Text-to-speech is not supported in your browser', 'warning');
          return;
      }

      // Check if speech synthesis is actually available (Android WebView specific)
      if (typeof SpeechSynthesisUtterance === 'undefined') {
          this.showMessage('Text-to-speech not available on this device', 'warning');
          return;
      }

      const utterance = new SpeechSynthesisUtterance(text);

      // Set language based on output language selection
      const outputLang = document.getElementById('outputLang').value;
      utterance.lang = this.getLanguageCode(outputLang);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Visual feedback
      if (speakBtn) {
          speakBtn.style.background = '#38a169';
          speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      }

      utterance.onstart = () => {
          this.showMessage('🔊 Speaking...', 'info');
          if (speakBtn) {
              speakBtn.style.background = '#38a169';
              speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
          }
      };

      utterance.onend = () => {
          this.showMessage('Finished speaking', 'success');
          if (speakBtn) {
              speakBtn.style.background = '';
              speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
          }
      };

      utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);

          let errorMessage = 'Error with text-to-speech. Please try again.';

          // Handle specific error cases for Android WebView
          if (event.error === 'not-allowed') {
              errorMessage = 'Text-to-speech permission denied. Please check your app permissions.';
          } else if (event.error === 'audio-capture') {
              errorMessage = 'Audio output not available. Please check your device audio.';
          }

          this.showMessage(errorMessage, 'error');
          if (speakBtn) {
              speakBtn.style.background = '';
              speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
          }
      };

      try {
          this.synthesis.speak(utterance);
      } catch (error) {
          console.error("Error starting speech synthesis:", error);
          this.showMessage("Text-to-speech not available on this device", 'error');
          if (speakBtn) {
              speakBtn.style.background = '';
              speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
          }
      }
  }

  getLanguageCode(language) {
      const languageCodes = {
          'English': 'en-US',
          'Tagalog': 'tl-PH',
          'Bisaya': 'ceb-PH', // Cebuano
          'Ilocano': 'ilo-PH', // Ilocano
          'Hiligaynon': 'hil-PH', // Hiligaynon
          'Kapampangan': 'pam-PH', // Kapampangan
          'Bicolano': 'bcl-PH', // Central Bicolano
          'Waray': 'war-PH', // Waray
          'Pangasinan': 'pag-PH', // Pangasinan
          'Maguindanao': 'mdh-PH', // Maguindanao
          'Filipino': 'tl-PH'
      };
      return languageCodes[language] || 'en-US'; // Default to English
  }

  showMessage(message, type = 'info') {
    showNotification(message, type);
  }
}

/* ===== MENU FUNCTIONALITY ===== */
function initializeMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  const closeMenuBtn = document.getElementById('closeMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const sideMenu = document.getElementById('sideMenu');
  const logoutBtn = document.getElementById('logoutBtn');

  // Open menu
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      sideMenu.classList.add('open');
      menuOverlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  }

  // Close menu
  function closeMenu() {
    sideMenu.classList.remove('open');
    menuOverlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeMenu);
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }

  // Logout functionality
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        const { signOut } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
        await signOut(auth);
        showNotification('👋 Logged out successfully!', 'success');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      } catch (error) {
        console.error('Logout error:', error);
        showNotification('Error logging out: ' + error.message, 'error');
      }
    });
  }

  // Load user data if logged in
  loadUserData();
}

async function loadUserData() {
  try {
    const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
    const { getDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User authenticated:", user.email);

        const usernameElement = document.getElementById('menuUsername');
        const profileUsername = document.getElementById('username');
        const emailElement = document.getElementById('email');

        // Set email immediately
        if (emailElement) {
          emailElement.value = user.email;
        }

        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const displayName = userData.username || user.email.split('@')[0];

            console.log("User data from Firestore:", userData);
            console.log("Display name to set:", displayName);

            // Set username in side menu
            if (usernameElement) {
              usernameElement.textContent = displayName;
              console.log("Username element updated");
            }

            // Set username in profile form
            if (profileUsername && userData.username) {
              profileUsername.value = userData.username;
            }

            // Load profile picture if exists - ADDED THIS CHECK
            if (userData.profilePhoto) {
              console.log("Loading profile picture from Firestore");
              loadProfilePicture(userData.profilePhoto);
            } else {
              console.log("No profile photo found in Firestore");
            }
          } else {
            // No user data in Firestore, use email as fallback
            const displayName = user.email.split('@')[0];
            console.log("No Firestore data, using fallback:", displayName);

            if (usernameElement) {
              usernameElement.textContent = displayName;
            }
            if (profileUsername) {
              profileUsername.value = displayName;
            }
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          // Fallback to email username
          const displayName = user.email.split('@')[0];
          if (usernameElement) {
            usernameElement.textContent = displayName;
          }
        }
      } else {
        console.log("No user signed in");
        // User is not signed in, redirect if on protected page
        const protectedPages = ['translator.html', 'profile.html', 'ai-chat.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (protectedPages.includes(currentPage)) {
          window.location.href = 'login.html';
        }
      }
    });
  } catch (error) {
    console.error("Error setting up auth state:", error);
  }
}

function loadProfilePicture(imageData) {
  const profilePicture = document.getElementById('profilePicture');
  const menuProfilePicture = document.getElementById('menuProfilePicture');
  const profilePlaceholder = document.getElementById('profilePlaceholder');
  const profileContainer = document.querySelector('.profile-picture-container');
  const menuUserAvatar = document.querySelector('.user-avatar');

  // Update profile page picture
  if (profilePicture && profilePlaceholder && profileContainer) {
    profilePicture.src = imageData;
    profileContainer.classList.add('profile-picture-loaded');
  }

  // Update menu picture
  if (menuProfilePicture && menuUserAvatar) {
    menuProfilePicture.src = imageData;
    menuUserAvatar.classList.add('user-avatar-loaded');
    console.log("Menu profile picture updated:", imageData);
  }
}

/* ===== PROFILE FUNCTIONALITY ===== */
function initializeProfile() {
  const saveBtn = document.getElementById('saveProfile');
  const profilePhotoInput = document.getElementById('profilePhoto');
  const profileContainer = document.getElementById('profilePictureContainer');

  // Load current user data
  loadUserData();

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      await updateProfile();
    });
  }

  // Click on profile picture container to open file dialog
  if (profileContainer) {
    profileContainer.addEventListener('click', () => {
      profilePhotoInput.click();
    });
  }

  // Handle file selection
  if (profilePhotoInput) {
    profilePhotoInput.addEventListener('change', async (event) => {
      await handleProfilePhotoChange(event);
    });
  }

  initializeAnimations();
}

async function handleProfilePhotoChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showNotification('Please select an image file.', 'warning');
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showNotification('Please select an image smaller than 5MB.', 'warning');
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) {
      showNotification('Please log in to update your profile picture.', 'warning');
      return;
    }

    // Show loading state
    const container = document.querySelector('.profile-picture-container');
    container.classList.add('loading');

    // Convert image to base64 for storage
    const reader = new FileReader();
    reader.onload = async function(e) {
      try {
        const { updateDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

        // Save to Firestore
        await updateDoc(doc(db, "users", user.uid), {
          profilePhoto: e.target.result,
          updatedAt: new Date()
        });

        // Update UI
        loadProfilePicture(e.target.result);
        showNotification('✅ Profile picture updated successfully!', 'success');

      } catch (error) {
        console.error("Error saving profile picture:", error);
        showNotification("Error updating profile picture: " + error.message, 'error');
      } finally {
        container.classList.remove('loading');
      }
    };

    reader.readAsDataURL(file);

  } catch (error) {
    console.error("Error handling profile photo:", error);
    showNotification("Error updating profile picture: " + error.message, 'error');
  }
}

async function updateProfile() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  try {
    const { updatePassword } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
    const { updateDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

    const user = auth.currentUser;

    if (!user) {
      showNotification('Please log in to update your profile.', 'warning');
      return;
    }

    let updates = { updatedAt: new Date() };

    // Update username in Firestore
    if (username) {
      updates.username = username;
    }

    await updateDoc(doc(db, "users", user.uid), updates);

    // Update password if provided
    if (password) {
      if (password !== confirmPassword) {
        showNotification("Passwords don't match!", 'error');
        return;
      }

      if (password.length < 6) {
        showNotification("Password should be at least 6 characters long.", 'warning');
        return;
      }

      await updatePassword(user, password);
    }

    showNotification('✅ Profile updated successfully!', 'success');

    // Clear password fields
    document.getElementById('password').value = '';
    document.getElementById('confirm-password').value = '';

    // Update menu username
    const menuUsername = document.getElementById('menuUsername');
    if (menuUsername && username) {
      menuUsername.textContent = username;
    }

  } catch (error) {
    console.error("Error updating profile:", error);
    showNotification("Error updating profile: " + error.message, 'error');
  }
}

/* ===== AI CHAT FUNCTIONALITY ===== */
function addMessageToChat(content, sender) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message fade-in`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = sender === 'user' ? '👤' : '🤖';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    // Convert **bold** text to <strong> tags
    const formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Check if content contains line breaks and format accordingly
    if (formattedContent.includes('\n')) {
        const lines = formattedContent.split('\n');
        lines.forEach((line, index) => {
            if (line.trim() === '') return;

            const p = document.createElement('p');
            p.innerHTML = line;
            if (index === lines.length - 1) {
                p.style.marginBottom = '0';
            }
            contentDiv.appendChild(p);
        });
    } else {
        contentDiv.innerHTML = formattedContent;
    }

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom smoothly
    setTimeout(() => {
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    // Remove existing typing indicator if any
    removeTypingIndicator();

    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'message ai-message';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;

    chatMessages.appendChild(typingDiv);

    // Scroll to show typing indicator
    setTimeout(() => {
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/* ===== ENHANCED AI CHAT FUNCTIONALITY FOR 10 PHILIPPINE LANGUAGES ===== */

async function getAIResponse(message) {
    // Comprehensive Philippine languages database with enhanced information
    const languageDatabase = {
        'tagalog': {
            name: "Tagalog",
            nativeName: "Wikang Tagalog",
            speakers: "28 million native, 82 million total",
            regions: "Metro Manila, CALABARZON, Central Luzon, MIMAROPA",
            origin: "Central Luzon, Philippines",
            languageFamily: "Austronesian > Malayo-Polynesian > Philippine",
            writingSystem: "Latin (Filipino alphabet), Baybayin (historically)",
            features: "• Verb-subject-object (VSO) word order\n• Rich system of affixes and reduplication\n• Focus system in verbs\n• Spanish and English loanwords\n• Basis of Filipino national language",
            commonPhrases: {
                'hello': "Kumusta",
                'thank you': "Salamat",
                'how are you': "Kumusta ka",
                'good morning': "Magandang umaga",
                'good afternoon': "Magandang hapon",
                'good evening': "Magandang gabi",
                'i love you': "Mahal kita",
                'yes': "Oo",
                'no': "Hindi",
                'please': "Pakiusap",
                'sorry': "Paumanhin"
            },
            culturalNotes: "Tagalog is the foundation of the Filipino national language. It has significant Spanish influence with about 4,000 loan words. Tagalog literature dates back to the 16th century with works like Florante at Laura."
        },

        'bisaya': {
            name: "Bisaya (Cebuano)",
            nativeName: "Binisaya",
            speakers: "21 million native speakers",
            regions: "Central Visayas, Eastern Visayas, Mindanao (especially CARAGA and Northern Mindanao)",
            origin: "Cebu and Central Visayas",
            languageFamily: "Austronesian > Malayo-Polynesian > Philippine > Central Philippine",
            writingSystem: "Latin script",
            features: "• Verb-subject-object (VSO) order\n• Complex verb system with focus\n• Distinction between 'y' and 'z' sounds\n• Rich vocabulary for maritime life\n• Multiple dialects across regions",
            commonPhrases: {
                'hello': "Kumusta",
                'thank you': "Salamat",
                'how are you': "Kumusta ka",
                'good morning': "Maayong buntag",
                'good afternoon': "Maayong hapon",
                'good evening': "Maayong gabii",
                'i love you': "Gihigugma ko ikaw",
                'yes': "Oo",
                'no': "Dili",
                'please': "Palihug",
                'sorry': "Pasayloa ko"
            },
            culturalNotes: "Bisaya speakers are proud of their distinct cultural identity. The language has several dialects including Cebuano, Boholano, and Leyteño. Known for vibrant festivals like Sinulog."
        },

        'ilocano': {
            name: "Ilocano",
            nativeName: "Pagsasao nga Ilokano",
            speakers: "8 million native speakers",
            regions: "Ilocos Region, Northern Luzon, parts of Mindanao, Hawaiian diaspora",
            origin: "Ilocos Region, Northwestern Luzon",
            languageFamily: "Austronesian > Malayo-Polynesian > Philippine > Northern Luzon",
            writingSystem: "Latin script (historically Kur-itan script)",
            features: "• Predominantly prefixing language\n• VSO word order\n• Unique number system\n• Loanwords from Spanish and English\n• Strong oral and written tradition",
            commonPhrases: {
                'hello': "Kumusta ka",
                'thank you': "Agyamanak",
                'how are you': "Kumusta kan",
                'good morning': "Naimbag a bigat",
                'good afternoon': "Naimbag a malem",
                'good evening': "Naimbag a rabii",
                'i love you': "Ay-ayaten ka",
                'yes': "Wen",
                'no': "Saan",
                'please': "Pangngaasi",
                'sorry': "Dispensar"
            },
            culturalNotes: "Ilocanos are known for being hardworking and thrifty. The language has a strong presence in Hawaiian communities due to migration during the plantation era. Famous for literature like Biag ni Lam-ang."
        },

        'hiligaynon': {
            name: "Hiligaynon (Ilonggo)",
            nativeName: "Inilonggo",
            speakers: "9 million native speakers",
            regions: "Western Visayas, Negros Island, South Cotabato, Sultan Kudarat",
            origin: "Iloilo and Western Visayas",
            languageFamily: "Austronesian > Malayo-Polynesian > Philippine > Central Philippine",
            writingSystem: "Latin script",
            features: "• Known for melodic and gentle sound\n• Verb-focused grammar\n• Spanish influence in vocabulary\n• Reduplication for emphasis\n• Polite speech forms and honorifics",
            commonPhrases: {
                'hello': "Kumusta",
                'thank you': "Salamat",
                'how are you': "Kumusta ka",
                'good morning': "Maayong aga",
                'good afternoon': "Maayong hapon",
                'good evening': "Maayong gab-i",
                'i love you': "Palangga ta ka",
                'yes': "Huo",
                'no': "Indi",
                'please': "Palihog",
                'sorry': "Patawara"
            },
            culturalNotes: "Hiligaynon speakers are often called Ilonggos. The language is known for its sweet, melodic sound. Region is famous for culinary traditions and festivals like Dinagyang."
        },

        'bicolano': {
            name: "Bicolano",
            nativeName: "Bikol",
            speakers: "4.6 million native speakers",
            regions: "Bicol Region, Southern Luzon, parts of Masbate and Catanduanes",
            origin: "Bicol Peninsula, Southeastern Luzon",
            languageFamily: "Austronesian > Malayo-Polynesian > Philippine > Central Philippine",
            writingSystem: "Latin script",
            features: "• Multiple distinct dialects\n• Verb-initial syntax\n• Rich vocabulary for natural phenomena\n• Spanish influence\n• Distinct pronoun system and verb affixes",
            commonPhrases: {
                'hello': "Kumusta",
                'thank you': "Dios mabalos",
                'how are you': "Kumusta ka",
                'good morning': "Marhay na aga",
                'good afternoon': "Marhay na udto",
                'good evening': "Marhay na banggi",
                'i love you': "Namomotan ta ka",
                'yes': "Iyo",
                'no': "Dai",
                'please': "Tabi",
                'sorry': "Patawad"
            },
            culturalNotes: "Bicol is known for its spicy food and Mayon Volcano. The language has several distinct dialects including Central Bicolano, Rinconada, and Albay Bicolano. Rich in folk literature and epic poetry."
        },

        'waray': {
            name: "Waray-Waray",
            nativeName: "Winaray",
            speakers: "3.6 million native speakers",
            regions: "Eastern Visayas, Samar, Leyte, Biliran",
            origin: "Samar and Leyte islands",
            languageFamily: "Austronesian > Malayo-Polynesian > Philippine > Central Philippine",
            writingSystem: "Latin script",
            features: "• Verb-initial structure\n• Reduplication for emphasis and plurality\n• Spanish loanwords\n• Unique phonetic inventory\n• Distinction between 's' and 'h' sounds in some dialects",
            commonPhrases: {
                'hello': "Kumusta",
                'thank you': "Salamat",
                'how are you': "Kumusta ka",
                'good morning': "Maupay nga aga",
                'good afternoon': "Maupay nga kulop",
                'good evening': "Maupay nga gab-i",
                'i love you': "Hinihigugma ko ikaw",
                'yes': "Oo",
                'no': "Dire",
                'please': "Palihug",
                'sorry': "Pasayloa"
            },
            culturalNotes: "Waray people are known for their strong spirit and resilience, especially during typhoons common in their region. Famous for the Kuratsa dance and vibrant fiestas. Strong tradition of poetry and folk songs."
        },

        'kapampangan': {
            name: "Kapampangan",
            nativeName: "Amanung Sisuan",
            speakers: "2.4 million native speakers",
            regions: "Pampanga, Tarlac, Bataan, Bulacan",
            origin: "Central Luzon plain",
            languageFamily: "Austronesian > Malayo-Polynesian > Philippine > Central Luzon",
            writingSystem: "Latin script (historically Kulitan)",
            features: "• Unusual phonology with schwa vowel\n• Complex verb system\n• Sanskrit influences in vocabulary\n• Literary tradition\n• Distinction between formal and informal registers",
            commonPhrases: {
                'hello': "Kumusta",
                'thank you': "Salamat",
                'how are you': "Kumusta ka",
                'good morning': "Mayap a yabak",
                'good afternoon': "Mayap a gatpanapun",
                'good evening': "Mayap a bengi",
                'i love you': "Kaluguran daka",
                'yes': "Wa",
                'no': "Ali",
                'please': "Paki",
                'sorry': "Patawad"
            },
            culturalNotes: "Pampanga is known as the culinary capital of the Philippines. Kapampangan has unique sounds not found in other languages. Rich heritage of literature, theater, and culinary arts. Known for Giant Lantern Festival."
        },

        'pangasinan': {
            name: "Pangasinan",
            nativeName: "Salitan Pangasinan",
            speakers: "1.8 million native speakers",
            regions: "Pangasinan, parts of Tarlac, La Union, Nueva Ecija",
            origin: "Pangasinan province, Ilocos Region",
            languageFamily: "Austronesian > Malayo-Polynesian > Philippine > Northern Luzon",
            writingSystem: "Latin script",
            features: "• Unique phonology with distinct vowel sounds\n• Verb-subject-object order\n• Spanish influence\n• Distinct pronoun system\n• Oral literature tradition including folk epics",
            commonPhrases: {
                'hello': "Kumusta",
                'thank you': "Salamat",
                'how are you': "Antoy ya kabwasan mo",
                'good morning': "Masantsa ya kabwasan",
                'good afternoon': "Masantsa ya ngarem",
                'good evening': "Masantsa ya labi",
                'i love you': "Inaro taka",
                'yes': "On",
                'no': "Andi",
                'please': "Paki",
                'sorry': "Patawaren nak"
            },
            culturalNotes: "Pangasinan means 'place of salt' - the region is known for salt production. The language has unique phonetic characteristics. Known for the Hundred Islands and Bangus Festival. Rich tradition of folk songs and dances."
        },

        'maguindanao': {
            name: "Maguindanao",
            nativeName: "Basa Magindanaw",
            speakers: "1.4 million native speakers",
            regions: "Maguindanao del Norte, Maguindanao del Sur, Cotabato, Sultan Kudarat",
            origin: "Maguindanao province, Bangsamoro region",
            languageFamily: "Austronesian > Malayo-Polynesian > Philippine > Danao",
            writingSystem: "Latin script, Arabic script (Jawi)",
            features: "• Austronesian language with Arabic influence\n• VSO word order\n• Arabic loanwords especially in religious context\n• Unique writing system\n• Poetic and oral tradition",
            commonPhrases: {
                'hello': "Salam",
                'thank you': "Sukran",
                'how are you': "Antonaa i khasongi ka",
                'good morning': "Mapiya i gawii",
                'good afternoon': "Mapiya i madalem",
                'good evening': "Mapiya i gawii",
                'i love you': "Kakhabaya-an ko ska",
                'yes': "Ee",
                'no': "Di",
                'please': "Ayadi",
                'sorry': "Patawad"
            },
            culturalNotes: "Maguindanao is spoken by the Maguindanaon people of Mindanao. The language shows significant Arabic influence due to Islamic traditions. Known for rich cultural heritage including kulintang music and traditional weaving."
        },

        'tausug': {
            name: "Tausug",
            nativeName: "Bahasa Sūg",
            speakers: "1.2 million native speakers",
            regions: "Sulu Archipelago, Tawi-Tawi, Basilan, parts of Sabah (Malaysia)",
            origin: "Jolo Island, Sulu Archipelago",
            languageFamily: "Austronesian > Malayo-Polynesian > Philippine > Sama-Bajaw",
            writingSystem: "Latin script, Arabic script (Jawi)",
            features: "• Sama-Bajaw language family\n• VSO word order\n• Arabic loanwords especially religious terms\n• Unique phonology\n• Oral epic tradition and poetic forms",
            commonPhrases: {
                'hello': "Salam",
                'thank you': "Magsukul",
                'how are you': "Maunu-unu na kaw",
                'good morning': "Maygu pagdihilam",
                'good afternoon': "Maygu pagdihapun",
                'good evening': "Maygu pamii",
                'i love you': "Lumaud aku kaniyu",
                'yes': "Huun",
                'no': "Bukun",
                'please': "Hangkan",
                'sorry': "Maapun"
            },
            culturalNotes: "Tausug means 'people of the current'. The language reflects the maritime culture of the Sulu Archipelago. Strong Islamic influence with Arabic loanwords. Known for pangalay dance and vibrant brassware tradition."
        }
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const lowerMessage = message.toLowerCase();

    // Enhanced keyword matching for better responses
    const languageKeywords = {
        'tagalog': ['tagalog', 'filipino', 'manila', 'luzon', 'national language'],
        'bisaya': ['bisaya', 'cebuano', 'cebu', 'visayas', 'mindanao', 'cebu'],
        'ilocano': ['ilocano', 'ilocos', 'iloko', 'northern luzon', 'ilocano'],
        'hiligaynon': ['hiligaynon', 'ilonggo', 'iloilo', 'western visayas', 'negros'],
        'bicolano': ['bicolano', 'bikol', 'bicol', 'mayon', 'legazpi', 'naga'],
        'waray': ['waray', 'waray-waray', 'eastern visayas', 'samar', 'leyte'],
        'kapampangan': ['kapampangan', 'pampanga', 'central luzon', 'kulitan'],
        'pangasinan': ['pangasinan', 'pangasinan', 'dagupan', 'lingayen'],
        'maguindanao': ['maguindanao', 'magindanaw', 'cotabato', 'mindanao', 'islamic'],
        'tausug': ['tausug', 'sulu', 'jolo', 'tawi-tawi', 'sulu archipelago']
    };

    // Check for specific language queries with enhanced matching
    for (const [languageKey, keywords] of Object.entries(languageKeywords)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
            const language = languageDatabase[languageKey];
            return formatEnhancedLanguageResponse(language);
        }
    }

    // Check for related terms and concepts
    if (lowerMessage.includes('philippine language') || lowerMessage.includes('filipino language') ||
        lowerMessage.includes('dialect') || lowerMessage.includes('philippines language') ||
        lowerMessage.includes('language in philippines')) {
        return getEnhancedLanguagesOverview();
    }

    if (lowerMessage.includes('how many language') || lowerMessage.includes('number of language') ||
        lowerMessage.includes('total language')) {
        return getLanguagesCountResponse();
    }

    if (lowerMessage.includes('compare') || lowerMessage.includes('difference') || lowerMessage.includes('vs')) {
        return getLanguageComparison(lowerMessage);
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('kumusta') ||
        lowerMessage.includes('hey')) {
        return getWelcomeResponse();
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        return getHelpResponse();
    }

    // Default response encouraging language exploration
    return getDefaultLanguageResponse();
}

function formatEnhancedLanguageResponse(language) {
    return `**${language.name}** (${language.nativeName}) 🇵🇭\n\n` +
           `**📍 Origin**: ${language.origin}\n` +
           `**🗣️ Speakers**: ${language.speakers}\n` +
           `**🏞️ Regions**: ${language.regions}\n` +
           `**📚 Language Family**: ${language.languageFamily}\n` +
           `**✍️ Writing System**: ${language.writingSystem}\n\n` +
           `**Key Features**:\n${language.features}\n\n` +
           `**Common Phrases**:\n` +
           `• Hello: "${language.commonPhrases.hello}"\n` +
           `• Thank you: "${language.commonPhrases['thank you']}"\n` +
           `• Good morning: "${language.commonPhrases['good morning']}"\n` +
           `• I love you: "${language.commonPhrases['i love you']}"\n` +
           `• Yes/No: "${language.commonPhrases.yes}"/"${language.commonPhrases.no}"\n\n` +
           `**Cultural Context**: ${language.culturalNotes}\n\n` +
           `*Want to compare ${language.name} with another language or learn more about other Philippine languages? Just ask!*`;
}

function getEnhancedLanguagesOverview() {
    return "🇵🇭 **Comprehensive Philippine Languages Overview**\n\n" +
           "The Philippines is incredibly linguistically diverse with **over 170 languages**! Here are the 10 major languages I can tell you about:\n\n" +
           "• **Tagalog** - National language base, Metro Manila & surrounding regions\n" +
           "• **Bisaya (Cebuano)** - Second most spoken, Central & Eastern Visayas, Mindanao\n" +
           "• **Ilocano** - Northern Luzon, strong overseas communities in Hawaii\n" +
           "• **Hiligaynon** - Western Visayas, known for its melodic sound\n" +
           "• **Bicolano** - Bicol Region, multiple distinct dialects\n" +
           "• **Waray-Waray** - Eastern Visayas, resilient culture in typhoon-prone areas\n" +
           "• **Kapampangan** - Central Luzon, culinary capital with unique phonology\n" +
           "• **Pangasinan** - Ilocos Region, known for salt production\n" +
           "• **Maguindanao** - Mindanao, Islamic influence with Arabic loanwords\n" +
           "• **Tausug** - Sulu Archipelago, maritime culture with Arabic influence\n\n" +
           "Each language has unique grammar, vocabulary, writing systems, and cultural significance! Ask about any specific language for detailed information including origin, speakers, features, and common phrases.";
}

function getLanguagesCountResponse() {
    return "🇵🇭 **Language Diversity in the Philippines**\n\n" +
           "The Philippines has remarkable linguistic diversity with:\n\n" +
           "• **🌍 Total Languages**: Over 170 distinct languages\n" +
           "• **🗣️ Major Languages**: 10 principal languages with significant speaker populations\n" +
           "• **🏝️ Geographic Spread**: Languages distributed across 7,641 islands\n" +
           "• **📊 Language Families**: Primarily Austronesian language family\n\n" +
           "**Top 10 Languages by Native Speakers**:\n" +
           "1. Tagalog/Filipino - 28 million\n" +
           "2. Bisaya (Cebuano) - 21 million\n" +
           "3. Ilocano - 8 million\n" +
           "4. Hiligaynon - 9 million\n" +
           "5. Bicolano - 4.6 million\n" +
           "6. Waray-Waray - 3.6 million\n" +
           "7. Kapampangan - 2.4 million\n" +
           "8. Pangasinan - 1.8 million\n" +
           "9. Maguindanao - 1.4 million\n" +
           "10. Tausug - 1.2 million\n\n" +
           "Many Filipinos are multilingual, speaking their native language plus Filipino and English!";
}

function getLanguageComparison(message) {
    const comparisons = {
        'tagalog bisaya': "**Tagalog vs Bisaya**:\n\n" +
                         "• **Word Order**: Both use VSO but differ in verb focus systems\n" +
                         "• **Vocabulary**: Significant differences in basic words\n" +
                         "• **Phonology**: Bisaya has distinct 'y' and 'z' sounds\n" +
                         "• **Influence**: Tagalog has more Spanish loans, Bisaya has unique native vocabulary\n" +
                         "• **Geography**: Tagalog in Luzon, Bisaya in Visayas & Mindanao",

        'bisaya tagalog': "**Bisaya vs Tagalog**:\n\n" +
                         "• **Mutual Intelligibility**: Limited - they're distinct languages\n" +
                         "• **Cultural Identity**: Both have strong regional pride\n" +
                         "• **Usage**: Tagalog is national language base, Bisaya is widely spoken in southern regions\n" +
                         "• **Learning**: Tagalog might be easier for English speakers due to more resources",

        'ilocano tagalog': "**Ilocano vs Tagalog**:\n\n" +
                          "• **Language Family**: Different branches (Northern vs Central Philippine)\n" +
                          "• **Grammar**: Ilocano has more complex prefix system\n" +
                          "• **Vocabulary**: Significant differences, though some Spanish loans shared\n" +
                          "• **Writing**: Both use Latin script now"
    };

    for (const [key, response] of Object.entries(comparisons)) {
        if (message.includes(key.split(' ')[0]) && message.includes(key.split(' ')[1])) {
            return response + "\n\n*Want more detailed comparison? Ask about specific aspects!*";
        }
    }

    return "I can help you compare Philippine languages! Try asking about specific comparisons like:\n\n" +
           "• \"Difference between Tagalog and Bisaya\"\n" +
           "• \"Compare Ilocano and Tagalog grammar\"\n" +
           "• \"How is Waray different from Hiligaynon?\"\n\n" +
           "Which languages would you like to compare?";
}

function getWelcomeResponse() {
    const welcomeMessages = [
        "Kumusta! 👋 I'm your Philippine Languages Expert! I can tell you everything about our 10 major languages:\n\n" +
        "• **Detailed Profiles** - Origin, speakers, regions, features\n" +
        "• **Language Comparisons** - Differences and similarities\n" +
        "• **Common Phrases** - Useful expressions in each language\n" +
        "• **Cultural Context** - History and cultural significance\n\n" +
        "Which language would you like to explore? Try: *\"Tell me about Tagalog\"* or *\"What are the features of Bisaya?\"*",

        "Magandang araw! 🌟 I specialize in the 10 major Philippine languages. I can provide:\n\n" +
        "• Complete language profiles with origin and speaker data\n" +
        "• Linguistic features and grammar details\n" +
        "• Regional distribution and cultural notes\n" +
        "• Common phrases and practical vocabulary\n\n" +
        "Ask me about any of these languages: Tagalog, Bisaya, Ilocano, Hiligaynon, Bicolano, Waray, Kapampangan, Pangasinan, Maguindanao, or Tausug!",

        "Maayong adlaw! 🗣️ Welcome to your guide for Philippine languages! I have comprehensive information on:\n\n" +
        "• Language origins and historical development\n" +
        "• Speaker populations and geographic spread\n" +
        "• Writing systems and linguistic features\n" +
        "• Cultural significance and modern usage\n\n" +
        "What would you like to know? Try: *\"How many people speak Ilocano?\"* or *\"Where is Hiligaynon spoken?\"*"
    ];

    return welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
}

function getHelpResponse() {
    return "**How I Can Help You Explore Philippine Languages** 🌏\n\n" +
           "I'm your dedicated assistant for learning about the 10 major languages of the Philippines. Here's what I can do:\n\n" +
           "**📚 Language Information**:\n" +
           "• \"Tell me about [language name]\" - Complete profile\n" +
           "• \"Where is [language] spoken?\" - Geographic distribution\n" +
           "• \"How many speakers does [language] have?\" - Demographic data\n\n" +
           "**🔍 Comparisons & Analysis**:\n" +
           "• \"Compare Tagalog and Bisaya\" - Language differences\n" +
           "• \"What makes [language] unique?\" - Distinct features\n" +
           "• \"Language family of [language]\" - Linguistic classification\n\n" +
           "**💬 Practical Language**:\n" +
           "• \"Common phrases in [language]\" - Useful expressions\n" +
           "• \"How to say [word] in [language]\" - Translation help\n" +
           "• \"Greetings in [language]\" - Cultural communication\n\n" +
           "**🌍 Cultural Context**:\n" +
           "• \"Cultural notes about [language]\" - Traditions and history\n" +
           "• \"Writing system of [language]\" - Scripts and orthography\n\n" +
           "Just ask about any of our 10 languages: Tagalog, Bisaya, Ilocano, Hiligaynon, Bicolano, Waray, Kapampangan, Pangasinan, Maguindanao, or Tausug!";
}

function getDefaultLanguageResponse() {
    const defaultResponses = [
        "I see you're interested in Philippine languages! 🇵🇭 We have incredible linguistic diversity across our islands. I can provide detailed information about any of our 10 major languages including:\n\n• **Complete profiles** with origin, speakers, and regions\n• **Linguistic features** and grammar characteristics\n• **Common phrases** and useful vocabulary\n• **Cultural context** and historical background\n• **Writing systems** and orthography\n\nWhich language would you like to explore? You can ask about Tagalog, Bisaya, Ilocano, Hiligaynon, Bicolano, Waray, Kapampangan, Pangasinan, Maguindanao, or Tausug!",

        "Philippine languages are fascinating! Each of our 10 major languages has unique sounds, grammar, and cultural significance. I can help you discover:\n\n• **Language origins** and where they're spoken today\n• **Speaker populations** and demographic information\n• **Key features** that make each language special\n• **Practical phrases** for communication\n• **Cultural traditions** associated with each language\n\nWhat specific language would you like to learn about? Try asking: *\"Tell me about the features of Bisaya\"* or *\"Where is Ilocano spoken?\"*",

        "Did you know the Philippines is one of the most linguistically diverse countries in Asia? 🗣️ I can provide comprehensive information about any of our 10 major languages including:\n\n- **Geographic distribution** across the archipelago\n- **Historical development** and influences\n- **Linguistic characteristics** and grammar\n- **Cultural significance** and modern usage\n- **Common expressions** and greetings\n\nWhich language piques your interest? I have detailed profiles for Tagalog, Bisaya, Ilocano, Hiligaynon, Bicolano, Waray, Kapampangan, Pangasinan, Maguindanao, and Tausug!"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

/* ===== NAVIGATION FUNCTIONS ===== */
function gologin() {
    console.log("Login navigation clicked");
    window.location.href = "login.html";
}

function goSignup() {
    console.log("Sign Up navigation clicked");
    window.location.href = "signup.html";
}

/* ===== UTILITY FUNCTIONS ===== */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                z-index: 10000;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                justify-content: space-between;
                animation: slideIn 0.3s ease-out;
            }
            .notification.success { background: #38a169; }
            .notification.error { background: #e53e3e; }
            .notification.warning { background: #dd6b20; }
            .notification.info { background: #3182ce; }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                margin-left: 10px;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
}

/* ===== MISSING FUNCTIONS ===== */
function initializeFloatingAIButton() {
    // Implementation for floating AI button
    console.log("Floating AI button initialized");
}

/* ===== FAQ TOGGLE FUNCTIONALITY ===== */
function initializeEnhancedFAQs() {
    console.log('❓ Enhanced FAQs initialized');

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');
        const answer = item.querySelector('.faq-answer');

        if (question && toggle && answer) {
            // Add click event to both the question and the toggle button
            question.addEventListener('click', () => {
                toggleFAQ(item);
            });

            toggle.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering the question click
                toggleFAQ(item);
            });
        }
    });

    // Initialize animations
    initializeAnimations();
}

function toggleFAQ(faqItem) {
    const isActive = faqItem.classList.contains('active');
    const answer = faqItem.querySelector('.faq-answer');
    const toggleIcon = faqItem.querySelector('.faq-toggle i');

    // Close all other FAQs
    document.querySelectorAll('.faq-item.active').forEach(activeItem => {
        if (activeItem !== faqItem) {
            activeItem.classList.remove('active');
            const otherToggleIcon = activeItem.querySelector('.faq-toggle i');
            if (otherToggleIcon) {
                otherToggleIcon.className = 'fas fa-plus';
            }
        }
    });

    // Toggle current FAQ
    if (!isActive) {
        faqItem.classList.add('active');
        if (toggleIcon) {
            toggleIcon.className = 'fas fa-minus';
        }

        // Add smooth height transition
        if (answer) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }

        // Add bounce animation
        faqItem.style.animation = 'none';
        setTimeout(() => {
            faqItem.style.animation = 'bounce 0.6s ease';
        }, 10);

    } else {
        faqItem.classList.remove('active');
        if (toggleIcon) {
            toggleIcon.className = 'fas fa-plus';
        }

        // Reset height
        if (answer) {
            answer.style.maxHeight = '0';
        }
    }
}





/* ===== INITIALIZE APP ===== */
// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeFirebase();
});
/* ===== NAVIGATION FUNCTIONS ===== */
function goBack() {
    console.log("Back button clicked");
    window.history.back();
}

/* ===== BOTTOM NAVIGATION FUNCTIONALITY ===== */
function initializeBottomNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const currentPage = getCurrentPage();

    // Remove active class from all items
    navItems.forEach(item => {
        item.classList.remove('active');

        // Set active class based on current page
        if (item.getAttribute('data-tab') === currentPage) {
            item.classList.add('active');
        }

        // Add click handler for smooth transitions
        item.addEventListener('click', function(e) {
            if (!this.classList.contains('active')) {
                // Add page transition
                document.body.style.opacity = '0.7';
                document.body.style.transition = 'opacity 0.3s ease';

                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));

                // Add active class to clicked item
                this.classList.add('active');

                setTimeout(() => {
                    document.body.style.opacity = '1';
                }, 300);
            }
        });
    });
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('translator.html') || path === '/' || path === '/index.html') {
        return 'translator';
    } else if (path.includes('ai-chat.html')) {
        return 'ai-chat';
    } else if (path.includes('maps.html')) {
        return 'maps';
    }
    return 'translator'; // default
}

// Update initializeTranslator function to include bottom nav
function initializeTranslator() {

const speakBtn = document.getElementById('speakBtn');
  if (speakBtn && voiceTranslator) {
    speakBtn.addEventListener('click', (e) => {
      e.preventDefault();
      voiceTranslator.speakTranslation();
    });
  }
    // Initialize voice translator
    voiceTranslator = new EnhancedVoiceTranslator();

    // Initialize menu
    initializeMenu();

    // Initialize floating AI button
    initializeFloatingAIButton();

    // Initialize bottom navigation
    initializeBottomNavigation();

    // Initialize animations
    initializeAnimations();

    // Auto-translate functionality
    const inputBox = document.getElementById("inputText");
    const outputBox = document.getElementById("outputText");
    const fromSelect = document.getElementById("inputLang");
    const toSelect = document.getElementById("outputLang");

    if (inputBox && outputBox) {
        let translateTimeout;

        inputBox.addEventListener("input", () => {
              // Convert input to lowercase
              inputBox.value = inputBox.value.toLowerCase();
            clearTimeout(translateTimeout);
            translateTimeout = setTimeout(() => {
                autoTranslate();
            }, 500);
        });

        // Auto-translate when language changes
        fromSelect.addEventListener("change", autoTranslate);
        toSelect.addEventListener("change", autoTranslate);
    }

    // Add copy functionality
    const copyBtn = document.querySelector('.icon-btn .fa-copy')?.closest('.icon-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyTranslation);
    }

    // Add clear functionality
    const clearBtn = document.querySelector('.icon-btn .fa-eraser')?.closest('.icon-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearText);
    }
}

// Update initializeAIChat function to include bottom nav
function initializeAIChat() {
    console.log('🤖 AI Chat initialized');

    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    const questionChips = document.querySelectorAll('.question-chip');

    // Initialize bottom navigation
    initializeBottomNavigation();

    // Initialize animations
    initializeAnimations();

    // Show welcome message when chat loads
    if (chatMessages && chatMessages.children.length === 0) {
        setTimeout(() => {
            addMessageToChat(
                "🇵🇭 <strong>Kumusta!</strong> I'm your Philippine Languages Expert. I can help you explore:\n\n" +
                "• <strong>10 Major Languages</strong> - Tagalog, Bisaya, Ilocano & more\n" +
                "• <strong>Language Features</strong> - Grammar, pronunciation, vocabulary\n" +
                "• <strong>Regional Distribution</strong> - Where each language is spoken\n" +
                "• <strong>Common Phrases</strong> - Greetings and essential expressions\n" +
                "• <strong>Cultural Context</strong> - History and cultural significance\n\n" +
                "Which of our 10 languages would you like to discover today? 🌟",
                'ai'
            );
        }, 300);
    }

    // Question chips event listeners - FIXED VERSION
    questionChips.forEach(chip => {
        chip.addEventListener('click', async function() {
            if (this.disabled) return;

            const prompt = this.getAttribute('data-prompt');

            // Add user message to chat
            addMessageToChat(prompt, 'user');

            // Show typing indicator
            showTypingIndicator();

            // Disable all question chips and send button while processing
            questionChips.forEach(c => {
                c.disabled = true;
                c.classList.add('loading');
            });
            if (sendButton) sendButton.disabled = true;

            try {
                // Get AI response
                const aiResponse = await getAIResponse(prompt);
                removeTypingIndicator();
                addMessageToChat(aiResponse, 'ai');
            } catch (error) {
                removeTypingIndicator();
                addMessageToChat("Sorry, I'm having trouble responding right now. Please try again later.", 'ai');
                console.error("AI Chat error:", error);
            } finally {
                // Re-enable controls
                questionChips.forEach(c => {
                    c.disabled = false;
                    c.classList.remove('loading');
                });
                if (sendButton) sendButton.disabled = false;
            }
        });
    });

    // Auto-resize textarea
    if (chatInput) {
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        });

        // Send message on Enter (but allow Shift+Enter for new line)
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Send button click
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    // Send message function
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessageToChat(message, 'user');
        chatInput.value = '';
        chatInput.style.height = 'auto';

        // Show typing indicator
        showTypingIndicator();

        // Disable send button while processing
        sendButton.disabled = true;

        try {
            // Get AI response
            const aiResponse = await getAIResponse(message);
            removeTypingIndicator();
            addMessageToChat(aiResponse, 'ai');
        } catch (error) {
            removeTypingIndicator();
            addMessageToChat("Sorry, I'm having trouble responding right now. Please try again later.", 'ai');
            console.error("AI Chat error:", error);
        } finally {
            sendButton.disabled = false;
            chatInput.focus();
        }
    }
}

/* ===== SIMPLE MAPS FUNCTIONALITY ===== */
let map;
let userMarker;
let userCircle;

function initializeMaps() {
    console.log('🗺️ Maps page initialized');

    // Initialize map
    initializeMap();

    // Initialize map controls
    initializeMapControls();

    // Initialize bottom navigation
    initializeBottomNavigation();

    // Initialize animations
    initializeAnimations();

    // Get user location
    getUserLocation();
}

function initializeMap() {
    // Default to Philippines center
    const phCenter = [14.5995, 120.9842]; // Manila center

    // Create map
    map = L.map('map').setView(phCenter, 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© CartoDB',
        maxZoom: 18
    }).addTo(map);
}

function initializeMapControls() {
    const locateBtn = document.getElementById('locateBtn');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');

    if (locateBtn) {
        locateBtn.addEventListener('click', () => {
            getUserLocation();
        });
    }

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            map.zoomIn();
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            map.zoomOut();
        });
    }
}

function getUserLocation() {
    if (!navigator.geolocation) {
        showNotification('Geolocation is not supported by your browser', 'error');
        updateLocationStatus('Geolocation not supported', 'error');
        return;
    }

    updateLocationStatus('Getting your location...', 'info');

    // THIS CALL TRIGGERS THE NATIVE PERMISSION POP-UP VIA WebChromeClient
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            // Update user location on map
            updateUserLocation(lat, lon, accuracy);

            // Update location info with address
            updateLocationInfo(lat, lon);

            showNotification('📍 Your location found!', 'success');

        },
        (error) => {
            console.error('Geolocation error:', error);
            let errorMessage = 'Unable to get your location';

            switch(error.code) {
                case error.PERMISSION_DENIED:
                    // This catches denial from the native Android pop-up
                    errorMessage = 'Location access denied. Please enable location permissions in your app settings.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out.';
                    break;
            }

            showNotification(errorMessage, 'error');
            updateLocationStatus(errorMessage, 'error');
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000
        }
    );
}

function updateUserLocation(lat, lon, accuracy) {
    // Remove existing user marker and circle
    if (userMarker) {
        map.removeLayer(userMarker);
    }
    if (userCircle) {
        map.removeLayer(userCircle);
    }

    // Create green circle for user location
    userCircle = L.circle([lat, lon], {
        color: '#4CAF50',
        fillColor: '#4CAF50',
        fillOpacity: 0.2,
        radius: accuracy
    }).addTo(map);

    // Create user marker in the center
    userMarker = L.marker([lat, lon], {
        icon: L.divIcon({
            className: 'user-location-circle',
            html: '<div style="background: #4CAF50; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        })
    }).addTo(map)
    .bindPopup(`
        <div style="text-align: center; min-width: 200px; font-family: Poppins, sans-serif;">
            <div style="font-weight: bold; color: #4CAF50; margin-bottom: 8px; font-size: 16px;">You are here</div>
            <div style="font-size: 13px; color: #666; line-height: 1.4;">
                Accuracy: ${Math.round(accuracy)} meters<br>
                Coordinates: ${lat.toFixed(6)}, ${lon.toFixed(6)}
            </div>
        </div>
    `);

    // Center map on user location
    map.setView([lat, lon], 16);
}

async function updateLocationInfo(lat, lon) {
    const coordinatesElement = document.getElementById('coordinates');
    const addressElement = document.getElementById('area'); // Using the same element but for address
    const statusElement = document.getElementById('locationStatus');

    if (coordinatesElement) {
        coordinatesElement.textContent = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    }

    if (addressElement) {
        addressElement.textContent = 'Getting address...';
        addressElement.style.color = '#3182ce';

        // Get full address from coordinates
        const fullAddress = await getFullAddress(lat, lon);
        addressElement.textContent = fullAddress;
        addressElement.style.color = '#4CAF50';
    }

    if (statusElement) {
        statusElement.textContent = 'Location found';
        statusElement.style.color = '#4CAF50';
    }
}

async function getFullAddress(lat, lon) {
    const NOMINATIM_URL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
    const TIMEOUT_MS = 10000; // Set timeout to 10 seconds

    // Use AbortController to implement a timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch(NOMINATIM_URL, {
            signal: controller.signal // Apply the timeout signal
        });

        // Clear the timeout to prevent it from firing after a successful response
        clearTimeout(timeoutId);

        // Check for HTTP errors (like 403 Forbidden or 429 Too Many Requests)
        if (!response.ok) {
            // A 429 error often means rate limit, a 403 means denied
            console.error(`HTTP error fetching address: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.address) {
            const address = data.address;

            // Priority 1: City/Town/Village/Municipality (e.g., "Quezon City")
            const area = address.city || address.town || address.village || address.municipality;
            if (area) {
                // Combine the main area with the state (e.g., "Quezon City, Metro Manila")
                return area + (address.state ? `, ${address.state}` : '');
            }

            // Priority 2: Full Display Name (fallback if city info is missing)
            if (data.display_name) {
                return data.display_name;
            }

            return 'Address information incomplete';

        } else if (data && data.error) {
            return `API Error: ${data.error}`;
        }

        return 'Address not available';

    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            console.error('Reverse geocoding timed out after 10 seconds.');
            return 'Address lookup timed out (Network slow)';
        }

        console.error('Reverse geocoding error:', error);
        // User sees this on a network failure or unexpected API error
        return 'Unable to get address (Try reloading)';
    }
}

function updateLocationStatus(message, type = 'info') {
    const statusElement = document.getElementById('locationStatus');
    if (statusElement) {
        statusElement.textContent = message;

        switch(type) {
            case 'error':
                statusElement.style.color = '#e53e3e';
                break;
            case 'success':
                statusElement.style.color = '#4CAF50';
                break;
            default:
                statusElement.style.color = '#3182ce';
        }
    }
}

