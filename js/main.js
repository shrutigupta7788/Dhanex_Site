(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  // Initiate the wowjs
  new WOW().init();

  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".sticky-top").addClass("shadow-sm").css("top", "0px");
    } else {
      $(".sticky-top").removeClass("shadow-sm").css("top", "-100px");
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Facts counter
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 2000,
  });

  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    items: 1,
    dots: false,
    loop: true,
    nav: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
  });

  // ---------------------------------------------
  // EMI Calculator (Offcanvas)
  // ---------------------------------------------

  var offcanvasExists = document.getElementById("emiOffcanvas");
  if (offcanvasExists) {
    var amountRange = document.getElementById("emiAmountRange");
    var amountInput = document.getElementById("emiAmountInput");
    var rateRange = document.getElementById("emiRateRange");
    var rateInput = document.getElementById("emiRateInput");
    var tenureRange = document.getElementById("emiTenureRange");
    var tenureInput = document.getElementById("emiTenureInput");
    var tenureUnit = document.getElementById("emiTenureUnit"); // ✅ for months/years text
    var tenureMonthsRadio = document.getElementById("emiTenureMonths");
    var tenureYearsRadio = document.getElementById("emiTenureYears");

    var monthlyEmiValue = document.getElementById("monthlyEmiValue");
    var principalValue = document.getElementById("principalValue");
    var interestValue = document.getElementById("interestValue");
    var totalPayableValue = document.getElementById("totalPayableValue");
    var typeTabs = document.getElementById("emiTypeTabs");
    var calculateBtn = document.getElementById("calculateEmiBtn"); // ✅ Submit button

    var inr = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });

    function formatINR(amount) {
      return inr.format(amount);
    }

    function getMonthsFromInputs() {
      if (tenureYearsRadio.checked) {
        return Math.max(1, Number(tenureInput.value || 0)) * 12;
      } else {
        return Math.max(1, Number(tenureInput.value || 0));
      }
    }

    function calculateAndRender() {
      var principal = Number(amountRange.value);
      var annualRatePercent = Number(rateRange.value);
      var months = getMonthsFromInputs();

      var monthlyRate = annualRatePercent / 12 / 100;
      var emi = 0;

      if (monthlyRate === 0) {
        emi = principal / months;
      } else {
        var factor = Math.pow(1 + monthlyRate, months);
        emi = (principal * monthlyRate * factor) / (factor - 1);
      }

      var totalPayment = emi * months;
      var interest = totalPayment - principal;

      // ✅ Update UI
      amountInput.value = formatINR(principal);
      rateInput.value = annualRatePercent + "%";
      monthlyEmiValue.textContent = formatINR(emi);
      principalValue.textContent = formatINR(principal);
      interestValue.textContent = formatINR(interest);
      totalPayableValue.textContent = formatINR(totalPayment);
    }

    // 🔹 Sync Inputs with Sliders
    amountInput.addEventListener("input", function () {
      let val = this.value.replace(/[^0-9]/g, "");
      amountRange.value = val || 0;
    });

    rateInput.addEventListener("input", function () {
      let val = this.value.replace(/[^0-9.]/g, "");
      rateRange.value = val || 0;
    });

    tenureInput.addEventListener("input", function () {
      let val = this.value.replace(/[^0-9]/g, "");
      tenureRange.value = val || 0;
    });

    amountRange.addEventListener("input", function () {
      amountInput.value = this.value;
    });

    rateRange.addEventListener("input", function () {
      rateInput.value = this.value;
    });

    tenureRange.addEventListener("input", function () {
      tenureInput.value = this.value;
    });

    // ✅ Loan Type Tabs (Home / Personal / Business)
    if (typeTabs) {
      typeTabs.addEventListener("click", function (e) {
        if (
          e.target &&
          (e.target.matches("button[data-loan-type]") ||
            e.target.closest("button[data-loan-type]"))
        ) {
          var btn = e.target.closest("button[data-loan-type]");
          var buttons = typeTabs.querySelectorAll("button[data-loan-type]");
          buttons.forEach(function (b) {
            b.classList.remove("active");
          });
          btn.classList.add("active");

          var type = btn.getAttribute("data-loan-type");

          if (type === "home") {
            rateRange.value = 8;
            tenureYearsRadio.checked = true; // ✅ default in years
            tenureUnit.textContent = "Years";
            tenureInput.value = 20;
            tenureRange.value = 20;
          } else if (type === "personal") {
            rateRange.value = 14;
            tenureMonthsRadio.checked = true; // ✅ default in months
            tenureUnit.textContent = "Months";
            tenureInput.value = 36;
            tenureRange.value = 36;
          } else if (type === "business") {
            rateRange.value = 12;
            tenureMonthsRadio.checked = true; // ✅ default in months
            tenureUnit.textContent = "Months";
            tenureInput.value = 60;
            tenureRange.value = 60;
          }
        }
      });
    }

    // ✅ Months/Years switch
    tenureMonthsRadio.addEventListener("change", function () {
      if (tenureMonthsRadio.checked) {
        tenureUnit.textContent = "Months";
      }
    });

    tenureYearsRadio.addEventListener("change", function () {
      if (tenureYearsRadio.checked) {
        tenureUnit.textContent = "Years";
      }
    });

    // ✅ Submit button → Always calculate
    if (calculateBtn) {
      calculateBtn.addEventListener("click", function () {
        calculateAndRender();
      });
    }
  }
})(jQuery);
