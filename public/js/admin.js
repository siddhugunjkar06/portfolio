/* Admin Panel JS */

// Sidebar Toggle
const sidebarToggle = document.querySelector('.sidebar-toggle');
const adminSidebar = document.querySelector('.admin-sidebar');

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    adminSidebar?.classList.toggle('open');
  });
}

// Close sidebar on mobile when clicking outside
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) {
    if (!e.target.closest('.admin-sidebar') && !e.target.closest('.sidebar-toggle')) {
      adminSidebar?.classList.remove('open');
    }
  }
});

// Flash message auto-dismiss
document.querySelectorAll('.alert').forEach(alert => {
  setTimeout(() => {
    alert.style.opacity = '0';
    alert.style.transform = 'translateY(-10px)';
    alert.style.transition = 'all 0.3s ease';
    setTimeout(() => alert.remove(), 300);
  }, 4000);
});

// Delete confirmation
document.querySelectorAll('.delete-form, [data-confirm]').forEach(el => {
  el.addEventListener('submit', (e) => {
    if (!confirm('Are you sure? This action cannot be undone.')) {
      e.preventDefault();
    }
  });
  el.addEventListener('click', (e) => {
    if (el.tagName !== 'FORM' && !confirm('Are you sure?')) {
      e.preventDefault();
    }
  });
});

// Image preview on file input
document.querySelectorAll('input[type="file"]').forEach(input => {
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      let preview = input.parentElement.querySelector('.img-preview');
      if (!preview) {
        preview = document.createElement('img');
        preview.className = 'img-preview';
        preview.style.cssText = 'max-width:200px;max-height:120px;object-fit:cover;border-radius:8px;margin-top:0.5rem;border:1px solid rgba(255,255,255,0.1)';
        input.parentElement.appendChild(preview);
      }
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
});

// Char count for textareas
document.querySelectorAll('textarea[maxlength]').forEach(ta => {
  const counter = document.createElement('div');
  counter.style.cssText = 'font-size:0.75rem;color:#4A5568;text-align:right;margin-top:0.25rem';
  counter.textContent = `0/${ta.maxLength}`;
  ta.parentElement.appendChild(counter);
  ta.addEventListener('input', () => {
    counter.textContent = `${ta.value.length}/${ta.maxLength}`;
    counter.style.color = ta.value.length > ta.maxLength * 0.9 ? '#FF3B30' : '#4A5568';
  });
});

console.log('⚙️ Admin panel loaded');
