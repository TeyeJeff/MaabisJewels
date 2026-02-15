import { isInWishlist } from "./wishlist";

export function productCardTemplate(product) {
    const inWishlist = isInWishlist(product.id);

    return `
        <div class="product-card" data-id="${product.id}">
      <img src="${product.thumbnail}" alt="${product.title}" loading="lazy">
      <h3>${product.title}</h3>
      <p class="price">GHS ${product.price.toFixed(2)}</p>
      <button class="add-to-cart">Add to Cart</button>
      <button 
        class="wishlist-btn ${inWishlist ? 'active' : ''}" 
        aria-label="${inWishlist ? 'Remove from' : 'Add to'} wishlist"
        data-product-id="${product.id}"
      >
        ♡
      </button>
    </div>

    `; // data-product-id so click handler knows which product to toggle
}