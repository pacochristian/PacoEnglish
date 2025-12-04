document.addEventListener('DOMContentLoaded', () => {
                // Get references to the key elements
                const menuToggle = document.querySelector('.menu-toggle');
                const navbar = document.getElementById('navbar');
                const mobileBreakpoint = 1030; // Matches the CSS media query

                // 1. Logic for clicking the menu toggle button
                menuToggle.addEventListener('click', (event) => {
                    // FIX: Ensure stopPropagation() is present to prevent the document click listener from firing immediately.
                    event.stopPropagation(); 
                    navbar.classList.toggle('active');
                    // NEW: Toggle 'is-active' class on the menu toggle for the CSS 'X' animation
                    menuToggle.classList.toggle('is-active'); 
                });

                // 2. Logic for clicking anywhere else on the document (Outside Click Handler)
                document.addEventListener('click', (event) => {
                    // Check if the menu is open AND we are in the mobile view
                    if (navbar.classList.contains('active') && window.innerWidth <= mobileBreakpoint) {
                        
                        // Check if the click originated inside the menu itself or on the toggle button
                        const isClickInsideMenuArea = navbar.contains(event.target) || menuToggle.contains(event.target);

                        // If the click is outside both elements, close the menu
                        if (!isClickInsideMenuArea) {
                            navbar.classList.remove('active');
                            // NEW: Remove 'is-active' class when closing from outside click
                            menuToggle.classList.remove('is-active'); 
                        }
                    }
                });

                // 3. Close menu if the user resizes to desktop view
                // FIX: This listener must be defined ONCE when the DOM loads, not on every click.
                window.addEventListener('resize', () => {
                    if (window.innerWidth > mobileBreakpoint && navbar.classList.contains('active')) {
                        navbar.classList.remove('active');
                        // NEW: Remove 'is-active' class when closing on resize
                        menuToggle.classList.remove('is-active');
                    }
                });
            });