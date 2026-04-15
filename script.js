/**
 * Om Vitole Portfolio — script.js
 * Features: sticky navbar, hamburger menu, scroll reveal,
 *           skill bar animation, active nav highlight
 */

/* ============================================================
   1. NAVBAR — scroll class + hamburger toggle
   ============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Add .scrolled class on scroll for compact look
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  highlightActiveNav();
});

// Toggle mobile menu
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ============================================================
   2. ACTIVE NAV HIGHLIGHT — highlight section in viewport
   ============================================================ */
function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 120; // offset for navbar height

  let currentSection = '';

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollY >= top && scrollY < top + height) {
      currentSection = section.id;
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === currentSection) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   3. SCROLL REVEAL — fade + slide elements into view
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger skill bar fill when skill cards become visible
        if (entry.target.classList.contains('skill-card')) {
          const fill = entry.target.querySelector('.skill-fill');
          if (fill && fill.dataset.width) {
            // Small delay to let the card animation play first
            setTimeout(() => {
              fill.style.width = fill.dataset.width + '%';
            }, 300);
          }
        }

        // Unobserve after animating (one-time reveal)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold:   0.12,  // trigger when 12% of element is visible
    rootMargin: '0px 0px -60px 0px'
  }
);

// Observe all reveal elements
document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ============================================================
   4. SMOOTH SCROLL — native + fallback for older browsers
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const navbarHeight = navbar.offsetHeight;
    const targetTop    = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

/* ============================================================
   5. HERO PARALLAX — subtle depth on mouse move
   ============================================================ */
const hero = document.querySelector('.hero');
if (hero) {
  document.addEventListener('mousemove', (e) => {
    // Only apply on desktop
    if (window.innerWidth < 768) return;

    const x = (e.clientX / window.innerWidth  - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    const orbs = hero.querySelectorAll('.orb');
    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 0.4;
      orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });
}

/* ============================================================
   6. COUNTER ANIMATION — animate stat numbers in hero
   ============================================================ */
function animateCounter(el, end, duration = 1800, decimals = 0) {
  const start     = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = start + (end - start) * eased;

    el.textContent = decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value);

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// Observe stat numbers and animate when visible
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl = entry.target;
        const text  = numEl.textContent.trim();
        const value = parseFloat(text);
        const dec   = text.includes('.') ? 1 : 0;

        animateCounter(numEl, value, 1600, dec);
        statObserver.unobserve(numEl);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-num').forEach(el => {
  statObserver.observe(el);
});

/* ============================================================
   7. PROJECT CARD TILT — subtle 3D tilt on hover
   ============================================================ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;

    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const tiltX  = ((y - cy) / cy) * -5;  // max 5°
    const tiltY  = ((x - cx) / cx) *  5;

    card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ============================================================
   8. TYPING EFFECT — optional typewriter on hero tagline
   ============================================================ */
function typeWriter(el, text, speed = 45) {
  el.textContent = '';
  let i = 0;

  // Add opening quote
  const full = text;

  function type() {
    if (i < full.length) {
      el.textContent += full[i];
      i++;
      setTimeout(type, speed);
    }
  }

  // Delay so the hero reveal animation plays first
  setTimeout(type, 1200);
}

const taglineEl = document.querySelector('.hero-tagline');
if (taglineEl) {
  const originalText = taglineEl.textContent.trim();
  // Run on load only when hero is visible
  window.addEventListener('load', () => {
    typeWriter(taglineEl, originalText);
  });
}

/* ============================================================
   9. NAVBAR — initial highlight on page load
   ============================================================ */
window.addEventListener('load', () => {
  highlightActiveNav();
});

/* ============================================================
   10. ABOUT PORTRAIT
   (static image in HTML — no upload)
   ============================================================ */