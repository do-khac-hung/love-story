/* ============================================================
   Naomi Love Blog — JavaScript
   Interactions, animations, scroll effects
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===================== HEADER SCROLL =====================
  const header = document.getElementById('siteHeader');
  const readingProgress = document.getElementById('readingProgress');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;

    // Header shadow on scroll
    if (header) {
      header.classList.toggle('scrolled', scrollY > 20);
    }

    // Reading progress bar
    if (readingProgress) {
      readingProgress.style.width = docH > 0 ? `${(scrollY / docH) * 100}%` : '0%';
    }

    // Back to top button
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 400);
    }

    // Trigger scroll animations
    animateOnScroll();
  });

  // ===================== BACK TO TOP =====================
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===================== HAMBURGER MENU =====================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });

    // Close mobile nav on outside click
    document.addEventListener('click', (e) => {
      if (!hamburgerBtn.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
      }
    });
  }

  // ===================== HERO PARALLAX =====================
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.3}px)`;
    }, { passive: true });
  }

  // ===================== HERO SLIDER =====================
  const sliderDots = document.querySelectorAll('.slider-dot');
  const heroTitles = [
    {
      title: 'Lần Đầu Nắm Tay —<br><em>Một Buổi Chiều Ở Bắc Ninh</em>',
      excerpt: '8 giờ sáng, anh đến đón em. Chuyến đi ấy là 1 hôm thời tiết mát mẻ, có tiếng cười, và có một khoảnh khắc anh nhẹ nhàng chìa tay ra — em đã đặt tay vào...',
      category: 'Khoảnh Khắc',
      date: '31 tháng 8, 2026',
      link: 'post-2.html'
    },
    {
      title: 'Ngày hẹn hò bão táp —<br><em>& Cơn Mưa Hà Nội</em>',
      excerpt: 'Hà Nội bất ngờ đổ mưa. Anh dắt xe, đợi gần một tiếng mới đến chỗ em. Kế hoạch thay đổi — nhưng tối hôm đó lại là tối đẹp nhất...',
      category: 'Hẹn Hò',
      date: '28 tháng 8, 2026',
      link: 'post-1.html'
    }
  ];

  let currentSlide = 0;
  const heroTitle = document.querySelector('.hero-title');
  const heroExcerpt = document.querySelector('.hero-excerpt');
  const heroCategory = document.querySelector('.hero-category');
  const heroDate = document.querySelector('.hero-meta span:nth-child(3)');
  const heroReadBtn = document.getElementById('heroReadBtn');

  function switchSlide(idx) {
    if (!heroTitle) return;
    currentSlide = idx;

    // Fade out
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(10px)';
    if (heroExcerpt) { heroExcerpt.style.opacity = '0'; }

    setTimeout(() => {
      const slide = heroTitles[idx];
      heroTitle.innerHTML = slide.title;
      if (heroExcerpt) heroExcerpt.textContent = slide.excerpt;
      if (heroDate) heroDate.textContent = slide.date;
      if (heroReadBtn) heroReadBtn.href = slide.link;

      // Fade in
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
      if (heroExcerpt) { heroExcerpt.style.opacity = '1'; }
    }, 300);

    // Update dots
    sliderDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
  }

  sliderDots.forEach((dot, i) => {
    dot.addEventListener('click', () => switchSlide(i));
  });

  // Auto-slide every 6s
  if (sliderDots.length > 0) {
    setInterval(() => {
      switchSlide((currentSlide + 1) % heroTitles.length);
    }, 6000);
  }

  // Hero title transition styles
  if (heroTitle) {
    heroTitle.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  }
  if (heroExcerpt) {
    heroExcerpt.style.transition = 'opacity 0.3s ease';
  }

  // ===================== SCROLL ANIMATIONS =====================
  function animateOnScroll() {
    // Fade-in elements
    document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        el.classList.add('visible');
      }
    });

    // Timeline items
    document.querySelectorAll('.timeline-item:not(.visible)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        el.classList.add('visible');
      }
    });
  }

  // Trigger once on load
  setTimeout(animateOnScroll, 100);

  // ===================== DAY COUNTER =====================
  const dayCounter = document.getElementById('dayCounter');
  if (dayCounter) {
    // Start date: August 15, 2026 (first date)
    const startDate = new Date('2026-08-15');
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Animated count up
    let count = 0;
    const target = diffDays;
    const duration = 1500;
    const step = target / (duration / 16);

    function updateCount() {
      count = Math.min(count + step, target);
      dayCounter.textContent = Math.floor(count);
      if (count < target) {
        requestAnimationFrame(updateCount);
      }
    }

    // Start counter when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCount();
          observer.disconnect();
        }
      });
    });

    observer.observe(dayCounter);
  }

  // ===================== LOVE SYSTEM (Home page) =====================
  window.toggleLove = function (btnId, countId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    const heart = btn.querySelector('.heart');
    const countEl = document.getElementById(countId);
    const storageKey = `love_${btnId}`;

    const isLoved = localStorage.getItem(storageKey) === 'true';

    if (isLoved) {
      localStorage.removeItem(storageKey);
      heart.textContent = '🤍';
      btn.classList.remove('active');
      if (countEl) countEl.textContent = parseInt(countEl.textContent) - 1;
    } else {
      localStorage.setItem(storageKey, 'true');
      heart.textContent = '❤️';
      btn.classList.add('active');
      if (countEl) countEl.textContent = parseInt(countEl.textContent) + 1;
    }
  };

  // Also handle inline toggleLove calls (no separate countId)
  document.querySelectorAll('.post-love').forEach(btn => {
    if (btn.onclick) return; // Already handled

    btn.addEventListener('click', function () {
      const heart = this.querySelector('.heart');
      const countEl = this.querySelector('span:last-child');
      this.classList.toggle('active');

      if (this.classList.contains('active')) {
        heart.textContent = '❤️';
        if (countEl && /^\d+$/.test(countEl.textContent)) {
          countEl.textContent = parseInt(countEl.textContent) + 1;
        }
      } else {
        heart.textContent = '🤍';
        if (countEl && /^\d+$/.test(countEl.textContent)) {
          countEl.textContent = parseInt(countEl.textContent) - 1;
        }
      }
    });
  });

  // Restore love states
  ['love-post1', 'love-post2'].forEach(id => {
    if (localStorage.getItem(`love_${id}`) === 'true') {
      const btn = document.getElementById(id);
      if (btn) {
        const heart = btn.querySelector('.heart');
        if (heart) heart.textContent = '❤️';
        btn.classList.add('active');
      }
    }
  });

  // ===================== SINGLE POST LOVE BUTTON =====================
  window.toggleLovePost = function (btnId, countId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    const heart = btn.querySelector('.heart');
    const countEl = document.getElementById(countId);
    const storageKey = `love_${btnId}`;
    const isLoved = localStorage.getItem(storageKey) === 'true';

    if (isLoved) {
      localStorage.removeItem(storageKey);
      if (heart) heart.textContent = '🤍';
      btn.classList.remove('active');
      if (countEl) countEl.textContent = parseInt(countEl.textContent) - 1;
    } else {
      localStorage.setItem(storageKey, 'true');
      if (heart) heart.textContent = '❤️';
      btn.classList.add('active');
      if (countEl) countEl.textContent = parseInt(countEl.textContent) + 1;
    }
  };

  window.toggleLoveMain = function (btnId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    const heartEl = btn.querySelector('.heart-icon');
    const textEl = btn.querySelector('span:last-child');
    const storageKey = `loveMain_${btnId}`;
    const isLoved = localStorage.getItem(storageKey) === 'true';

    if (isLoved) {
      localStorage.removeItem(storageKey);
      if (heartEl) heartEl.textContent = '🤍';
      btn.classList.remove('loved');
      if (textEl) textEl.textContent = 'Yêu thích bài viết này';
    } else {
      localStorage.setItem(storageKey, 'true');
      if (heartEl) heartEl.textContent = '❤️';
      btn.classList.add('loved');
      if (textEl) textEl.textContent = 'Đã yêu thích ❤️';

      // Particle effect
      createHeartParticles(btn);
    }
  };

  // Restore main love button states
  ['loveBtnPost1', 'loveBtnPost2'].forEach(id => {
    if (localStorage.getItem(`loveMain_${id}`) === 'true') {
      const btn = document.getElementById(id);
      if (btn) {
        const heartEl = btn.querySelector('.heart-icon');
        const textEl = btn.querySelector('span:last-child');
        if (heartEl) heartEl.textContent = '❤️';
        btn.classList.add('loved');
        if (textEl) textEl.textContent = 'Đã yêu thích ❤️';
      }
    }
  });

  // ===================== HEART PARTICLE EFFECT =====================
  function createHeartParticles(btn) {
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.textContent = ['❤️', '💕', '💗', '🌸'][Math.floor(Math.random() * 4)];
      particle.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        font-size: ${12 + Math.random() * 12}px;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translate(-50%, -50%);
        opacity: 1;
      `;

      document.body.appendChild(particle);

      const angle = (i / 8) * Math.PI * 2;
      const distance = 60 + Math.random() * 40;

      requestAnimationFrame(() => {
        particle.style.transform = `translate(
          calc(-50% + ${Math.cos(angle) * distance}px),
          calc(-50% + ${Math.sin(angle) * distance - 30}px)
        )`;
        particle.style.opacity = '0';
      });

      setTimeout(() => particle.remove(), 900);
    }
  }

  // ===================== SMOOTH IMAGE LOADING =====================
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', () => {
      img.style.opacity = '1';
    });
    if (!img.complete) {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.4s ease';
    }
  });

  // ===================== HIGHLIGHT BOX ANIMATION =====================
  const highlightBoxes = document.querySelectorAll('.highlight-box');
  const boxObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'scale(1)';
        entry.target.style.opacity = '1';
        boxObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  highlightBoxes.forEach(box => {
    box.style.transform = 'scale(0.98)';
    box.style.opacity = '0.3';
    box.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    boxObserver.observe(box);
  });

  // ===================== TAG CLICK =====================
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', function () {
      this.style.transform = 'scale(0.92)';
      setTimeout(() => { this.style.transform = ''; }, 150);
    });
  });

  // ===================== CURSOR GLOW (desktop) =====================
  if (window.innerWidth > 768) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 300px; height: 300px; border-radius: 50%;
      background: radial-gradient(circle, rgba(201,132,106,0.08) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: left 0.2s ease, top 0.2s ease;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  // Initial animation trigger
  animateOnScroll();
});
