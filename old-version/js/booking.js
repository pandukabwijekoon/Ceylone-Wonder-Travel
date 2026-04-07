/* ============================================
   BOOKING.JS — Booking form logic & validation
   ============================================ */

// ===== TYPE SWITCH (Local / Foreigner) =====
function switchType(type) {
  document.getElementById('btnLocal').classList.toggle('active', type === 'local');
  document.getElementById('btnForeign').classList.toggle('active', type === 'foreign');
  document.getElementById('localExtra').classList.toggle('show', type === 'local');
  document.getElementById('foreignerExtra').classList.toggle('show', type === 'foreign');
}

// ===== HOTEL OPTION SELECTION =====
document.querySelectorAll('.hotel-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.hotel-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
  });
});

// ===== SET MIN DATE (today) =====
const today = new Date().toISOString().split('T')[0];
const checkinEl = document.getElementById('checkin');
const checkoutEl = document.getElementById('checkout');
if (checkinEl) checkinEl.min = today;
if (checkoutEl) checkoutEl.min = today;
checkinEl?.addEventListener('change', () => {
  checkoutEl.min = checkinEl.value;
  if (checkoutEl.value && checkoutEl.value <= checkinEl.value) checkoutEl.value = '';
  updateSummary();
});

// ===== BOOKING SUMMARY UPDATE =====
function updateSummary() {
  const dest = document.getElementById('destination')?.value || '—';
  const cin = document.getElementById('checkin')?.value || '';
  const cout = document.getElementById('checkout')?.value || '';
  const adults = document.getElementById('adults')?.value || '1';
  const roomSel = document.getElementById('roomType');
  const roomText = roomSel?.options[roomSel.selectedIndex]?.text || '—';
  const roomPrice = parseInt(roomSel?.options[roomSel.selectedIndex]?.dataset.price) || 0;

  document.getElementById('sumDest').textContent = dest || '—';
  document.getElementById('sumIn').textContent = cin ? formatDate(cin) : '—';
  document.getElementById('sumOut').textContent = cout ? formatDate(cout) : '—';
  document.getElementById('sumGuests').textContent = adults + ' Adult(s)';
  document.getElementById('sumRoom').textContent = roomText;

  let nights = 0;
  if (cin && cout) {
    const d1 = new Date(cin), d2 = new Date(cout);
    nights = Math.max(0, Math.round((d2 - d1) / 86400000));
  }
  document.getElementById('sumNights').textContent = nights > 0 ? nights + ' night(s)' : '—';

  const total = nights * roomPrice;
  document.getElementById('sumTotal').textContent = total > 0 ? '$' + total.toLocaleString() : '$0';
}

function formatDate(str) {
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ===== VALIDATION HELPERS =====
function setError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.classList.add('error');
  el.classList.remove('success');
  const errEl = el.nextElementSibling;
  if (errEl && errEl.classList.contains('form-error')) { errEl.textContent = msg || errEl.textContent; errEl.style.display = 'block'; }
  return false;
}

function setOk(id) {
  const el = document.getElementById(id);
  if (!el) return true;
  el.classList.remove('error');
  el.classList.add('success');
  const errEl = el.nextElementSibling;
  if (errEl && errEl.classList.contains('form-error')) errEl.style.display = 'none';
  return true;
}

function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function validatePhone(ph) { return /^[+\d\s\-()]{7,15}$/.test(ph); }
function validateNIC(nic) { return /^(\d{12}|\d{9}[VvXx])$/.test(nic.trim()); }
function validatePassport(p) { return /^[A-Z0-9]{6,12}$/.test(p.toUpperCase()); }

// ===== SUBMIT BOOKING =====
function submitBooking() {
  let valid = true;
  const isLocal = document.getElementById('btnLocal')?.classList.contains('active');

  // Personal
  const fn = document.getElementById('firstName')?.value.trim();
  valid = (fn?.length >= 2 ? setOk('firstName') : setError('firstName')) && valid;
  const ln = document.getElementById('lastName')?.value.trim();
  valid = (ln?.length >= 2 ? setOk('lastName') : setError('lastName')) && valid;
  const em = document.getElementById('email')?.value.trim();
  valid = (validateEmail(em) ? setOk('email') : setError('email')) && valid;
  const ph = document.getElementById('phone')?.value.trim();
  valid = (validatePhone(ph) ? setOk('phone') : setError('phone')) && valid;

  // Local or Foreigner
  if (isLocal) {
    const nic = document.getElementById('nic')?.value.trim();
    valid = (validateNIC(nic) ? setOk('nic') : setError('nic', 'Enter valid NIC (12 digits or 9 digits+V)')) && valid;
  } else {
    const nat = document.getElementById('nationality')?.value;
    valid = (nat ? setOk('nationality') : setError('nationality')) && valid;
    const pp = document.getElementById('passport')?.value.trim();
    valid = (validatePassport(pp) ? setOk('passport') : setError('passport', 'Enter valid passport number')) && valid;
  }

  // Booking details
  const dest = document.getElementById('destination')?.value;
  valid = (dest ? setOk('destination') : setError('destination')) && valid;
  const cin = document.getElementById('checkin')?.value;
  valid = (cin ? setOk('checkin') : setError('checkin')) && valid;
  const cout = document.getElementById('checkout')?.value;
  if (!cout || cout <= cin) { setError('checkout', 'Check-out must be after check-in'); valid = false; } else setOk('checkout');
  const room = document.getElementById('roomType')?.value;
  valid = (room ? setOk('roomType') : setError('roomType')) && valid;

  // Terms
  const terms = document.getElementById('agreeTerms')?.checked;
  const termsErr = document.getElementById('termsError');
  if (!terms) { if (termsErr) termsErr.style.display = 'block'; valid = false; }
  else { if (termsErr) termsErr.style.display = 'none'; }

  if (!valid) {
    window.showToast('Please fix the errors above before submitting.', 'error');
    return;
  }

  // Show success
  const ref = 'CW-' + Math.floor(100000 + Math.random() * 900000);
  document.getElementById('bookingRef').textContent = ref;
  document.getElementById('bookingForm').style.display = 'none';
  document.getElementById('bookingSuccess').classList.add('show');
  window.scrollTo({ top: document.querySelector('.booking-form-card').offsetTop - 120, behavior: 'smooth' });
  window.showToast('🎉 Booking confirmed! Reference: ' + ref, 'success');
}

// ===== LIVE VALIDATION =====
['firstName','lastName','email','phone','nic','passport','destination','roomType'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('blur', () => {
    if (el.value.trim()) el.classList.remove('error');
  });
});
