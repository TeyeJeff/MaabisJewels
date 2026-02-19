import { getLocalStorage, setLocalStorage, renderListWithTemplate } from "./helpers.mjs";


// function that retrieves current wishlist array from localStorage, all other wishlist calls this function to get current list
export function getWishlist() {
    return getLocalStorage("wishlist", []);
}


// function to add products to wishlists 
export function addToWishList(product) {
    const wishlist = getWishlist();
    if (!wishlist.some(p => p.id === product.id)) {
        wishlist.push(product);
        setLocalStorage("wishlist", wishlist);
        return true;
    }
    return false; 
}

// function to remove products from the wishlist
export function removeFromWishlist(productId) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(p => p.id !== productId); // creates a new array that excludes the matching product by keeping every item where p.id !== productId
    setLocalStorage("wishlist", wishlist);
}

//function that shows products are in wishlist
export function isInWishlist(productId) {
    return getWishlist().some(p => p.id === productId);
}

//toggles the heart icons on the shop page
export function updateWishlistUI() {
    const wishlist = getWishlist();
    const wishlistIds = new Set(wishlist.map(p => p.id)); // fast lookup

    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = Number(btn.dataset.productId);
        if (wishlistIds.has(productId)) {
            btn.classList.add('active');
            btn.setAttribute('aria-label', 'Remove from wishlist');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-label', 'Add to wishlist');
        }
    });

}

export function renderWishlist() {
    const wishlistGrid = document.getElementById('wishlist-grid');
    if (!wishlistGrid) return; // Exit if we aren't on the wishlist page

    const wishlist = getWishlist();

    if (wishlist.length === 0) {
        wishlistGrid.innerHTML = '<p>Your wishlist is empty.</p>';
        return;
    }

    // We reuse the productCardTemplate to keep the design consistent
    import("./product.mjs").then(module => {
        renderListWithTemplate(module.productCardTemplate, wishlistGrid, wishlist, "afterbegin", true);
        updateWishlistUI(); // This ensures the hearts show as red/active
    });
}
