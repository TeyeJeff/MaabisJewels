import { getLocalStorage, setLocalStorage } from "./helpers.mjs";

// Get cart items from localStorage
export function getCart() {
    return getLocalStorage("cart", []);
    console.log('Cart before add:', cart); // ← debug
}

// Add product to cart or/and increase quantity if already in the cart
export function addToCart(product) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 }); //add new product/item with qty 1
    }

    setLocalStorage('cart', cart);
    console.log('Cart after add:', cart); // ← debug
    updateCartCount(); // update header badge
    return true;
}

// Remove product from cart by id
export function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    setLocalStorage('cart', cart);
    console.log('Cart after remove:', cart); // ← debug
    updateCartCount();
}

// Update quantity for a cart item
export function updateCartQuantity(productId, newQuantity) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item && newQuantity > 0) {
        item.quantity = newQuantity;
    } else if (newQuantity <= 0) {
        removeFromCart(productId); // if 0 or negative, remove
    }

    setLocalStorage('cart', cart);
    console.log('Cart after update:', cart); // ← debug
    updateCartCount();
}

// Calculate real-time subtotal
export function getCartSubtotal() {
    const cart = getCart();
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Formats the final sum with commas
    return subtotal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Update cart count badge in header
export function updateCartCount() {
    const cartCountEl = document.querySelector('.cart-count');
    if (cartCountEl) {
        const cart = getCart();
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = count;
        cartCountEl.style.display = count > 0 ? 'inline' : 'none'; // hide if 0
    }
}

// Template for cart item row (for cart.html display)
export function cartItemTemplate(item) {
    // Format individual item price with commas and 2 decimals
    const formattedPrice = item.price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Calculate and format the item subtotal (price * quantity)
    const formattedSubtotal = (item.price * item.quantity).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <h3>${item.title}</h3>
      <p>Price: GHS ${formattedPrice}</p>
      <div class="quantity">
        <button class="qty-decrease">-</button>
        <input type="number" value="${item.quantity}" min="1" class="qty-input">
        <button class="qty-increase">+</button>
      </div>
      <p>Subtotal: GHS ${formattedSubtotal}</p>
      <button class="remove-cart">Remove</button>
    </div>
  `;
}

// Render full cart in cart.html
export function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');

    if (!cartItemsContainer) return;

    const cart = getCart();
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty. <a href="maabis-shop.html">Continue shopping</a></p>';
        subtotalEl.textContent = 'GHS 0.00';
        return;
    }

    const html = cart.map(cartItemTemplate).join('');
    cartItemsContainer.innerHTML = html;
    subtotalEl.textContent = `GHS ${getCartSubtotal()}`;

    // Attach listeners for quantity change & remove
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.matches('.qty-decrease')) {
            const itemEl = e.target.closest('.cart-item');
            const id = Number(itemEl.dataset.id);
            const input = itemEl.querySelector('.qty-input');
            const newQty = Number(input.value) - 1;
            updateCartQuantity(id, newQty);
            renderCart(); // re-render
        }

        if (e.target.matches('.qty-increase')) {
            const itemEl = e.target.closest('.cart-item');
            const id = Number(itemEl.dataset.id);
            const input = itemEl.querySelector('.qty-input');
            const newQty = Number(input.value) + 1;
            updateCartQuantity(id, newQty);
            renderCart();
        }

        if (e.target.matches('.remove-cart')) {
            const itemEl = e.target.closest('.cart-item');
            const id = Number(itemEl.dataset.id);
            removeFromCart(id);
            renderCart();
        }
    });
}

export function clearCart() {
    setLocalStorage('cart', []);
    updateCartCount();
}

export function renderCheckoutTotal() {
    const totalEl = document.getElementById("checkout-total");
    if (totalEl) {
        const subtotal = getCartSubtotal();
        totalEl.textContent = `GHS ${subtotal}`;
    }
}