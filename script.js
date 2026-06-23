
// FAQ toggle
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    q.parentElement.classList.toggle('open');
  });
});

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
if(menuToggle){
  menuToggle.addEventListener('click',()=>{
    const nav = document.getElementById('mobile-nav');
    nav.classList.toggle('open');
  });
}

// Form validation
const contactForm = document.getElementById('contact-form');
if(contactForm){
  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    const btn = this.querySelector('button[type=submit]');
    const orig = btn.textContent;
    btn.textContent = 'Envoi en cours...';
    btn.disabled = true;

    const data = new FormData(this);
    fetch('/api/contact', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(Object.fromEntries(data))
    })
    .then(r => {
      if(!r.ok) throw new Error('Erreur');
      return r.json();
    })
    .then(() => {
      btn.textContent = 'Message envoyé ✓';
      btn.style.background = 'var(--green)';
      this.reset();
    })
    .catch(() => {
      btn.textContent = orig;
      btn.disabled = false;
      alert('Erreur. Réessayez ou contactez-nous par email.');
    });
  });
}
