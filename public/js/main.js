/**
 * Grandeur Keys - Core Frontend Controller
 * Apple-Inspired Responsive Interaction Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Transition Actions
    const menuToggle = document.getElementById('menuToggle');
    const headerNav = document.getElementById('headerNav');
    const body = document.body;

    if (menuToggle && headerNav) {
        menuToggle.addEventListener('click', () => {
            const isActive = headerNav.classList.toggle('active');
            menuToggle.classList.toggle('active');

            // Apply visual toggles for accessibility & structural bars
            menuToggle.setAttribute('aria-expanded', isActive);

            // Avoid background scrolling while full screen modal menu is active
            if (isActive) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
    }

    // 2. Translucent Navigation Scroll Controller
    const header = document.querySelector('.global-header');

    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.style.backgroundColor = 'rgba(5, 5, 5, 0.85)';
            header.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
            header.style.backdropFilter = 'blur(30px)';
        } else {
            header.style.backgroundColor = 'rgba(5, 5, 5, 0.5)';
            header.style.borderBottomColor = 'rgba(255, 255, 255, 0.03)';
            header.style.backdropFilter = 'blur(15px)';
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // 3. Dynamic Reservation Form Handler
    const resForm = document.getElementById('reservationForm');
    if (resForm) {
        resForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const reserveBtn = document.getElementById('reserveBtn');
            const originalBtnText = reserveBtn.innerHTML;
            reserveBtn.innerHTML = '<span>Processing...</span>';
            reserveBtn.disabled = true;

            const formData = {
                propertyId: document.getElementById('propertyId').value,
                checkIn: document.getElementById('checkIn').value,
                checkOut: document.getElementById('checkOut').value,
                guests: document.getElementById('guests').value,
                splitStay: document.getElementById('splitStay') ? document.getElementById('splitStay').checked : false
            };

            try {
                const response = await fetch('/api/booking', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to initialize booking.');
                }

                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                }
            } catch (err) {
                const errorBox = document.getElementById('bookingError');
                if (errorBox) {
                    errorBox.textContent = err.message;
                    errorBox.classList.remove('hidden');
                }
                reserveBtn.innerHTML = originalBtnText;
                reserveBtn.disabled = false;
            }
        });
        
        // Optional: Real-time pricing calculation
        const checkInInput = document.getElementById('checkIn');
        const checkOutInput = document.getElementById('checkOut');
        
        const calculatePrice = () => {
            if (checkInInput.value && checkOutInput.value) {
                const ci = new Date(checkInInput.value);
                const co = new Date(checkOutInput.value);
                if (co > ci) {
                    const nights = Math.ceil((co - ci) / (1000 * 3600 * 24));
                    const pricePerNight = parseFloat(resForm.getAttribute('data-price') || 0);
                    const currencySymbol = resForm.getAttribute('data-currency-symbol') || '$';
                    
                    const roomTotal = pricePerNight * nights;
                    const serviceFee = Math.round(roomTotal * 0.08);
                    const taxes = Math.round((roomTotal + serviceFee) * 0.12);
                    const grandTotal = roomTotal + serviceFee + taxes;

                    const format = (num) => `${currencySymbol}${num.toLocaleString()}`;

                    document.getElementById('nightsTally').innerText = `${format(pricePerNight)} x ${nights} ${nights === 1 ? 'night' : 'nights'}`;
                    document.getElementById('nightsCost').innerText = format(roomTotal);
                    document.getElementById('serviceFee').innerText = format(serviceFee);
                    document.getElementById('taxCost').innerText = format(taxes);
                    document.getElementById('totalCost').innerText = format(grandTotal);

                    const summary = document.getElementById('pricingSummary');
                    if (summary) summary.classList.remove('hidden');
                }
            }
        };
        
        checkInInput.addEventListener('change', calculatePrice);
        checkOutInput.addEventListener('change', calculatePrice);
        
        // Trigger price calculation on page load if dates are pre-filled
        calculatePrice();
    }

    // 4. Dynamic Payment Form Handler
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const payBtn = document.getElementById('paySubmitBtn');
            const btnText = payBtn.querySelector('.btn-text');
            const btnLoader = payBtn.querySelector('.btn-loader');
            
            // Visual loading state
            btnText.classList.add('hidden');
            btnLoader.classList.remove('hidden');
            payBtn.disabled = true;

            const cardHolder = document.getElementById('cardHolder').value;

            try {
                const response = await fetch('/checkout/pay', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cardHolder })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Transaction failed. Please try again.');
                }

                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                }
            } catch (err) {
                const errorBox = document.getElementById('paymentError');
                if (errorBox) {
                    errorBox.textContent = err.message;
                    errorBox.classList.remove('hidden');
                }
                btnText.classList.remove('hidden');
                btnLoader.classList.add('hidden');
                payBtn.disabled = false;
            }
        });
    }
});