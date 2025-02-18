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
});
