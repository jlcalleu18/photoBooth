/* ===============================
   SJ Photo Booth — Main Script
   Last updated: 2025-11-08
   Notes:
   - Safe event bindings (null checks)
   - One-tap Book Now (WhatsApp on mobile, SMS on desktop)
   - Smooth in-page nav + lazy image reveal
   - Respects reduced motion
   =============================== */
(function () {
  'use strict';

  var PHONE = '12017907108'; // E.164 without '+' for wa.me, will add for sms

  // Helper: detect mobile devices
  function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  // Helper: prefer-reduced-motion
  var prefersReduced = false;
  try {
    prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch(e) { /* no-op */ }

  // 1) Check Availability button -> open Google Calendar (if present)
  var availBtn = document.getElementById('checkAvailabilityBtn');
  if (availBtn) {
    availBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.open('https://calendar.google.com/calendar/u/2?cid=cGhvdG9ib290aHNqQGdtYWlsLmNvbQ', '_blank', 'noopener');
    });
  }

  // 2) Book Now buttons -> WhatsApp (mobile) or SMS (desktop)
  function bindBookButtons(root) {
    root = root || document;
    var btns = root.querySelectorAll('.book-now');
    if (!btns.length) return;
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.pricing-card') || document;
        var pkg = card.querySelector('.package-title') ? card.querySelector('.package-title').textContent.trim() : 'Photo Booth';
        var dur = card.querySelector('.duration') ? card.querySelector('.duration').textContent.trim() : '';
        var msg = encodeURIComponent('Hi SJ Photo Booth! I\'m interested in the ' + pkg + (dur ? (' for ' + dur) : '') + '. Is ' + new Date().toLocaleDateString() + ' available?');
        var wa = 'https://wa.me/' + PHONE + '?text=' + msg;
        var sms = 'sms:+1' + PHONE + '?&body=' + msg;
        window.open(isMobile() ? wa : sms, '_blank', 'noopener');
      });
    });
  }
  bindBookButtons(document);

  // 3) Smooth scroll for internal nav links
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    history.pushState(null, '', id);
  });

  // 4) Lazy image reveal (works with loading="lazy")
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('lazy-visible');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '100px 0px' });
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) { io.observe(img); });
  } else {
    // Fallback: reveal after load
    document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
      img.addEventListener('load', function () { img.classList.add('lazy-visible'); });
    });
  }

  // 5) Close collapsed navbar after click (mobile UX)
  document.addEventListener('click', function (e) {
    var link = e.target.closest('.navbar-nav .nav-link');
    var nav = document.getElementById('mainNav');
    if (link && nav && nav.classList.contains('show')) {
      // Bootstrap 4 collapse
      $('.navbar-collapse').collapse('hide');
    }
  });

})();

/* Keep any existing project code below (with safeguards added) */
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

          let message = `Hi SJ Photo Booth! I'm interested in booking the ${packageName} package for ${duration}.`;

          // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        const smsLink = `sms:${phoneNumber}?&body=${encodedMessage}`;

        // Open SMS app with pre-filled message
        window.open(smsLink, "_blank");
      });
  });

  document.getElementById("checkAvailabilityBtn").addEventListener("click", function () {
    // Replace with your Google Calendar public link
    window.open("https://calendar.google.com/calendar/u/2?cid=cGhvdG9ib290aHNqQGdtYWlsLmNvbQ", "_blank");
});
});

