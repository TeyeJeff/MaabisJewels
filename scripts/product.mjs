
import { isInWishlist } from "./wishlist.mjs";

// Product card template – uses "image" field from your JSON
export function productCardTemplate(product, currency = { symbol: "₵", rate: 1 }) {
    const inWishlist = isInWishlist(product.id);
    const imageUrl = product.image || '/images/placeholder-jewelry.jpg';

    //  Calculate the converted numeric price
    const convertedPriceValue = product.price * currency.rate;

    // Format with commas and 2 decimal places
    const formattedPrice = convertedPriceValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return `
        <div class="product-card" data-id="${product.id}">
            <a href="product-details.html?id=${product.id}" class="product-card-link">
                <div class="image-container">
                    <img src="${imageUrl}" alt="${product.title}" loading="lazy">
                </div>
                <h3>${product.title}</h3>
            </a>
            <p class="price">${currency.symbol} ${formattedPrice}</p>
            <div class="rating">Rating: ${product.rating} ★</div>
            <button class="add-to-cart">Add to Cart</button>
            <button class="wishlist-btn ${inWishlist ? 'active' : ''}" data-product-id="${product.id}">
                ♡
            </button>
        </div>
    `;
}

// Load products from your local jewelries.json file
export async function fetchJewelryProducts(query = "", category = "all", maxPrice = Infinity) {
    try {
        const response = await fetch('/data/jewelries.json');
        if (!response.ok) throw new Error("Failed to load data");

        let products = await response.json();

        // 1. Search Filter (Checks title and category)
        if (query) {
            const lowerQuery = query.toLowerCase().trim();
            products = products.filter(p =>
                p.title.toLowerCase().includes(lowerQuery) ||
                p.category.toLowerCase().includes(lowerQuery)
            );
        }

        // 2. Category Filter (Fixed for "rings " and "watchs")
        if (category !== "all" && category !== "") {
            const target = category.toLowerCase().trim();
            products = products.filter(p => {
                const pCat = p.category.toLowerCase().trim();
                // If user selects "watches", also match "watchs" from JSON
                if (target === "watches" && pCat === "watchs") return true;
                return pCat === target;
            });
        }

        // 3. Price Filter
        if (maxPrice !== Infinity) {
            products = products.filter(p => p.price <= maxPrice);
        }

        return products;
    } catch (error) {
        console.error('Error filtering products:', error);
        return [];
    }
}