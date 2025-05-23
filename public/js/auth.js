// Firebase Auth configuration and functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js"
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3cKwDuQQa51jEEsD7Sozkw0I14RJyp-o",
  authDomain: "simplempg-6c08f.firebaseapp.com",
  projectId: "simplempg-6c08f",
  storageBucket: "simplempg-6c08f.firebasestorage.app",
  messagingSenderId: "209428104937",
  appId: "1:209428104937:web:f39d3cc32c63242819d278",
  measurementId: "G-FWLG7WWCW8",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const provider = new GoogleAuthProvider()

// Current user state
let currentUser = null

// Initialize auth state listener
export function initAuth() {
  onAuthStateChanged(auth, async (user) => {
    currentUser = user
    updateAuthUI(user)

    if (user) {
      // Create or update user document in Firestore
      await createUserDocument(user)
    }
  })
}

// Sign in with Google
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    console.log("User signed in:", user.displayName)
    return user
  } catch (error) {
    console.error("Error signing in:", error)
    alert("Error signing in: " + error.message)
    return null
  }
}

// Sign out
export async function signOutUser() {
  try {
    await signOut(auth)
    console.log("User signed out")
  } catch (error) {
    console.error("Error signing out:", error)
  }
}

// Create user document in Firestore
async function createUserDocument(user) {
  const userRef = doc(db, "users", user.uid)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    // Create new user document
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date(),
      stats: {
        totalGames: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        pvpGames: 0,
        pvcGames: 0,
        onlineGames: 0,
      },
    })
  }
}

// Update user statistics
export async function updateUserStats(gameType, result) {
  if (!currentUser) return

  const userRef = doc(db, "users", currentUser.uid)
  const updates = {
    "stats.totalGames": increment(1),
  }

  // Update game type specific stats
  if (gameType === "pvp") {
    updates["stats.pvpGames"] = increment(1)
  } else if (gameType === "pvc") {
    updates["stats.pvcGames"] = increment(1)
  } else if (gameType === "online") {
    updates["stats.onlineGames"] = increment(1)
  }

  // Update result specific stats
  if (result === "win") {
    updates["stats.wins"] = increment(1)
  } else if (result === "loss") {
    updates["stats.losses"] = increment(1)
  } else if (result === "draw") {
    updates["stats.draws"] = increment(1)
  }

  try {
    await updateDoc(userRef, updates)
  } catch (error) {
    console.error("Error updating user stats:", error)
  }
}

// Get user statistics
export async function getUserStats() {
  if (!currentUser) return null

  const userRef = doc(db, "users", currentUser.uid)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    return userSnap.data().stats
  }
  return null
}

// Update auth UI
function updateAuthUI(user) {
  // Desktop auth elements
  const authButton = document.getElementById("authButton")
  const userInfo = document.getElementById("userInfo")
  const userAvatar = document.getElementById("userAvatar")
  const userName = document.getElementById("userName")

  // Mobile sidebar auth elements
  const sidebarAuthButton = document.getElementById("sidebarAuthButton")
  const sidebarUserInfo = document.getElementById("sidebarUserInfo")
  const sidebarUserAvatar = document.getElementById("sidebarUserAvatar")
  const sidebarUserName = document.getElementById("sidebarUserName")
  const sidebarUserEmail = document.getElementById("sidebarUserEmail")
  const profileSidebarLink = document.getElementById("profileSidebarLink")

  if (user) {
    // User is signed in - Desktop
    if (authButton) {
      authButton.textContent = "Sign Out"
      authButton.onclick = signOutUser
    }

    if (userInfo) {
      userInfo.style.display = "flex"
    }

    if (userAvatar) {
      userAvatar.src = user.photoURL || "/placeholder.svg?height=40&width=40"
    }

    if (userName) {
      userName.textContent = user.displayName || "User"
    }

    // User is signed in - Mobile Sidebar
    if (sidebarAuthButton) {
      sidebarAuthButton.innerHTML = '<span class="auth-icon">🚪</span><span>Sign Out</span>'
      sidebarAuthButton.onclick = signOutUser
    }

    if (sidebarUserInfo) {
      sidebarUserInfo.style.display = "flex"
    }

    if (sidebarUserAvatar) {
      sidebarUserAvatar.src = user.photoURL || "/placeholder.svg?height=50&width=50"
    }

    if (sidebarUserName) {
      sidebarUserName.textContent = user.displayName || "User"
    }

    if (sidebarUserEmail) {
      sidebarUserEmail.textContent = user.email || ""
    }

    if (profileSidebarLink) {
      profileSidebarLink.style.display = "flex"
    }
  } else {
    // User is signed out - Desktop
    if (authButton) {
      authButton.innerHTML = '<span class="auth-icon">🔐</span><span>Sign In with Google</span>'
      authButton.onclick = signInWithGoogle
    }

    if (userInfo) {
      userInfo.style.display = "none"
    }

    // User is signed out - Mobile Sidebar
    if (sidebarAuthButton) {
      sidebarAuthButton.innerHTML = '<span class="auth-icon">🔐</span><span>Sign In with Google</span>'
      sidebarAuthButton.onclick = signInWithGoogle
    }

    if (sidebarUserInfo) {
      sidebarUserInfo.style.display = "none"
    }

    if (profileSidebarLink) {
      profileSidebarLink.style.display = "none"
    }
  }
}

// Get current user
export function getCurrentUser() {
  return currentUser
}

// Export auth and db for use in other files
export { auth, db }
