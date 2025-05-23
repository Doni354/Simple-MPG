// Function to load HTML components
async function loadComponent(elementId, componentPath) {
  try {
    const response = await fetch(componentPath)
    if (!response.ok) {
      throw new Error(`Failed to load component: ${componentPath}`)
    }
    const html = await response.text()
    document.getElementById(elementId).innerHTML = html

    // If this is the header, initialize the mobile menu and auth
    if (elementId === "header") {
      initMobileMenu()
      initHeaderAuth()
    }
  } catch (error) {
    console.error(error)
  }
}

// Function to initialize header auth
async function initHeaderAuth() {
  try {
    const { initAuth } = await import("/js/auth.js")
    initAuth()
  } catch (error) {
    console.error("Error initializing auth:", error)
  }
}

// Function to initialize mobile menu
function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle")
  const mobileSidebar = document.getElementById("mobileSidebar")
  const sidebarOverlay = document.getElementById("sidebarOverlay")
  const sidebarClose = document.getElementById("sidebarClose")

  if (menuToggle && mobileSidebar) {
    // Open sidebar
    menuToggle.addEventListener("click", () => {
      mobileSidebar.classList.add("active")
      menuToggle.classList.add("active")
      document.body.style.overflow = "hidden"
    })

    // Close sidebar when close button is clicked
    if (sidebarClose) {
      sidebarClose.addEventListener("click", closeSidebar)
    }

    // Close sidebar when overlay is clicked
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener("click", closeSidebar)
    }

    // Close sidebar when a nav link is clicked
    const sidebarLinks = mobileSidebar.querySelectorAll(".sidebar-link")
    sidebarLinks.forEach((link) => {
      link.addEventListener("click", closeSidebar)
    })

    function closeSidebar() {
      mobileSidebar.classList.remove("active")
      menuToggle.classList.remove("active")
      document.body.style.overflow = "auto"
    }
  }
}

// Load all components when the page loads
document.addEventListener("DOMContentLoaded", () => {
  // Load header and footer on all pages
  loadComponent("header", "/components/header.html")
  loadComponent("footer", "/components/footer.html")
})
