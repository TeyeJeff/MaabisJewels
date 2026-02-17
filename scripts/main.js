import { loadHeaderFooter } from "./helpers.mjs";
import { addToWishList, isInWishlist, removeFromWishlist, updateWishlistUI, renderWishlist } from "./wishlist.mjs";
import { updateAuthUI, updateHeaderGreeting } from "./auth.mjs";
import { renderCart, updateCartCount, addToCart } from "./cart.mjs";  // ← added addToCart here
import { renderListWithTemplate } from "./helpers.mjs";
import { fetchJewelryProducts, productCardTemplate } from "./product.mjs";  // ← local fetch
import { initProductDetails } from "./product-details.mjs";
import { getExchangeRate } from "./currency.mjs";

let allProducts = []; //will hold all loaded jewelry items
let currentCurrency = { code: "GHS", rate: 1, symbol: "₵" }; 



// Building a hero slider
function initHeroSlider() {
    const slides = document.querySelectorAll(".hero .slide");
    if (slides.length === 0) return;

    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    showSlide(currentIndex);
    setInterval(nextSlide, 5000);
}

async function loadAndRenderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = '<p>Loading jewelry collection...</p>';

    allProducts = await fetchJewelryProducts();  // ← save here

    if (allProducts.length === 0) {
        grid.innerHTML = '<p>No jewelry products available right now.</p>';
        return;
    }

    renderListWithTemplate(
        productCardTemplate,
        grid,
        allProducts,
        'beforeend',
        true
    );
}

// Function to handle filtering and re-rendering the shop grid


async function handleFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('category-filter');
    const priceRange = document.getElementById('price-range');
    const priceDisplay = document.getElementById('price-value');

    const query = searchInput?.value || "";
    const category = categoryFilter?.value || "all";
    const price = priceRange ? Number(priceRange.value) : Infinity;

    // Update the visual price label for the slider (keep this in GHS)
    if (priceDisplay) {
        priceDisplay.textContent = price >= 30000 ? "Any" : `GHS ${price}`;
    }

    // Fetch filtered data from your local JSON
    const allProducts = await fetchJewelryProducts(query, category, price);

    const grid = document.getElementById('product-grid');
    if (grid) {
        // IMPORTANT: Manually map and render to pass the currentCurrency
        grid.innerHTML = allProducts.map(product =>
            productCardTemplate(product, currentCurrency)
        ).join("");

        updateWishlistUI();
    }
}

// 4. Add a listener for your currency dropdown
document.getElementById('currency-select')?.addEventListener('change', async (e) => {
    const selectedCode = e.target.value;

    // fetchExchangeRate is the function from your currency.mjs
    const data = await getExchangeRate(selectedCode);

    currentCurrency = {
        code: data.code,
        rate: data.rate,
        symbol: data.symbol
    };

    handleFilters(); // Refresh the grid with new prices
});

// When the currency dropdown changes
async function handleCurrencyChange() {
    const selectedCode = document.getElementById('currency-select').value;

    // Fetch data from ExchangeRate-API (from the currency.mjs we discussed)
    const data = await getExchangeRate(selectedCode);

    currentCurrency = {
        code: data.code,
        rate: data.rate,
        symbol: data.symbol
    };

    handleFilters();
}

// Run when page is ready
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Load Header/Footer first and WAIT for them
    await loadHeaderFooter();

    // 2. Refresh UI elements now that header is definitely there
    updateCartCount();
    updateHeaderGreeting();

    // 3. Page-Specific Logic
    if (document.querySelector(".hero")) {
        initHeroSlider();
    }

    if (document.getElementById("product-grid")) {
        // We use .then() so it doesn't block the rest of the script
        loadAndRenderProducts().then(() => {
            updateWishlistUI();
        });
    }

    if (document.getElementById("cart-items")) {
        renderCart();
    }

    if (document.getElementById("wishlist-grid")) {
        renderWishlist();
    }

    if (document.getElementById("product-detail-container")) {
        initProductDetails();
    }

    // Live search/filter as you type or slide
    document.getElementById('searchInput')?.addEventListener('input', handleFilters);
    document.getElementById('category-filter')?.addEventListener('change', handleFilters);
    document.getElementById('price-range')?.addEventListener('input', handleFilters);
    document.getElementById('searchBtn')?.addEventListener('click', handleFilters);

    
    
    

    initAuthUI();

    
});

// Wishlist toggle (event delegation)
// Replace your wishlist click listener with this:
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".wishlist-btn");
    if (!btn) return;

    // Use dataset.productId (this works on both Shop and Details pages now)
    const productId = Number(btn.dataset.productId);

    // Ensure we have the data source (window.allProducts from the detail page)
    const sourceData = (window.allProducts && window.allProducts.length > 0) ? window.allProducts : allProducts;
    const product = sourceData.find(p => p.id === productId);

    if (!product) {
        console.warn(`Product with id ${productId} not found`);
        return;
    }

    if (isInWishlist(productId)) {
        removeFromWishlist(productId);
        btn.classList.remove("active");
        btn.innerHTML = '♡'; // Update icon visually
        btn.setAttribute("aria-label", "Add to wishlist");
    } else {
        addToWishList(product);
        btn.classList.add("active");
        btn.innerHTML = '❤️'; // Update icon visually
        btn.setAttribute("aria-label", "Remove from wishlist");
    }

    // Refresh UI if we have a function for it
    if (typeof updateWishlistUI === "function") updateWishlistUI();
});

// Add to Cart button click
// Replace your existing 'add-to-cart' listener with this:
document.addEventListener('click', (e) => {
    if (e.target.matches('.add-to-cart')) {
        // Get ID from the button's data-id (Detail Page) or parent card (Shop Page)
        const productId = Number(e.target.dataset.id || e.target.closest('.product-card')?.dataset.id);

        // Check both local allProducts and window.allProducts
        const sourceData = (window.allProducts && window.allProducts.length > 0) ? window.allProducts : allProducts;
        const product = sourceData.find(p => p.id === productId);

        if (!product) {
            console.error("Product data not found. Ensure allProducts is loaded.");
            return;
        }

        addToCart(product);
        alert(`${product.title} added to cart!`);
    }
});

// Adding checkout button
document.getElementById('checkout-btn')?.addEventListener('click', () => {
    window.location.href = 'checkout.html';
});

