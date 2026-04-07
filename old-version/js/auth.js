/* ============================================
   AUTH.JS — Login & Signup Logic
   ============================================ */

/**
 * Toggle password visibility
 * @param {string} id - The id of the input field
 * @param {HTMLElement} btn - The button element
 */
function togglePass(id, btn) {
    const input = document.getElementById(id);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  }
  
  /**
   * Simple email validation
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  // Login Logic
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
  
      const email = document.getElementById('loginEmail');
      const pass = document.getElementById('loginPass');
  
      // Reset errors
      email.classList.remove('error');
      pass.classList.remove('error');
  
      if (!isValidEmail(email.value)) {
        email.classList.add('error');
        valid = false;
      }
      if (pass.value.length < 8) {
        pass.classList.add('error');
        valid = false;
      }
  
      if (valid) {
        window.showToast("Logging in... Please wait.", "success");
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      } else {
        window.showToast("Please check the fields.", "error");
      }
    });
  }
  
  // Signup Logic
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
  
      const name = document.getElementById('signupName');
      const user = document.getElementById('signupUser');
      const email = document.getElementById('signupEmail');
      const pass = document.getElementById('signupPass');
      const confirm = document.getElementById('signupConfirm');
      const terms = document.getElementById('signupTerms');
  
      // Reset
      [name, user, email, pass, confirm].forEach(el => el.classList.remove('error'));
  
      if (name.value.trim().length < 3) {
        name.classList.add('error');
        valid = false;
      }
      if (user.value.trim().length < 3) {
        user.classList.add('error');
        valid = false;
      }
      if (!isValidEmail(email.value)) {
        email.classList.add('error');
        valid = false;
      }
      if (pass.value.length < 8) {
        pass.classList.add('error');
        valid = false;
      }
      if (confirm.value !== pass.value) {
        confirm.classList.add('error');
        valid = false;
      }
      if (!terms.checked) {
        valid = false;
        window.showToast("You must agree to the terms.", "error");
      }
  
      if (valid) {
        window.showToast("Account created successfully!", "success");
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1800);
      } else {
        if (terms.checked) window.showToast("Please fix the registration errors.", "error");
      }
    });
  }
  
