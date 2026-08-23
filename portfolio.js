document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------
  // AOS INIT
  // ---------------------------------------------------------
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 750,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      disable: prefersReducedMotion
    });
  }

  // DOM Elements
  const darkToggle = document.querySelector('.toggle-darkmode');
  const backToTop = document.querySelector('.back-to-top');
  const githubGrid = document.querySelector('.github-grid');
  const navbar = document.querySelector('.navbar');
  const pageLoader = document.querySelector('.page-loader');
  const heroSection = document.querySelector('.hero-section');

  // ---------------------------------------------------------
  // PAGE LOADER (skip/short if already fast)
  // ---------------------------------------------------------
  const hideLoader = () => {
    if (pageLoader) pageLoader.classList.add('hidden');
    if (heroSection) heroSection.classList.add('is-loaded');
  };
  setTimeout(hideLoader, prefersReducedMotion ? 0 : 650);

  // ---------------------------------------------------------
  // DARK MODE TOGGLE
  // ---------------------------------------------------------
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      loadGitHubStats();
    });
  }

  // LOAD SAVED THEME (fallback to system preference)
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-mode');
  }

  // ---------------------------------------------------------
  // GITHUB / LEETCODE STATS
  // ---------------------------------------------------------
  function loadGitHubStats() {
    if (!githubGrid) return;

    const isDark = document.body.classList.contains('dark-mode');
    const streakTheme = isDark ? 'tokyonight' : 'flat';
    const leetTheme = isDark ? 'dark' : 'light';
    const streakTheme2 = isDark ? 'tokyonight' : 'default';

    githubGrid.innerHTML = `
      <div class="card github-streak-card" data-aos="zoom-in">
        <h3>GitHub — Vibhanshusoni</h3>
        <img
            src="https://streak-stats.demolab.com?user=Vibhanshusoni&theme=${streakTheme}"
            alt="GitHub Streak - Vibhanshusoni"
            loading="lazy"
            onerror="this.parentElement.innerHTML='<p class=\\'card-fallback\\'>GitHub streak stats are temporarily unavailable.</p>'">
    </div>

    <div class="card github-streak-card" data-aos="zoom-in">
        <h3>GitHub — Vibhanshu054</h3>
        <img
            src="https://github-readme-streak-stats.herokuapp.com/?user=vibhanshu054&theme=${streakTheme2}"
            alt="GitHub Streak - Vibhanshu054"
            loading="lazy"
            onerror="this.parentElement.innerHTML='<p class=\\'card-fallback\\'>GitHub streak stats are temporarily unavailable.</p>'">
    </div>

    <div class="card github-streak-card" data-aos="zoom-in">
        <h3>LeetCode — vibhanshu_soni</h3>
        <img
            src="https://leetcard.jacoblin.cool/vibhanshu_soni?theme=${leetTheme}&ext=contest"
            alt="LeetCode Stats - vibhanshu_soni"
            loading="lazy"
            onerror="this.parentElement.innerHTML='<p class=\\'card-fallback\\'>LeetCode stats are temporarily unavailable.</p>'">
    </div>
    `;

    if (typeof AOS !== 'undefined') AOS.refresh();
  }

  loadGitHubStats();

  // ---------------------------------------------------------
  // SCROLL PROGRESS BAR
  // ---------------------------------------------------------
  const progressBar = document.querySelector('.scroll-progress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  // ---------------------------------------------------------
  // BACK TO TOP + NAVBAR SHRINK + PROGRESS (single scroll listener)
  // ---------------------------------------------------------
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollProgress();

        if (backToTop) {
          backToTop.classList.toggle('show', window.scrollY > 200);
        }
        if (navbar) {
          navbar.classList.toggle('nav-scrolled', window.scrollY > 40);
        }
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  // ---------------------------------------------------------
  // SMOOTH SCROLL FOR NAV LINKS
  // ---------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        closeMobileNav();
      }
    });
  });

  // ---------------------------------------------------------
  // ACTIVE NAV LINK ON SCROLL
  // ---------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-links a, .mobile-nav-panel a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => sectionObserver.observe(sec));

  // ---------------------------------------------------------
  // MOBILE NAV
  // ---------------------------------------------------------
  const navToggle = document.querySelector('.nav-toggle');
  const mobilePanel = document.querySelector('.mobile-nav-panel');
  const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');

  function openMobileNav() {
    if (mobilePanel) mobilePanel.classList.add('open');
    if (mobileBackdrop) mobileBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
  }
  function closeMobileNav() {
    if (mobilePanel) mobilePanel.classList.remove('open');
    if (mobileBackdrop) mobileBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobilePanel && mobilePanel.classList.contains('open');
      isOpen ? closeMobileNav() : openMobileNav();
    });
  }
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileNav);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });

  // ---------------------------------------------------------
  // HERO ROLE ROTATOR
  // ---------------------------------------------------------
  const roleTrack = document.querySelector('.hero-role-rotator .role-track');
  const roles = [
    'Java Backend Developer',
    'Spring Boot Specialist',
    'Microservices Architect',
    'Backend Systems Engineer'
  ];
  if (roleTrack && !prefersReducedMotion) {
    let roleIndex = 0;
    setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleTrack.style.opacity = '0';
      roleTrack.style.transform = 'translateY(8px)';
      setTimeout(() => {
        roleTrack.textContent = roles[roleIndex];
        roleTrack.style.transform = 'translateY(-8px)';
        requestAnimationFrame(() => {
          roleTrack.style.opacity = '1';
          roleTrack.style.transform = 'translateY(0)';
        });
      }, 350);
    }, 2600);
  }

  // ---------------------------------------------------------
  // HERO STAT COUNT-UP
  // ---------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  statNumbers.forEach(el => countObserver.observe(el));

  // ---------------------------------------------------------
  // HERO BACKGROUND — LIGHTWEIGHT NETWORK/NODE CANVAS
  // (represents microservices topology; skipped on reduced-motion)
  // ---------------------------------------------------------
  const heroCanvas = document.querySelector('.hero-bg-canvas');
  if (heroCanvas && !prefersReducedMotion) {
    const ctx = heroCanvas.getContext('2d');
    let w, h, nodes;

    function resize() {
      w = heroCanvas.width = heroCanvas.offsetWidth;
      h = heroCanvas.height = heroCanvas.offsetHeight;
    }

    function initNodes() {
      const count = w < 700 ? 18 : 34;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 1
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(255,255,255,${0.12 * (1 - dist / 150)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach(n => {
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    resize();
    initNodes();
    draw();
    window.addEventListener('resize', () => {
      resize();
      initNodes();
    }, { passive: true });
  }

  // ---------------------------------------------------------
  // CUSTOM CURSOR (desktop, fine pointer only)
  // ---------------------------------------------------------
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (isFinePointer && !prefersReducedMotion) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (cursorDot && cursorRing) {
      let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      });

      function animateRing() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateRing);
      }
      animateRing();

      document.querySelectorAll('a, button, .skill-tag').forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-link'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-link'));
      });

      document.querySelectorAll('.project-card:not(.internal-project)').forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursorRing.classList.add('cursor-project');
          cursorRing.innerHTML = '<span class="cursor-label">VIEW<br>PROJECT</span>';
        });
        el.addEventListener('mouseleave', () => {
          cursorRing.classList.remove('cursor-project');
          cursorRing.innerHTML = '';
        });
      });
    }
  } else {
    document.body.classList.add('no-custom-cursor');
  }

  // ---------------------------------------------------------
  // PROJECT CARD 3D TILT (desktop only, subtle)
  // ---------------------------------------------------------
  if (isFinePointer && !prefersReducedMotion) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -4;
        const rotateY = ((x / rect.width) - 0.5) * 4;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ---------------------------------------------------------
  // PROJECT CASE-STUDY MODAL
  // ---------------------------------------------------------
  const modalOverlay = document.querySelector('.project-modal-overlay');
  const modalBody = document.querySelector('.project-modal');

  function buildArchNodes(nodesArr) {
    return nodesArr.map((n, i) =>
      `<div class="arch-node">${n}</div>${i < nodesArr.length - 1 ? '<div class="arch-arrow">↓</div>' : ''}`
    ).join('');
  }

  function openProjectModal(data) {
    if (!modalOverlay || !modalBody) return;
    modalBody.innerHTML = `
      <button class="modal-close" aria-label="Close project details">&times;</button>
      <h3 class="modal-title">${data.title}</h3>
      <div class="tech-stack">${data.tech.map(t => `<span>${t}</span>`).join('')}</div>
      <div class="modal-section"><h4>Problem</h4><p>${data.problem}</p></div>
      <div class="modal-section"><h4>Approach</h4><p>${data.approach}</p></div>
      ${data.arch ? `<div class="modal-section"><h4>Architecture</h4><div class="modal-arch">${buildArchNodes(data.arch)}</div></div>` : ''}
      <div class="modal-section"><h4>Key Features</h4><ul>${data.features.map(f => `<li>${f}</li>`).join('')}</ul></div>
      <div class="modal-section"><h4>Result</h4><p>${data.result}</p></div>
      ${data.link ? `<div class="modal-section"><a href="${data.link}" target="_blank" class="project-link">View Code on GitHub →</a></div>` : ''}
    `;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalBody.querySelector('.modal-close').addEventListener('click', closeProjectModal);

    const arch = modalBody.querySelector('.modal-arch');
    if (arch) setTimeout(() => arch.classList.add('animate'), 100);
  }

  function closeProjectModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeProjectModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeProjectModal();
    });
  }

  document.querySelectorAll('.project-card[data-project]:not(.internal-project)').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // let links work normally
      const key = card.dataset.project;
      if (projectDetails[key]) openProjectModal(projectDetails[key]);
    });
  });

  // ---------------------------------------------------------
  // SKILLS CATEGORY FILTER
  // ---------------------------------------------------------
  const filterBtns = document.querySelectorAll('.skills-filter button');
  const skillCategoryEls = document.querySelectorAll('.skill-category');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      skillCategoryEls.forEach(cat => {
        if (filter === 'all' || cat.dataset.category === filter) {
          cat.classList.remove('is-muted');
        } else {
          cat.classList.add('is-muted');
        }
      });
    });
  });

  // ---------------------------------------------------------
  // EXPERIENCE TIMELINE DRAW + NODE ACTIVATION
  // ---------------------------------------------------------
  const timeline = document.querySelector('.experience-timeline');
  const timelineFill = document.querySelector('.timeline-fill');
  const expCards = document.querySelectorAll('.experience-card');

  function updateTimeline() {
    if (!timeline || !timelineFill) return;
    const rect = timeline.getBoundingClientRect();
    const viewportMid = window.innerHeight * 0.75;
    const progress = Math.min(Math.max((viewportMid - rect.top) / rect.height, 0), 1);
    timelineFill.style.height = (progress * 100) + '%';

    expCards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      if (cardRect.top < viewportMid) {
        card.classList.add('node-active');
      }
    });
  }
  window.addEventListener('scroll', updateTimeline, { passive: true });
  updateTimeline();

  // ---------------------------------------------------------
  // COMMAND PALETTE (Ctrl+K / Cmd+K)
  // ---------------------------------------------------------
  const cmdkOverlay = document.querySelector('.cmdk-overlay');
  const cmdkInput = document.querySelector('.cmdk-input');
  const cmdkList = document.querySelector('.cmdk-list');
  const cmdkTrigger = document.querySelector('.nav-kbd-hint');

  const cmdkItems = [
    { label: 'About', icon: 'fa-user', href: '#about' },
    { label: 'Skills', icon: 'fa-code', href: '#skills' },
    { label: 'Projects', icon: 'fa-diagram-project', href: '#projects' },
    { label: 'Experience', icon: 'fa-briefcase', href: '#experience' },
    { label: 'Education', icon: 'fa-graduation-cap', href: '#education' },
    { label: 'Certifications', icon: 'fa-certificate', href: '#certifications' },
    { label: 'GitHub Activity', icon: 'fa-github', href: '#github' },
    { label: 'Contact', icon: 'fa-envelope', href: '#contact' },
    { label: 'Resume (PDF)', icon: 'fa-file', href: 'https://drive.google.com/file/d/1gIXGJHWPV2FXksqi-aw1WrOh8h4v7zD-/view?usp=drive_link', external: true },
    { label: 'GitHub Profile', icon: 'fa-brands fa-github', href: 'https://github.com/Vibhanshusoni', external: true }
  ];

  function renderCmdkList(filter = '') {
    if (!cmdkList) return;
    const filtered = cmdkItems.filter(i => i.label.toLowerCase().includes(filter.toLowerCase()));
    cmdkList.innerHTML = filtered.map((item, idx) =>
      `<li data-href="${item.href}" data-external="${!!item.external}" class="${idx === 0 ? 'cmdk-active' : ''}">
        <i class="fas ${item.icon}"></i> ${item.label}
      </li>`
    ).join('') || '<li style="cursor:default;">No results</li>';
  }

  function openCmdk() {
    if (!cmdkOverlay) return;
    cmdkOverlay.classList.add('open');
    renderCmdkList();
    document.body.style.overflow = 'hidden';
    setTimeout(() => cmdkInput && cmdkInput.focus(), 50);
  }
  function closeCmdk() {
    if (!cmdkOverlay) return;
    cmdkOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if (cmdkInput) cmdkInput.value = '';
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCmdk();
    }
    if (e.key === 'Escape') closeCmdk();
  });

  if (cmdkTrigger) cmdkTrigger.addEventListener('click', openCmdk);
  if (cmdkOverlay) {
    cmdkOverlay.addEventListener('click', (e) => {
      if (e.target === cmdkOverlay) closeCmdk();
    });
  }
  if (cmdkInput) {
    cmdkInput.addEventListener('input', () => renderCmdkList(cmdkInput.value));
  }
  if (cmdkList) {
    cmdkList.addEventListener('click', (e) => {
      const li = e.target.closest('li[data-href]');
      if (!li) return;
      const href = li.dataset.href;
      if (li.dataset.external === 'true') {
        window.open(href, '_blank');
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
      closeCmdk();
    });
  }

  // ---------------------------------------------------------
  // COPY EMAIL
  // ---------------------------------------------------------
  window.copyEmail = function () {
    const email = 'vibhanshusoniofficial@gmail.com';
    navigator.clipboard?.writeText(email).then(() => {
      const el = document.getElementById('emailText');
      if (el) {
        const original = el.textContent;
        el.textContent = 'Copied to clipboard!';
        setTimeout(() => { el.textContent = original; }, 1600);
      }
    });
  };

  // ---------------------------------------------------------
  // LAZY LOAD IMAGES (data-src pattern support)
  // ---------------------------------------------------------
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
  }

  console.log('Portfolio loaded successfully! 🚀');
});

// ---------------------------------------------------------
// PROJECT CASE STUDY DATA
// (kept outside DOMContentLoaded closure so it's easy to extend)
// ---------------------------------------------------------
const projectDetails = {
  'college-management': {
    title: 'College Management System',
    tech: ['Java', 'Spring Boot', 'Spring Security', 'Spring Cloud', 'Eureka', 'OpenFeign', 'JWT', 'MySQL', 'Liquibase', 'Docker', 'Swagger'],
    problem: 'Colleges need a unified, secure backend to manage authentication, users, courses, faculty, students, attendance, and library workflows across independently deployable services.',
    approach: 'Designed a microservices ecosystem where each domain (auth, users, courses, faculty, students, attendance, library, departments) owns its own service, collaborating with a team via Git branching and code review.',
    arch: ['Client', 'API Gateway (JWT validation)', 'Eureka Service Discovery', 'Domain Microservices (OpenFeign)', 'MySQL + Hibernate'],
    features: [
      '8+ independently deployable domain services',
      'JWT-based authentication with role-based access for Admin, Faculty, Student, and Librarian',
      'API Gateway routing with Eureka service discovery and OpenFeign inter-service calls',
      '15+ secure REST APIs with validation and centralized exception handling',
      '100% API documentation via Swagger/OpenAPI',
      'Dockerized services integrated into a CI/CD pipeline'
    ],
    result: 'A production-ready, collaboratively built system handling multiple user roles with clean service boundaries and zero security incidents.',
    link: 'https://github.com/Vibhanshusoni/College-Management-System'
  },
  'employee-management': {
    title: 'Employee Management System — Secure Backend API',
    tech: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'OAuth2', 'MySQL', 'Hibernate'],
    problem: 'Enterprises need employee management backends with modern authentication and strict access control to prevent unauthorized data access.',
    approach: 'Built a production-grade secure backend layering JWT refresh-token rotation, OAuth2 social login, and account-lockout protection on top of clean REST API design.',
    arch: ['Client', 'REST API (Spring Security)', 'Auth Service (JWT + OAuth2)', 'Service Layer', 'MySQL + Hibernate'],
    features: [
      'JWT with refresh token rotation, secure logout, and token blacklisting',
      'OAuth2 social login via Google and GitHub',
      'Login attempt tracking with temporary and admin-initiated account locks',
      'Role-Based Access Control for ADMIN and USER roles',
      'Centralized exception handling and structured error responses'
    ],
    result: 'Zero security breaches in operation, reliably handling 100+ daily transactions with clean API contracts.',
    link: 'https://github.com/Vibhanshusoni/Employee-Management-System'
  },
  'user-product-microservices': {
    title: 'User-Product Microservices System',
    tech: ['Java 8', 'Spring Boot', 'Spring Cloud', 'Eureka', 'API Gateway', 'JWT', 'MySQL'],
    problem: 'Demonstrate a real, distributed microservices pattern for user and product domains with secure inter-service communication.',
    approach: 'Engineered 5+ modular services with Eureka-based service discovery and a monorepo structure to streamline registration and development workflows.',
    arch: ['Client', 'API Gateway', 'Eureka Discovery', 'User Service / Product Service', 'MySQL'],
    features: [
      'JWT validation, OTP verification, and secure password reset workflows',
      'Modular User and Product services with independent REST APIs',
      'Monorepo structure for efficient service registration'
    ],
    result: 'A scalable reference system demonstrating real-world microservices patterns end to end.',
    link: 'https://github.com/Vibhanshusoni/User-Product-Microservices'
  },
  'eco-route-planner': {
    title: 'Eco Route Planner Backend',
    tech: ['Java', 'Spring Boot', 'Spring Security', 'Google Directions API', 'Gmail API', 'MySQL'],
    problem: 'Users need optimized, eco-friendly routing with secure access and automated notifications.',
    approach: 'Integrated Google Directions API for route optimization and Gmail API for notifications, wrapped in a layered, DTO-driven architecture.',
    arch: ['Client', 'Secure REST API', 'Service Layer', 'Google Directions API', 'MySQL'],
    features: [
      'Secure REST APIs authenticated via Spring Security',
      'Google Directions API integration for route optimization (~30% faster computation)',
      'DTO pattern with layered, modular architecture',
      'Comprehensive validation, logging, and error handling'
    ],
    result: 'Faster, production-ready route computation with a clean, maintainable backend structure.',
    link: 'https://github.com/Vibhanshusoni/EcoRoutePlannerBackend'
  },
  'doctor-patient': {
    title: 'Doctor-Patient Management System',
    tech: ['Java', 'Spring Boot', 'Spring Security', 'MySQL', 'AWS EC2', 'AWS S3'],
    problem: 'Clinics need a reliable backend for appointment booking, patient records, and prescription management with secure file storage.',
    approach: 'Built and solo-deployed a full backend on AWS EC2, using S3 for storing patient documents, prescriptions, and profile images.',
    arch: ['Client', 'Spring Boot REST API', 'Spring Security', 'MySQL', 'AWS S3 (documents)'],
    features: [
      'Appointment booking, patient records, and prescription management',
      'Secure document storage using AWS S3',
      'Solo deployment and infrastructure setup on AWS EC2'
    ],
    result: 'A fully deployed, self-hosted backend demonstrating end-to-end ownership from code to cloud infrastructure.',
    link: 'https://github.com/Vibhanshusoni'
  }
};