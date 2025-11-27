// AOS init
AOS.init({ duration: 800, easing: 'ease-in-out', once: true });

// Select elements
const darkToggle = document.querySelector('.toggle-darkmode');
const backToTop = document.querySelector('.back-to-top');

// Dark Mode Toggle (100% working)
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // save theme
  const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
});

// load saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
}

// Back to Top
window.addEventListener('scroll', () => {
  if (window.scrollY > 200) backToTop.classList.add('show');
  else backToTop.classList.remove('show');
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
