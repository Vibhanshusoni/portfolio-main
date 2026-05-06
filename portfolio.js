

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }

  // DOM Elements
  const darkToggle = document.querySelector('.toggle-darkmode');
  const backToTop = document.querySelector('.back-to-top');
  const githubGrid = document.querySelector('.github-grid');

  // DARK MODE TOGGLE
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      loadGitHubStats();
    });
  }

  // LOAD SAVED THEME
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // LOAD GITHUB STATS
  function loadGitHubStats() {
    if (!githubGrid) return;

    const isDark = document.body.classList.contains('dark-mode');
    const statsTheme = isDark ? 'tokyonight' : 'default';
    const streakTheme = isDark ? 'tokyonight' : 'flat';
    const leetTheme = isDark ? 'dark' : 'light';

    githubGrid.innerHTML = `

      <div class="card" data-aos="zoom-in">
        <img src="https://streak-stats.demolab.com?user=Vibhanshusoni&theme=${streakTheme}" 
             alt="GitHub Streak" loading="lazy">
      </div>

      <div class="card" data-aos="zoom-in">
        <img src="https://leetcard.jacoblin.cool/vibhanshu_soni?theme=${leetTheme}&ext=contest" 
             alt="LeetCode Stats" loading="lazy">
      </div>
    `;

    // Reinitialize AOS for new elements
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }

  // Load stats on page load
  loadGitHubStats();

  // BACK TO TOP BUTTON
  window.addEventListener('scroll', () => {
    if (backToTop) {
      if (window.scrollY > 200) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // SMOOTH SCROLL BEHAVIOR FOR NAVIGATION LINKS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // MOBILE MENU ENHANCEMENT
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close mobile menu if exists
      const mobileMenu = document.querySelector('.mobile-menu');
      if (mobileMenu) {
        mobileMenu.style.display = 'none';
      }
    });
  });

  // PERFORMANCE: Lazy load images
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

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  console.log('Portfolio loaded successfully! 🚀');
});

// HANDLE VISIBILITY CHANGE
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Refresh AOS if needed
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }
});