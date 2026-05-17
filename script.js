// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// ===== CART (localStorage) =====
function getCart() {
  return JSON.parse(localStorage.getItem('lumiereCart')) || [];
}
function saveCart(cart) {
  localStorage.setItem('lumiereCart', JSON.stringify(cart));
  updateCartBadge();
}
function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => el.textContent = total);
}

// ===== ADD TO CART =====
function addToCart(name, price) {
  let cart = getCart();
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  saveCart(cart);
  showToast();
}

// ===== TOAST =====
function showToast() {
  const toast = document.getElementById('cartToast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== RENDER CART =====
function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cartItemsContainer');
  const empty = document.getElementById('emptyCart');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '';
    if (empty) empty.style.display = 'block';
    updateSummary(0);
    return;
  }
  if (empty) empty.style.display = 'none';

  container.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div class="cart-item-img">👗</div>
      <div class="flex-grow-1">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">PKR ${item.price.toLocaleString()}</p>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(${index}, -1)"><i class="bi bi-dash"></i></button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${index}, 1)"><i class="bi bi-plus"></i></button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeItem(${index})">
        <i class="bi bi-trash3"></i>
      </button>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  updateSummary(subtotal);
}

function changeQty(index, delta) {
  let cart = getCart();
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function removeItem(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function updateSummary(subtotal) {
  const subEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('totalAmount');
  const deliveryEl = document.getElementById('delivery');
  const discountEl = document.getElementById('discount');
  if (!subEl) return;

  const delivery = subtotal > 3000 ? 0 : (subtotal > 0 ? 200 : 0);
  const discount = window.discountApplied ? Math.round(subtotal * 0.2) : 0;
  const total = subtotal + delivery - discount;

  subEl.textContent = `PKR ${subtotal.toLocaleString()}`;
  deliveryEl.textContent = delivery === 0 && subtotal > 0 ? 'Free' : (delivery > 0 ? `PKR ${delivery}` : '—');
  discountEl.textContent = discount > 0 ? `- PKR ${discount.toLocaleString()}` : '—';
  totalEl.textContent = `PKR ${total.toLocaleString()}`;
}

// ===== COUPON =====
window.discountApplied = false;
function applyCoupon() {
  const code = document.getElementById('couponInput').value.trim().toUpperCase();
  if (code === 'LUMIERE20') {
    window.discountApplied = true;
    alert('✅ Coupon applied! 20% discount added.');
    renderCart();
  } else {
    alert('❌ Invalid coupon code. Try LUMIERE20');
  }
}

// ===== CHECKOUT =====
function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
  modal.show();
}
function clearCart() {
  localStorage.removeItem('lumiereCart');
  updateCartBadge();
  renderCart();
  window.discountApplied = false;
}

// ===== PRODUCT FILTER =====
function filterProducts(category, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.product-item').forEach(item => {
    if (category === 'all' || item.dataset.category === category) {
      item.style.display = 'block';
      item.style.animation = 'fadeIn 0.4s ease forwards';
    } else {
      item.style.display = 'none';
    }
  });
}

// ===== CONTACT FORM =====
function submitContact() {
  const name = document.getElementById('contactName')?.value.trim();
  const email = document.getElementById('contactEmail')?.value.trim();
  const message = document.getElementById('contactMessage')?.value.trim();

  if (!name || !email || !message) {
    alert('Please fill in all required fields.');
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  const success = document.getElementById('formSuccess');
  if (success) {
    success.style.display = 'block';
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactSubject').value = '';
    document.getElementById('contactMessage').value = '';
    setTimeout(() => success.style.display = 'none', 5000);
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
});

// CSS animation for filter
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`;
document.head.appendChild(style);
