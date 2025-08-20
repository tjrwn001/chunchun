const submitButton = form.querySelector('button[type="submit"]');
const notice = document.getElementById('uploadNotice');

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
      thankYou.style.display = 'block';
    } else {
      alert('There was an error submitting the form.');
    }
  } catch (err) {
    alert('Failed to submit. Please try again.');
  } finally {
    // Re-enable button if needed
    submitButton.disabled = false;
    submitButton.textContent = 'Submit Application';
    notice.style.display = 'none';
  }
});
