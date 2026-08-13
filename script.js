/* ================= MOBILE NAV TOGGLE ================= */
function toggleMobileNav() {
  var menu = document.getElementById("mobileNavMenu");
  var icon = document.getElementById("navIcon");

  if (menu) {
    if (menu.classList.contains("show")) {
      menu.classList.remove("show");
      if (icon) icon.innerHTML = "☰";
    } else {
      menu.classList.add("show");
      if (icon) icon.innerHTML = "✕";
    }
  }
}

/* ================= TAB SCROLL & SWITCHING ================= */
function scrollTabs(direction) {
  const container = document.getElementById('yearTabsContainer');
  if (container) {
    container.scrollBy({ left: container.clientWidth * direction, behavior: 'smooth' });
  }
}

function openMenu(evt, tabName) {
  var i, x = document.getElementsByClassName("year-content");
  for (i = 0; i < x.length; i++) { 
    x[i].style.display = "none"; 
  }
  
  var tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) { 
    tablinks[i].className = tablinks[i].className.replace(" y-pink y-text-white", ""); 
  }
  
  var targetTab = document.getElementById(tabName);
  if (targetTab) {
    targetTab.style.display = "block";  
  }
  if (evt && evt.currentTarget) {
    evt.currentTarget.className += " y-pink y-text-white";
  }
}

/* Safely click default tab ONLY if it exists on the page */
document.addEventListener("DOMContentLoaded", function() {
  var defaultTab = document.getElementById("defaultTab");
  if (defaultTab) {
    defaultTab.click();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slides .slide');
  const dotsContainer = document.getElementById('heroDots');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');

  if (!slides.length) return;

  let currentIndex = 0;
  let isAnimating = false;
  let autoSlideTimer = null;
  const intervalTime = 10000; // 10 seconds

  // =================================================================
  // DYNAMIC DOT GENERATION
  // =================================================================
  function createDots() {
    if (!dotsContainer) return;
    
    // Clear out any existing dots
    dotsContainer.innerHTML = '';

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active'); // First dot starts active
      dot.setAttribute('data-index', index);
      dot.setAttribute('aria-label', `Slide ${index + 1}`);

      // FontAwesome dot icons
      dot.innerHTML = `
        <i class="fa-solid fa-circle icon-solid"></i>
        <i class="fa-regular fa-circle icon-regular"></i>
      `;

      // Click listener for each generated dot
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
        const direction = targetIndex > currentIndex ? 'next' : 'prev';
        goToSlide(targetIndex, direction);
      });

      dotsContainer.appendChild(dot);
    });
  }

  // Generate the dots based on slide count
  createDots();

  // Helper function to fetch generated dot nodes
  function getDots() {
    return dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
  }

  // =================================================================
  // SLIDER TRANSITION LOGIC
  // =================================================================
  function goToSlide(newIndex, direction = 'next') {
    if (isAnimating || newIndex === currentIndex) return;
    isAnimating = true;

    const currentSlide = slides[currentIndex];
    const incomingSlide = slides[newIndex];
    const dots = getDots();

    const enterClass = direction === 'next' ? 'slide-next-enter' : 'slide-prev-enter';
    const leaveClass = direction === 'next' ? 'slide-next-leave' : 'slide-prev-leave';

    // Update active dot styling
    if (dots[currentIndex]) dots[currentIndex].classList.remove('active');
    if (dots[newIndex]) dots[newIndex].classList.add('active');

    // Prepare incoming slide start position
    incomingSlide.style.transition = 'none';
    incomingSlide.classList.add(enterClass);

    // Force repaint
    incomingSlide.offsetHeight;

    // Trigger sliding animation
    incomingSlide.style.transition = '';
    currentSlide.classList.add(leaveClass);
    currentSlide.classList.remove('active');

    incomingSlide.classList.remove(enterClass);
    incomingSlide.classList.add('active');

    // Cleanup transition classes after 600ms animation ends
    setTimeout(() => {
      currentSlide.classList.remove(leaveClass);
      currentIndex = newIndex;
      isAnimating = false;
    }, 600);

    startAutoSlide();
  }

  function nextSlide() {
    const target = (currentIndex + 1) % slides.length;
    goToSlide(target, 'next');
  }

  function prevSlide() {
    const target = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(target, 'prev');
  }

  function startAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(nextSlide, intervalTime);
  }

  // Arrow Event Listeners
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); nextSlide(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); prevSlide(); });

  // Start 10-second timer
  startAutoSlide();
});