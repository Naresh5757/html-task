
// Page Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = e.target.getAttribute('data-page');
                showPage(pageId);
            });
        });

        // User action buttons
        document.getElementById('signup-btn').addEventListener('click', () => showPage('signup-page'));
        document.getElementById('login-btn').addEventListener('click', () => showPage('login-page'));
        document.getElementById('go-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            showPage('login-page');
        });
        document.getElementById('go-to-signup').addEventListener('click', (e) => {
            e.preventDefault();
            showPage('signup-page');
        });
        document.getElementById('continue-planning').addEventListener('click', () => showPage('destinations-page'));
        document.getElementById('explore-btn').addEventListener('click', () => showPage('destinations-page'));

        // Show page function
        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active-page');
            });
            document.getElementById(pageId).classList.add('active-page');
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector(`.nav-${pageId.split('-')[0]}`).classList.add('active');
            
            // Update cart if needed
            if (pageId === 'cart-page') {
                updateCartDisplay();
            }
        }

        // Cart functionality
        let cartItems = JSON.parse(localStorage.getItem('travelCart')) || [];
        
        // Add to cart functionality
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const name = button.getAttribute('data-name');
                const price = parseFloat(button.getAttribute('data-price'));
                
                // Check if item already in cart
                const existingItem = cartItems.find(item => item.id === id);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cartItems.push({
                        id,
                        name,
                        price,
                        quantity: 1
                    });
                }
                
                // Save to localStorage
                localStorage.setItem('travelCart', JSON.stringify(cartItems));
                
                alert(`${name} added to your trip!`);
                updateCartDisplay();
            });
        });

        // Update cart display
        function updateCartDisplay() {
            const container = document.getElementById('cart-items-container');
            container.innerHTML = '';
            
            if (cartItems.length === 0) {
                container.innerHTML = '<p class="text-center py-5">Your trip planner is empty. Start adding destinations!</p>';
                updateCartSummary(0, 0, 0);
                return;
            }
            
            let subtotal = 0;
            
            cartItems.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div class="item-image" style="background-image: url('https://images.unsplash.com/photo-${150000000 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');"></div>
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <div class="item-info">
                            <span class="price">$${item.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="item-actions">
                        <div class="quantity">
                            <button class="quantity-btn minus" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" data-index="${index}">+</button>
                        </div>
                        <button class="remove-btn" data-index="${index}">Remove</button>
                    </div>
                `;
                container.appendChild(itemElement);
            });
            
            // Calculate taxes and discount
            const taxes = subtotal * 0.1;
            const discount = subtotal > 3000 ? 150 : 0;
            const total = subtotal + taxes - discount;
            
            updateCartSummary(subtotal, taxes, discount, total);
            
            // Add event listeners to quantity buttons and remove buttons
            document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = btn.getAttribute('data-index');
                    if (cartItems[index].quantity > 1) {
                        cartItems[index].quantity -= 1;
                    } else {
                        cartItems.splice(index, 1);
                    }
                    localStorage.setItem('travelCart', JSON.stringify(cartItems));
                    updateCartDisplay();
                });
            });
            
            document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = btn.getAttribute('data-index');
                    cartItems[index].quantity += 1;
                    localStorage.setItem('travelCart', JSON.stringify(cartItems));
                    updateCartDisplay();
                });
            });
            
            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = btn.getAttribute('data-index');
                    cartItems.splice(index, 1);
                    localStorage.setItem('travelCart', JSON.stringify(cartItems));
                    updateCartDisplay();
                });
            });
        }
        
        function updateCartSummary(subtotal, taxes, discount, total) {
            document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('cart-taxes').textContent = `$${taxes.toFixed(2)}`;
            document.getElementById('cart-discount').textContent = `-$${discount.toFixed(2)}`;
            document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
        }

        // Form submission handlers
        document.getElementById('signup-submit').addEventListener('click', () => {
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirm = document.getElementById('signup-confirm').value;
            
            if (!name || !email || !password || !confirm) {
                alert('Please fill in all fields');
                return;
            }
            
            if (password !== confirm) {
                alert('Passwords do not match');
                return;
            }
            
            // Save user info (in a real app, this would be sent to a server)
            localStorage.setItem('travelUser', JSON.stringify({ name, email }));
            
            alert('Account created successfully! You can now log in.');
            showPage('login-page');
        });

        document.getElementById('login-submit').addEventListener('click', () => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // In a real app, this would check against a database
            const user = JSON.parse(localStorage.getItem('travelUser'));
            
            if (user && user.email === email) {
                alert('Login successful! Welcome back.');
                
                // Update UI for logged in user
                document.getElementById('login-btn').textContent = user.name;
                document.getElementById('signup-btn').textContent = 'Logout';
                
                // Change logout functionality
                document.getElementById('signup-btn').addEventListener('click', logoutUser);
                
                showPage('home-page');
            } else {
                alert('Invalid credentials. Please try again or sign up.');
            }
        });
        
        function logoutUser() {
            localStorage.removeItem('travelUser');
            document.getElementById('login-btn').textContent = 'Login';
            document.getElementById('signup-btn').textContent = 'Sign Up';
            document.getElementById('signup-btn').removeEventListener('click', logoutUser);
            document.getElementById('signup-btn').addEventListener('click', () => showPage('signup-page'));
            showPage('home-page');
        }
        
        // Check if user is already logged in
        if (localStorage.getItem('travelUser')) {
            const user = JSON.parse(localStorage.getItem('travelUser'));
            document.getElementById('login-btn').textContent = user.name;
            document.getElementById('signup-btn').textContent = 'Logout';
            document.getElementById('signup-btn').addEventListener('click', logoutUser);
        }

        // Checkout button
        document.querySelector('.checkout-btn').addEventListener('click', () => {
            if (cartItems.length === 0) {
                alert('Your cart is empty. Add some destinations first!');
                return;
            }
            
            alert('Booking completed! Thank you for choosing Wanderlust Travels.');
            
            // Clear cart
            cartItems = [];
            localStorage.removeItem('travelCart');
            updateCartDisplay();
            
            showPage('home-page');
        });

        // Initialize cart display
        updateCartDisplay();