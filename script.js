
(function(){
  const emailBtn = document.querySelector('.copy');
  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      const text = emailBtn.dataset.copy || '';
      navigator.clipboard.writeText(text).then(() => {
        emailBtn.textContent = 'Copied';
        setTimeout(() => (emailBtn.textContent = 'Copy'), 1500);
      }).catch(()=>{
        emailBtn.textContent = 'Select & copy';
      });
    });
  }

  const toggle = document.getElementById('theme-toggle');
  toggle?.addEventListener('click', () => {
    const wasDark = document.documentElement.classList.toggle('light');
    if (wasDark) {
      document.documentElement.style.setProperty('--bg', '#f7f8fb');
    } else {
      document.documentElement.style.removeProperty('--bg');
    }
  });
})();
