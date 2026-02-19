import { getLocalStorage, setLocalStorage } from "./helpers.mjs";
import { getCart, clearCart } from "./cart.mjs";

const checkoutForm = document.getElementById('checkout-form');

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const cart = getCart();
    if (cart.length === 0) return alert("Your cart is empty!");

    // 1. Gather Customer Data
    const name = e.target[0].value;
    const phoneNum = e.target[1].value;
    const location = e.target[2].value;
    const notes = e.target[3].value;

    // 2. Build WhatsApp Message & Calculate Total
    let msg = `✨ *MAABIS JEWELS - NEW ORDER* ✨\n`;
    msg += `═══════════════════════\n\n`;
    msg += `👤 *Customer:* ${name}\n`;
    msg += `📍 *Delivery:* ${location}\n`;
    if (notes) msg += `📝 *Note:* _${notes}_\n`;
    msg += `\n*ITEMS ORDERED:*\n`;

    let total = 0; // Initialize total
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        msg += `◽ ${item.quantity}x ${item.title} — *₵${item.price}*\n`;
    });

    msg += `\n*GRAND TOTAL: ₵${total.toFixed(2)}*\n`;
    msg += `═══════════════════════\n`;
    msg += `_Please confirm availability to proceed._`;

    // 3. Save to Order History
    const newOrder = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        items: cart,
        total: total.toFixed(2),
        status: "Pending"
    };

    // Get existing history, add new order, and save back
    let history = getLocalStorage('order_history') || [];
    history.push(newOrder);
    setLocalStorage('order_history', history);

    // 4. Send to WhatsApp
    const shopPhone = "233204721265";
    window.open(`https://wa.me/${shopPhone}?text=${encodeURIComponent(msg)}`, '_blank');

    // 5. Clear Cart & Redirect
    clearCart();
    window.location.href = "profile.html";
});