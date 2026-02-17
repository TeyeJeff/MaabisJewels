import { getParam } from "./helpers.mjs";
import { fetchJewelryProducts } from "./product.mjs";
import { isInWishlist } from "./wishlist.mjs";

const jewelryReviews = [
    "Absolutely stunning piece! The craftsmanship is top-tier and it catches the light beautifully.",
    "Bought this as a gift for my wife and she loved it. The gold finish is very premium.",
    "Exceeded my expectations. It looks even more elegant in person than in the photos!",
    "Quality is 10/10. You can tell this isn't mass-produced; the attention to detail is obvious.",
    "Fast delivery to Accra and the packaging was very sophisticated. Perfect for a proposal.",
    "The weight of the metal feels substantial and high-quality. Definitely worth the price.",
    "The detail on this is incredible. MaabisJewels never disappoints with their collection.",
    "A timeless design. I've been wearing it daily for a week and the shine is still perfect.",
    "I was hesitant about ordering jewelry online, but the customer service was excellent.",
    "Breathtaking! It's the perfect statement piece for special occasions.",
    "Simple, elegant, and modern. Exactly what I was looking for in a daily accessory.",
    "The engraving is so precise. Truly a work of art from the Maabis team."
];

export async function initProductDetails() {
    const productId = Number(getParam("id"));
    if (!productId) return;

    const products = await fetchJewelryProducts();

    // CRITICAL: This makes the products available to the 'Add to Cart' listener in main.js
    window.allProducts = products;

    const product = products.find(p => p.id === productId);

    if (product) {
        renderProductDetails(product);
        fetchAndRenderPlaceholderReviews(productId);
    }
}

function renderProductDetails(product) {
    const inWishlist = isInWishlist(product.id);
    document.title = `MaabisJewels | ${product.title}`;

    const container = document.getElementById("product-detail-container");
    container.innerHTML = `
        <div class="product-detail-flex">
            <div class="product-image-large">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info-panel">
                <nav class="breadcrumb">Maabis > ${product.category}</nav>
                <h1>${product.title}</h1>
                <p class="price">GHS ${product.price.toLocaleString()}</p>
                <p class="description">${product.description || "Handcrafted luxury piece."}</p>
                
                <div class="detail-actions">
                    <button class="add-to-cart btn-primary" data-id="${product.id}">Add to Cart</button>
                    
                    <button 
                        class="wishlist-btn ${inWishlist ? 'active' : ''}" 
                        data-product-id="${product.id}"
                        aria-label="${inWishlist ? 'Remove from' : 'Add to'} wishlist"
                    >
                        ${inWishlist ? '❤️' : '♡'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

async function fetchAndRenderPlaceholderReviews(productId) {
    const reviewContainer = document.getElementById("reviews-container");
    if (!reviewContainer) return;
    reviewContainer.innerHTML = "<p>Loading community feedback...</p>";

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${productId}`);
        const apiData = await response.json();
        const shuffledReviews = [...jewelryReviews].sort(() => 0.5 - Math.random());

        reviewContainer.innerHTML = apiData.slice(0, 5).map((item, index) => {
            const englishComment = shuffledReviews[index % shuffledReviews.length];
            const userName = item.email.split('@')[0];
            return `
                <div class="review-card">
                    <div class="review-header">
                        <strong>${userName}</strong>
                        <span class="stars">⭐⭐⭐⭐⭐</span>
                    </div>
                    <p class="review-body">"${englishComment}"</p>
                </div>
            `;
        }).join('');
    } catch (error) {
        reviewContainer.innerHTML = "<p>Reviews are temporarily unavailable.</p>";
    }
}