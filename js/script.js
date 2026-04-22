/* ============================================
   RHYTHM PAUDEL — PORTFOLIO
   Interactive Controller
   ============================================ */

(function () {
  'use strict';

  // --- State ---
  let currentSection = 0;
  const totalSections = 6;
  const MOBILE_BREAKPOINT = 1100;
  let isTransitioning = false;
  let isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

  // DOM
  const portfolio = document.getElementById('portfolio');
  const navDots = document.querySelectorAll('.nav-dot');
  const sectionCounter = document.getElementById('sectionCounter');
  const progressBar = document.getElementById('progressBar');
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('[data-section]') : [];
  const topBar = document.getElementById('topBar');
  const heroProfile = document.getElementById('heroProfile');

  // --- Horizontal Scroll (Desktop) ---
  function scrollToMobileSection(index, instant) {
    const sections = portfolio.querySelectorAll('.section');
    const section = sections[index];
    if (!section) return;

    const topBarHeight = topBar ? topBar.offsetHeight : 0;
    const targetY = section.offsetTop - topBarHeight - 12;
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: instant ? 'auto' : 'smooth'
    });
  }

  function goToSection(index, instant) {
    if (index < 0 || index >= totalSections) return;
    if (isTransitioning && !instant) return;

    isTransitioning = true;
    currentSection = index;

    if (!isMobile) {
      const offset = -index * 100;
      portfolio.style.transform = `translateX(${offset}vw)`;
    } else {
      scrollToMobileSection(index, instant);
    }

    updateNav();
    revealSectionContent(index);

    setTimeout(() => {
      isTransitioning = false;
    }, instant ? 50 : 950);
  }

  function updateNav() {
    // Dots
    navDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSection);
    });

    // Counter
    if (sectionCounter) {
      const num = String(currentSection + 1).padStart(2, '0');
      sectionCounter.querySelector('.current').textContent = num;
    }

    // Progress bar
    if (progressBar) {
      const pct = ((currentSection + 1) / totalSections) * 100;
      progressBar.style.width = pct + '%';
    }
  }

  // --- Scroll Hijack (desktop) ---
  let scrollAccumulator = 0;
  const scrollThreshold = 60;

  function shouldAllowSectionScroll(deltaY) {
    const sections = portfolio ? portfolio.querySelectorAll('.section') : [];
    const activeSection = sections[currentSection];
    if (!activeSection) return false;

    const isScrollable = activeSection.scrollHeight > activeSection.clientHeight + 1;
    if (!isScrollable) return false;

    const atTop = activeSection.scrollTop <= 1;
    const atBottom = activeSection.scrollTop + activeSection.clientHeight >= activeSection.scrollHeight - 1;

    if (deltaY > 0 && !atBottom) return true;
    if (deltaY < 0 && !atTop) return true;

    return false;
  }

  function handleWheel(e) {
    if (isMobile) return;
    if (shouldAllowSectionScroll(e.deltaY)) {
      return;
    }
    e.preventDefault();

    scrollAccumulator += e.deltaY;

    if (Math.abs(scrollAccumulator) >= scrollThreshold) {
      if (scrollAccumulator > 0) {
        goToSection(currentSection + 1);
      } else {
        goToSection(currentSection - 1);
      }
      scrollAccumulator = 0;
    }

    // Decay accumulator
    clearTimeout(handleWheel._timeout);
    handleWheel._timeout = setTimeout(() => {
      scrollAccumulator = 0;
    }, 200);
  }

  // --- Touch swipe (desktop horizontal mode) ---
  let touchStartX = 0;
  let touchStartY = 0;

  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    if (isMobile) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) {
        goToSection(currentSection + 1);
      } else {
        goToSection(currentSection - 1);
      }
    }
  }

  // --- Keyboard Nav ---
  function handleKeydown(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      goToSection(currentSection + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      goToSection(currentSection - 1);
    }
  }

  // --- Nav Dot Clicks ---
  navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.section, 10);
      goToSection(idx);
    });
  });

  // --- Mobile Nav ---
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const idx = parseInt(link.dataset.section, 10);
      e.stopPropagation();
      menuToggle.classList.remove('open');
      mobileNav.classList.remove('open');
      if (!Number.isNaN(idx)) {
        goToSection(idx);
      }
    });
  });


  // --- Cursor Follower (desktop) ---
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;
  let aimX = 0, aimY = 0;

  function updateCursor() {
    if (isMobile) return;

    // Smooth follow for outer ring
    cursorX += (aimX - cursorX) * 0.12;
    cursorY += (aimY - cursorY) * 0.12;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    // Dot follows more closely
    dotX += (aimX - dotX) * 0.25;
    dotY += (aimY - dotY) * 0.25;
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';

    requestAnimationFrame(updateCursor);
  }

  document.addEventListener('mousemove', (e) => {
    aimX = e.clientX;
    aimY = e.clientY;
  });

  // Magnetic hover effect
  const magneticElements = 'a, button, .project-card, .skill-chip, .contact-link, .nav-dot';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(magneticElements)) {
      cursor.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(magneticElements)) {
      cursor.classList.remove('hovering');
    }
  });


  // --- Card Tilt Effect ---
  function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        if (isMobile) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      });
    });
  }


  // --- Section Content Reveal ---
  const revealedSections = new Set();

  function revealSectionContent(index) {
    if (revealedSections.has(index)) return;
    revealedSections.add(index);

    const sections = portfolio.querySelectorAll('.section');
    const section = sections[index];
    if (!section) return;

    // Hero reveals
    if (index === 0) {
      const lineInners = section.querySelectorAll('.line-inner');
      lineInners.forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), 200 + i * 150);
      });
      if (heroProfile) {
        setTimeout(() => heroProfile.classList.add('revealed'), 600);
      }
    }

    // Timeline items
    const timelineItems = section.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, i) => {
      setTimeout(() => item.classList.add('revealed'), 200 + i * 150);
    });

    // Project cards
    const projectCards = section.querySelectorAll('.project-card');
    projectCards.forEach((card, i) => {
      setTimeout(() => card.classList.add('revealed'), 200 + i * 120);
    });

    // Skill groups
    const skillGroups = section.querySelectorAll('.skill-group');
    skillGroups.forEach((group, i) => {
      setTimeout(() => group.classList.add('revealed'), 200 + i * 120);
    });

    // Certification cards
    const certCards = section.querySelectorAll('.cert-card');
    certCards.forEach((card, i) => {
      setTimeout(() => card.classList.add('revealed'), 200 + i * 80);
    });
  }


  // --- Mobile Scroll Detection ---
  function handleMobileScroll() {
    if (!isMobile) return;
    const sections = portfolio.querySelectorAll('.section');
    const scrollTop = window.scrollY + window.innerHeight / 2;

    sections.forEach((section, i) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollTop >= top && scrollTop < bottom) {
        if (currentSection !== i) {
          currentSection = i;
          updateNav();
          revealSectionContent(i);
        }
      }
    });
  }


  // --- Resize Handler ---
  function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    if (wasMobile !== isMobile) {
      if (!isMobile) {
        // Switching to desktop
        portfolio.style.transform = `translateX(${-currentSection * 100}vw)`;
      } else {
        // Switching to mobile
        portfolio.style.transform = 'none';
      }
    }
  }


  // --- Skill Chip Click Animation ---
  function initSkillChipEffects() {
    const chips = document.querySelectorAll('.skill-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chip.style.transform = 'scale(0.92)';
        setTimeout(() => {
          chip.style.transform = '';
        }, 150);
      });
    });
  }


  // --- Init ---
  function init() {
    // Attach listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleMobileScroll, { passive: true });

    // Start cursor animation
    if (!isMobile) {
      requestAnimationFrame(updateCursor);
    }

    // Initial state
    goToSection(0, true);
    initTiltEffect();
    initSkillChipEffects();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();