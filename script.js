document.addEventListener("DOMContentLoaded", function () {
  // 🎯 Fix: Only run the menu code if the elements exist
  const menu = document.querySelector("#mobile-menu");
  const about_page = document.querySelector("#about-page");
  const service_page = document.querySelector("#service-page");
  const feature_page = document.querySelector("#feature-page");
  const events_page = document.querySelector("#events-page");

  const menulinks = document.querySelector(".navbar_nav");

  if (menu && menulinks) {
      menu.addEventListener("click", function () {
          menu.classList.toggle("is-active");
          menulinks.classList.toggle("active");
      });
  }

  // 🎯 Fix: Check if these elements exist before adding event listeners
  if (about_page) about_page.addEventListener("click", mobileMenu);
  if (service_page) service_page.addEventListener("click", mobileMenu);
  if (feature_page) feature_page.addEventListener("click", mobileMenu);
  if (events_page) events_page.addEventListener("click", mobileMenu);

  function mobileMenu() {
      if (menu && menulinks) {
          menu.classList.toggle("is-active");
          menulinks.classList.toggle("active");
      }
  }

  // Fix: Check if the animation class exists before adding an event
  const dotsAnimation = document.querySelector(".dots-animation");
  if (dotsAnimation) {
      dotsAnimation.addEventListener("click", function () {
          this.style.animationPlayState = "paused"; // Toggle pause
      });
  }

  // 📸 Printer Package Functionality
  const addPrinterBtn = document.getElementById("addPrinterBtn");
  let printerAdded = false;

  // Printer Add-on Logic
  if (addPrinterBtn) {
      addPrinterBtn.addEventListener("click", function () {
          const priceIncrease = 150; // Printer add-on price
          const packages = document.querySelectorAll(".pricing-card .price");
          const durationElements = document.querySelectorAll(".pricing-card .duration");
          const featureLists = document.querySelectorAll(".pricing-card .package-features");

          packages.forEach((priceElement, index) => {
              let basePrice = parseInt(priceElement.textContent.replace("$", ""));
              let newPrice = printerAdded ? basePrice - priceIncrease : basePrice + priceIncrease;

              // Update price
              priceElement.textContent = `$${newPrice}`;

              // Update duration text
              durationElements[index].textContent = printerAdded
                  ? durationElements[index].textContent.replace(" + Printer", "")
                  : durationElements[index].textContent + " + Printer";

              // Add or remove printer feature
              let featureList = featureLists[index];
              if (!printerAdded) {
                  let printerFeature = document.createElement("li");
                  printerFeature.textContent = "🖨 Includes Printed Photos";
                  printerFeature.classList.add("printer-added");
                  featureList.appendChild(printerFeature);
              } else {
                  let printerFeature = featureList.querySelector(".printer-added");
                  if (printerFeature) {
                      featureList.removeChild(printerFeature);
                  }
              }
          });

          // Toggle button text
          addPrinterBtn.textContent = printerAdded ? "Add to Package" : "Remove Printer";

          // Toggle state
          printerAdded = !printerAdded;
      });
  }

  // 📩 SMS DM Booking Functionality
  const bookNowButtons = document.querySelectorAll(".book-now-btn");
  const phoneNumber = "2017907108"; 

  bookNowButtons.forEach((button) => {
      button.addEventListener("click", function () {
          const packageCard = this.closest(".pricing-card");
          const packageName = packageCard.querySelector(".package-title").textContent;
          const packagePrice = packageCard.querySelector(".price").textContent;
          const duration = packageCard.querySelector(".duration").textContent;

          let message = `Hi SJ Photo Booth! I'm interested in booking the ${packageName} package (${packagePrice}) for ${duration}.`;

          // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        const smsLink = `sms:${phoneNumber}?&body=${encodedMessage}`;

        // Open SMS app with pre-filled message
        window.open(smsLink, "_blank");
      });
  });

  // ── Pricing card → contact form package pre-selection ──
  const bookBtns = document.querySelectorAll(".btn-book-preview[data-package]");
  const packageSelect = document.getElementById("cf-package");
  bookBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      if (packageSelect && this.dataset.package) {
        packageSelect.value = this.dataset.package;
      }
    });
  });

  const checkAvailabilityBtn = document.getElementById("checkAvailabilityBtn");
  if (checkAvailabilityBtn) {
    checkAvailabilityBtn.addEventListener("click", function () {
      window.open("https://calendar.google.com/calendar/u/2?cid=cGhvdG9ib290aHNqQGdtYWlsLmNvbQ", "_blank");
    });
  }

  // ── Scroll Reveal ──
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately if IntersectionObserver not supported
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // ── Animated Counter for Stats ──
  function animateCounter(el, target, duration) {
    const suffix = el.dataset.plus ? "+" : "";
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statsSection = document.getElementById("stats");
  if (statsSection && "IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          document.querySelectorAll(".stat-number[data-count]").forEach((el) => {
            animateCounter(el, parseInt(el.dataset.count, 10), 1600);
          });
          statsObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsSection);
  }

  // ── Contact Form — Formspree AJAX ──
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = this.querySelector(".btn-submit");
      const successMsg = document.getElementById("form-success");
      const errorMsg = document.getElementById("form-error");
      const originalText = submitBtn.textContent;

      submitBtn.textContent = "Sending…";
      submitBtn.disabled = true;
      errorMsg.style.display = "none";

      try {
        const response = await fetch(this.action, {
          method: "POST",
          body: new FormData(this),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          contactForm.style.display = "none";
          successMsg.classList.add("visible");
        } else {
          const data = await response.json();
          const msg = data.errors
            ? data.errors.map((err) => err.message).join(", ")
            : "Something went wrong. Please try again.";
          errorMsg.textContent = msg;
          errorMsg.style.display = "block";
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      } catch {
        errorMsg.textContent =
          "Network error. Please try again or reach us at photoboothsj@gmail.com.";
        errorMsg.style.display = "block";
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});
