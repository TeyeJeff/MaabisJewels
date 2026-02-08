import { loadHeaderFooter } from "./helpers.mjs";

loadHeaderFooter();

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

// Run when page is ready or opened
document.addEventListener("DOMContentLoaded", () => {
    initHeroSlider();
})