// join.js
// Handles tabs, "Apply now" buttons, and form submission with backend fetch

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.positions-tabs .tab');
    const panels = document.querySelectorAll('.tab-panel');
    const form = document.getElementById('applicationForm');
    const notice = document.getElementById('uploadNotice');
    const thanks = document.getElementById('thankYouMessage');
    const submitButton = form?.querySelector('button[type="submit"]');
  
    // ----- Tabs -----
    function activateTab(targetId) {
      tabs.forEach(t => {
        const isActive = t.getAttribute('aria-controls') === targetId;
        t.classList.toggle('active', isActive);
        t.setAttribute('aria-selected', String(isActive));
      });
  
      panels.forEach(p => {
        const isActive = p.id === targetId;
        p.classList.toggle('active', isActive);
        if (isActive) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
      });
  
      // Pre-select form position
      const select = document.getElementById('position');
      if (select) {
        select.value = targetId === 'postdoc-panel' ? 'Postdoc' : 'PhD';
      }
    }
  
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        activateTab(tab.getAttribute('aria-controls'));
      });
    });
  
    // Default: PhD
    activateTab('phd-panel');
  
    // ----- Apply Now buttons -----
    document.querySelectorAll('[data-apply]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const formArea = document.getElementById('applicationArea');
        if (formArea) {
          formArea.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => document.getElementById('fullName')?.focus(), 300);
        }
      });
    });
  
    // ----- Form submission -----
    if (form && submitButton) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
  
        const formData = new FormData(form);
  
        // Show message and disable button
        notice.style.display = 'block';
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
  
        try {
          const res = await fetch('https://your-backend-url.com/apply', {
            method: 'POST',
            body: formData
          });
  
          if (res.ok) {
            form.style.display = 'none';
            thanks.style.display = 'block';
            window.scrollTo({ top: thanks.offsetTop - 80, behavior: 'smooth' });
          } else {
            alert('There was an error submitting the form.');
          }
        } catch (err) {
          console.error(err);
          alert('Failed to submit. Please try again.');
        } finally {
          // Reset button state
          submitButton.disabled = false;
          submitButton.textContent = 'Submit Application';
          notice.style.display = 'none';
        }
      });
    }
  });
  