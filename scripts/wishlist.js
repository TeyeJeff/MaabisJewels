import { getLocalStorage, setLocalStorage } from "./helpers.mjs";

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