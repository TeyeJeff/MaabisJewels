import { loadHeaderFooter } from "./helpers.mjs";
import { addToWishList, isInWishlist, removeFromWishlist } from "./wishlist";
import { initAuthUI } from "./auth.mjs";

// Run when page is ready or opened
document.addEventListener("DOMContentLoaded", () => {
    loadHeaderFooter();
    initHeroSlider();
    initAuthUI();
})


// Building a hero slider by applying the concepts learnt from setInterval/ setTimeout from W2 learning activity
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

    //show first slide immediately 
    showSlide(currentIndex);

    //change every 5 seconds
    setInterval(nextSlide, 5000);
}



document.addEventListener("click", (e) => {
    if (e.target.matches(".wishlist-btn")) {
        const btn = e.target;
        const productId = Number(btn.dataset.productId); // stores converted number(which was a string and now converted into a number)

        if (isInWishlist(productId)) {
            removeFromWishlist(productId);
            btn.classList.remove("active");
            btn.setAttribute("aria-label", "Add to wishlist");
        } else {
            addToWishList(product);
            btn.classList.add("active");
            btn.setAttribute("aria-label", "Remove from wishlist");    
        }
    }
})

