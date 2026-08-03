/* ==========================================
   DENKYEMBO LANDING PAGE
========================================== */

// =============================
// Sticky Header Shadow
// =============================

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        header.style.boxShadow = "0 10px 30px rgba(0,0,0,.10)";

    } else {

        header.style.boxShadow = "0 2px 10px rgba(0,0,0,.05)";

    }

});

// =============================
// Smooth Scrolling
// =============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});

// =============================
// Active Navigation
// =============================

const navLinks = document.querySelectorAll(".navbar a");

navLinks.forEach(link => {

    link.addEventListener("click", function () {

        navLinks.forEach(item => item.classList.remove("active"));

        this.classList.add("active");

    });

});

// =============================
// Scroll Reveal Animation
// =============================

const revealElements = document.querySelectorAll(

    ".collection-card, .product-card, .why-card, .testimonial-card, .project-grid img"

);

const revealOnScroll = () => {

    const trigger = window.innerHeight * 0.85;

    revealElements.forEach(el => {

        const top = el.getBoundingClientRect().top;

        if (top < trigger) {

            el.classList.add("show");

        }

    });

};

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();

// =============================
// Contact Form Validation
// =============================

const form = document.querySelector(".contact-form");

if (form) {

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const inputs = form.querySelectorAll("input, textarea");

        let valid = true;

        inputs.forEach(input => {

            if (input.value.trim() === "") {

                input.style.borderColor = "#F24234";

                valid = false;

            } else {

                input.style.borderColor = "#ddd";

            }

        });

        if (valid) {

            alert("Thank you! Your request has been received.");

            form.reset();

        }

    });

}