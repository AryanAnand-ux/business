document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    const menuBtn = document.getElementById('menu-btn');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('#mobile-menu a');

    const focusableSelectors = 'a, button, [tabindex]:not([tabindex="-1"])';
    let lastFocusedEl = null;

    function getFocusableElements(container) {
        return Array.from(container.querySelectorAll(focusableSelectors))
            .filter(el => !el.hasAttribute('disabled'));
    }

    function trapFocus(container) {
        const focusables = getFocusableElements(container);
        if (focusables.length === 0) return () => {};
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        function handleTab(e) {
            if (e.key !== 'Tab') return;
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }

        container.addEventListener('keydown', handleTab);
        return () => container.removeEventListener('keydown', handleTab);
    }

    let removeMenuTrap = null;
    let removeLightboxTrap = null;

    function toggleMenu() {
        const isClosed = mobileMenu.classList.contains('mobile-menu-closed');
        
        if (isClosed) {
            mobileMenu.classList.remove('mobile-menu-closed');
            mobileMenu.classList.add('mobile-menu-open');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            menuBtn.setAttribute('aria-expanded', 'true');
            lastFocusedEl = document.activeElement;
            const focusables = getFocusableElements(mobileMenu);
            if (focusables.length > 0) focusables[0].focus();
            if (removeMenuTrap) removeMenuTrap();
            removeMenuTrap = trapFocus(mobileMenu);
        } else {
            mobileMenu.classList.remove('mobile-menu-open');
            mobileMenu.classList.add('mobile-menu-closed');
            document.body.style.overflow = 'auto';
            menuBtn.setAttribute('aria-expanded', 'false');
            if (removeMenuTrap) removeMenuTrap();
            removeMenuTrap = null;
            if (lastFocusedEl) lastFocusedEl.focus();
        }
    }

    menuBtn.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => link.addEventListener('click', () => {
        mobileMenu.classList.remove('mobile-menu-open');
        mobileMenu.classList.add('mobile-menu-closed');
        document.body.style.overflow = 'auto';
        menuBtn.setAttribute('aria-expanded', 'false');
        if (removeMenuTrap) removeMenuTrap();
        removeMenuTrap = null;
        if (lastFocusedEl) lastFocusedEl.focus();
    }));

    // Scroll Reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Navbar Logic
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('glass-nav', 'py-2');
            navbar.classList.remove('py-4');
        } else {
            navbar.classList.remove('glass-nav', 'py-2');
            navbar.classList.add('py-4');
        }
    });

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const closeBtn = document.getElementById('lightbox-close');

    galleryItems.forEach(img => {
        img.parentElement.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.remove('hidden');
            // Subtle animation for opening
            requestAnimationFrame(() => {
                lightbox.classList.add('opacity-100');
            });
            document.body.style.overflow = 'hidden';
            lastFocusedEl = document.activeElement;
            closeBtn.focus();
            if (removeLightboxTrap) removeLightboxTrap();
            removeLightboxTrap = trapFocus(lightbox);
        });
    });

    const hideLightbox = () => {
        lightbox.classList.add('hidden');
        lightbox.classList.remove('opacity-100');
        document.body.style.overflow = 'auto';
        if (removeLightboxTrap) removeLightboxTrap();
        removeLightboxTrap = null;
        if (lastFocusedEl) lastFocusedEl.focus();
    };

    closeBtn.addEventListener('click', hideLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) hideLightbox();
    });
    
    // Keydown support for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!lightbox.classList.contains('hidden')) hideLightbox();
            if (mobileMenu.classList.contains('mobile-menu-open')) toggleMenu();
        }
    });
});
