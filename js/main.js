(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: false,
        loop: true,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });

    // ---------------------------------------------
    // EMI Calculator (Offcanvas)
    // ---------------------------------------------
    var offcanvasExists = document.getElementById('emiOffcanvas');
    if (offcanvasExists) {
        var amountRange = document.getElementById('emiAmountRange');
        var amountInput = document.getElementById('emiAmountInput');
        var rateRange = document.getElementById('emiRateRange');
        var rateInput = document.getElementById('emiRateInput');
        var tenureRange = document.getElementById('emiTenureRange');
        var tenureInput = document.getElementById('emiTenureInput');
        var tenureUnit = document.getElementById('emiTenureUnit');
        var tenureMonthsRadio = document.getElementById('emiTenureMonths');
        var tenureYearsRadio = document.getElementById('emiTenureYears');

        var monthlyEmiValue = document.getElementById('monthlyEmiValue');
        var principalValue = document.getElementById('principalValue');
        var interestValue = document.getElementById('interestValue');
        var totalPayableValue = document.getElementById('totalPayableValue');
        var typeTabs = document.getElementById('emiTypeTabs');

        var inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

        function formatINR(amount) {
            return inr.format(amount);
        }

        function parseAmountFromDisplay(value) {
            return Number(String(value).replace(/[^0-9.]/g, '')) || 0;
        }

        function getMonthsFromInputs() {
            var months;
            if (tenureYearsRadio.checked) {
                months = Math.max(1, Number(tenureInput.value || 0)) * 12;
            } else {
                months = Math.max(1, Number(tenureInput.value || 0));
            }
            return months;
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
                emi = principal * monthlyRate * factor / (factor - 1);
            }

            var totalPayment = emi * months;
            var interest = totalPayment - principal;

            // Update UI
            amountInput.value = formatINR(principal);
            rateInput.value = annualRatePercent + '%';
            monthlyEmiValue.textContent = formatINR(emi);
            principalValue.textContent = formatINR(principal);
            interestValue.textContent = formatINR(interest);
            totalPayableValue.textContent = formatINR(totalPayment);
        }

        // Sync handlers
        amountRange.addEventListener('input', function() {
            calculateAndRender();
        });

        rateRange.addEventListener('input', function() {
            calculateAndRender();
        });

        tenureRange.addEventListener('input', function() {
            tenureInput.value = tenureRange.value;
            calculateAndRender();
        });

        tenureInput.addEventListener('input', function() {
            var val = Number(tenureInput.value || 0);
            tenureRange.value = Math.max(1, val);
            calculateAndRender();
        });

        function switchToMonths() {
            tenureUnit.textContent = 'Months';
            tenureRange.min = 1;
            tenureRange.max = 360;
            tenureRange.step = 1;
            var months = getMonthsFromInputs();
            tenureInput.value = Math.max(1, Math.round(months));
            tenureRange.value = tenureInput.value;
            calculateAndRender();
        }

        function switchToYears() {
            tenureUnit.textContent = 'Years';
            tenureRange.min = 1;
            tenureRange.max = 40; // up to 40 years
            tenureRange.step = 1;
            var months = getMonthsFromInputs();
            var years = Math.max(1, Math.round(months / 12));
            tenureInput.value = years;
            tenureRange.value = years;
            calculateAndRender();
        }

        tenureMonthsRadio.addEventListener('change', function() {
            if (tenureMonthsRadio.checked) {
                switchToMonths();
            }
        });

        tenureYearsRadio.addEventListener('change', function() {
            if (tenureYearsRadio.checked) {
                switchToYears();
            }
        });

        // Loan type tabs: set defaults when switched
        if (typeTabs) {
            typeTabs.addEventListener('click', function(e) {
                if (e.target && (e.target.matches('button[data-loan-type]') || e.target.closest('button[data-loan-type]'))) {
                    var btn = e.target.closest('button[data-loan-type]');
                    var buttons = typeTabs.querySelectorAll('button[data-loan-type]');
                    buttons.forEach(function(b){ b.classList.remove('active'); });
                    btn.classList.add('active');

                    var type = btn.getAttribute('data-loan-type');
                    // Set sensible default rate/tenure ranges per type
                    if (type === 'home') {
                        rateRange.value = 8; // typical home loan
                        tenureMonthsRadio.checked = true; // months display
                        switchToYears(); // but set years defaults/limits
                        tenureYearsRadio.checked = true;
                        tenureInput.value = 20; // 20 years
                        tenureRange.value = 20;
                    } else if (type === 'personal') {
                        rateRange.value = 14;
                        tenureMonthsRadio.checked = true;
                        switchToMonths();
                        tenureInput.value = 36; // 3 years
                        tenureRange.value = 36;
                    } else if (type === 'business') {
                        rateRange.value = 12;
                        tenureMonthsRadio.checked = true;
                        switchToMonths();
                        tenureInput.value = 60; // 5 years
                        tenureRange.value = 60;
                    }
                    calculateAndRender();
                }
            });
        }
        

        // Initialize defaults
        tenureRange.value = tenureInput.value;
        calculateAndRender();
    }
    
})(jQuery);

