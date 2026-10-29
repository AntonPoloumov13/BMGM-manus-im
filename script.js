const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const modal = document.querySelector('.modal');
const bookingForm = document.querySelector('#booking-form');
const formSuccess = document.querySelector('.form-success');
const formFields = bookingForm ? [...bookingForm.querySelectorAll('input, select, button')] : [];

function setMenu(open) {
  if (!menuToggle || !mobileNav) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileNav.classList.toggle('is-open', open);
  mobileNav.setAttribute('aria-hidden', String(!open));
}

function setModal(open) {
  if (!modal) return;
  modal.classList.toggle('is-open', open);
  modal.setAttribute('aria-hidden', String(!open));
  body.classList.toggle('modal-open', open);
  if (open) {
    const first = modal.querySelector('input');
    window.setTimeout(() => first?.focus(), 120);
  }
}

menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
document.querySelectorAll('.mobile-nav a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.querySelectorAll('[data-open-booking]').forEach((button) => button.addEventListener('click', () => {
  setMenu(false);
  setModal(true);
}));
document.querySelectorAll('[data-close-booking]').forEach((button) => button.addEventListener('click', () => setModal(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenu(false);
    setModal(false);
  }
});

bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  bookingForm.classList.add('form-hidden');
  formSuccess.classList.add('is-visible');
});

const today = new Date().toISOString().split('T')[0];
const checkin = bookingForm?.querySelector('[name="checkin"]');
const checkout = bookingForm?.querySelector('[name="checkout"]');
if (checkin && checkout) {
  checkin.min = today;
  checkout.min = today;
  checkin.addEventListener('change', () => {
    checkout.min = checkin.value || today;
    if (checkout.value && checkout.value <= checkin.value) checkout.value = '';
  });
}

modal?.addEventListener('transitionend', () => {
  if (!modal.classList.contains('is-open') && formSuccess.classList.contains('is-visible')) {
    bookingForm.reset();
    bookingForm.classList.remove('form-hidden');
    formSuccess.classList.remove('is-visible');
  }
});
