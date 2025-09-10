// Gestion du thème et des animations
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const themeText = themeToggle.querySelector('.theme-text');
    const body = document.body;
    const productCards = document.querySelectorAll('.product-card');
    
    // Nouveaux éléments
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const cartFloating = document.getElementById('cartFloating');
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const closeCart = document.getElementById('closeCart');
    const productModal = document.getElementById('productModal');
    const closeModal = document.getElementById('closeModal');
    
    // État du thème
    let isDarkTheme = false;
    
    // État du panier
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Initialisation du thème
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            isDarkTheme = true;
            applyDarkTheme();
        } else {
            isDarkTheme = false;
            applyLightTheme();
        }
    }
    
    // Application du thème sombre
    function applyDarkTheme() {
        body.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Mode clair';
        isDarkTheme = true;
        localStorage.setItem('theme', 'dark');
    }
    
    // Application du thème clair
    function applyLightTheme() {
        body.setAttribute('data-theme', 'light');
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Mode sombre';
        isDarkTheme = false;
        localStorage.setItem('theme', 'light');
    }
    
    // Basculement de thème
    function toggleTheme() {
        if (isDarkTheme) {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
        
        // Animation du bouton
        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Event listener pour le basculeur de thème
    themeToggle.addEventListener('click', toggleTheme);
    
    // Animations des cartes de produits
    function animateCards() {
        productCards.forEach((card, index) => {
            // Animation d'entrée avec délai
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
            
            // Effet de survol amélioré
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                
                // Animation du titre
                const title = this.querySelector('.product-title');
                title.style.color = 'var(--primary-color)';
                
                // Animation de l'image
                const img = this.querySelector('.card-image img');
                img.style.transform = 'scale(1.1)';
                
                // Animation du bouton "Ajouter au panier"
                const addBtn = this.querySelector('.add-to-cart');
                addBtn.style.transform = 'translateY(-2px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                
                // Reset du titre
                const title = this.querySelector('.product-title');
                title.style.color = '';
                
                // Reset de l'image
                const img = this.querySelector('.card-image img');
                img.style.transform = 'scale(1)';
                
                // Reset du bouton
                const addBtn = this.querySelector('.add-to-cart');
                addBtn.style.transform = 'translateY(0)';
            });
        });
    }
    
    // Gestion des boutons "Ajouter au panier"
    function handleAddToCart() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Récupération de la carte produit
                const card = this.closest('.product-card');
                const productId = card.dataset.product;
                
                // Animation de clic
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Ajouter au panier
                addToCart(productId);
                
                // Changement temporaire du texte
                const originalText = this.textContent;
                this.textContent = 'Ajouté !';
                this.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
                
                // Animation de confirmation
                this.style.animation = 'pulse 0.6s ease-in-out';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                    this.style.animation = '';
                }, 2000);
                
                // Effet de particules (simulation)
                createParticleEffect(this);
            });
        });
    }
    
    // Effet de particules pour les boutons
    function createParticleEffect(button) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = 'var(--primary-color)';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            
            document.body.appendChild(particle);
            
            // Animation de la particule
            const angle = (i / 6) * Math.PI * 2;
            const distance = 50;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;
            
            particle.animate([
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).onfinish = () => {
                particle.remove();
            };
        }
    }
    
    // Gestion des boutons "Voir détails"
    function handleViewDetails() {
        const viewButtons = document.querySelectorAll('.view-btn');
        
        viewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Animation de clic sur le bouton
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Récupération de la carte produit
                const card = this.closest('.product-card');
                const productId = card.dataset.product;
                
                // Animation d'agrandissement + ouverture de la modal
                animateProductZoomSimple(card, productId);
                setTimeout(() => {
                    showProductDetails(productId);
                }, 1000);
            });
        });
    }
    
    // Animation d'agrandissement simplifiée
    function animateProductZoomSimple(card, productId) {
        console.log('Animation démarrée pour le produit', productId);
        
        // Sauvegarde des styles originaux
        const originalTransform = card.style.transform;
        const originalBoxShadow = card.style.boxShadow;
        const originalZIndex = card.style.zIndex;
        const originalTransition = card.style.transition;
        
        // Désactiver temporairement les transitions CSS existantes
        card.style.transition = 'none';
        
        // Phase 1: Agrandissement immédiat et très visible
        card.style.transform = 'scale(1.6) translateY(-80px) rotateY(15deg)';
        card.style.boxShadow = '0 60px 120px -20px rgba(0, 0, 0, 0.6)';
        card.style.zIndex = '1000';
        card.style.position = 'relative';
        
        // Effet de particules
        createZoomParticles(card);
        
        // Phase 2: Animation de retour avec transition
        setTimeout(() => {
            card.style.transition = 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Animation de retour progressive
            setTimeout(() => {
                card.style.transform = 'scale(1.2) translateY(-30px) rotateY(5deg)';
                card.style.boxShadow = '0 30px 60px -10px rgba(0, 0, 0, 0.3)';
                
                // Phase 3: Retour final
                setTimeout(() => {
                    card.style.transform = originalTransform;
                    card.style.boxShadow = originalBoxShadow;
                    card.style.zIndex = originalZIndex;
                    card.style.transition = originalTransition;
                }, 800);
            }, 400);
        }, 100);
        
        // Message de notification
        setTimeout(() => {
            showNotification(`✨ Détails du produit ${productId} - Animation spectaculaire !`);
        }, 600);
    }
    
    // Animation d'agrandissement du produit
    function animateProductZoom(card, productId) {
        // Désactiver les transitions CSS existantes temporairement
        card.style.transition = 'none';
        
        // Sauvegarde des styles originaux
        const originalTransform = card.style.transform;
        const originalZIndex = card.style.zIndex;
        const originalBoxShadow = card.style.boxShadow;
        
        // Configuration de l'animation
        card.style.zIndex = '1000';
        card.style.position = 'relative';
        
        // Phase 1: Agrandissement initial (immédiat)
        card.style.transform = 'scale(1.1) translateY(-20px)';
        card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        
        // Réactiver les transitions pour l'animation
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Phase 2: Agrandissement maximal
            setTimeout(() => {
                card.style.transform = 'scale(1.3) translateY(-40px) rotateY(8deg)';
                card.style.boxShadow = '0 40px 80px -12px rgba(0, 0, 0, 0.4)';
                
                // Effet de particules autour de la carte
                createZoomParticles(card);
                
                // Phase 3: Retour progressif
                setTimeout(() => {
                    card.style.transform = 'scale(1.1) translateY(-20px) rotateY(0deg)';
                    card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                    
                    // Phase 4: Retour final
                    setTimeout(() => {
                        card.style.transform = originalTransform;
                        card.style.zIndex = originalZIndex;
                        card.style.boxShadow = originalBoxShadow;
                        card.style.transition = '';
                    }, 600);
                }, 800);
            }, 300);
        }, 50);
        
        // Message de notification avec délai
        setTimeout(() => {
            showNotification(`✨ Détails du produit ${productId} - Animation terminée !`);
        }, 1500);
    }
    
    // Création de particules autour de la carte agrandie
    function createZoomParticles(card) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Création de 12 particules plus visibles
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.width = '10px';
            particle.style.height = '10px';
            particle.style.background = `hsl(${i * 30}, 70%, 60%)`;
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '999';
            particle.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.8)';
            particle.style.border = '2px solid white';
            
            document.body.appendChild(particle);
            
            // Animation de la particule plus spectaculaire
            const angle = (i / 12) * Math.PI * 2;
            const distance = 120 + Math.random() * 40;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;
            
            particle.animate([
                {
                    transform: 'translate(0, 0) scale(1) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translate(${endX - centerX}px, ${endY - centerY}px) scale(0.2) rotate(360deg)`,
                    opacity: 0
                }
            ], {
                duration: 1500,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).onfinish = () => {
                particle.remove();
            };
        }
        
        // Ajouter un effet de flash
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.left = centerX - 50 + 'px';
        flash.style.top = centerY - 50 + 'px';
        flash.style.width = '100px';
        flash.style.height = '100px';
        flash.style.background = 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)';
        flash.style.borderRadius = '50%';
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '998';
        
        document.body.appendChild(flash);
        
        flash.animate([
            {
                transform: 'scale(0)',
                opacity: 1
            },
            {
                transform: 'scale(2)',
                opacity: 0
            }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => {
            flash.remove();
        };
    }
    
    // Système de notifications
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.background = 'var(--card-bg)';
        notification.style.color = 'var(--text-primary)';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = 'var(--border-radius)';
        notification.style.boxShadow = 'var(--shadow-hover)';
        notification.style.zIndex = '1000';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'transform 0.3s ease';
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Suppression après 3 secondes
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Animation de chargement de la page
    function pageLoadAnimation() {
        // Fade in du body
        body.style.opacity = '0';
        body.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            body.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            body.style.opacity = '1';
            body.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // ===== NOUVELLES FONCTIONNALITÉS =====
    
    // Système de recherche et filtres
    function initSearchAndFilters() {
        searchInput.addEventListener('input', filterProducts);
        categoryFilter.addEventListener('change', filterProducts);
        priceFilter.addEventListener('change', filterProducts);
    }
    
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedPrice = priceFilter.value;
        
        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const description = card.querySelector('.product-description').textContent.toLowerCase();
            const category = card.dataset.category;
            const price = parseInt(card.dataset.price);
            
            let showCard = true;
            
            // Filtre par recherche
            if (searchTerm && !title.includes(searchTerm) && !description.includes(searchTerm)) {
                showCard = false;
            }
            
            // Filtre par catégorie
            if (selectedCategory && category !== selectedCategory) {
                showCard = false;
            }
            
            // Filtre par prix
            if (selectedPrice) {
                const [min, max] = selectedPrice.split('-').map(p => p === '+' ? Infinity : parseInt(p));
                if (price < min || (max && price > max)) {
                    showCard = false;
                }
            }
            
            // Afficher/masquer la carte
            if (showCard) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Système de favoris
    function initFavorites() {
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        
        favoriteButtons.forEach(button => {
            const card = button.closest('.product-card');
            const productId = card.dataset.product;
            
            // Vérifier si le produit est en favori et mettre à jour l'affichage
            updateFavoriteButton(button, productId);
            
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleFavorite(productId, button);
            });
        });
    }
    
    function updateFavoriteButton(button, productId) {
        if (favorites.includes(productId)) {
            button.classList.add('active');
            button.textContent = '❤️';
            button.dataset.favorite = 'true';
        } else {
            button.classList.remove('active');
            button.textContent = '🤍';
            button.dataset.favorite = 'false';
        }
    }
    
    function toggleFavorite(productId, button) {
        const wasFavorite = favorites.includes(productId);
        
        if (wasFavorite) {
            favorites = favorites.filter(id => id !== productId);
            showNotification('Retiré des favoris');
        } else {
            favorites.push(productId);
            showNotification('Ajouté aux favoris !');
        }
        
        // Mettre à jour l'affichage du bouton
        updateFavoriteButton(button, productId);
        
        // Sauvegarder dans localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    // Système de panier amélioré
    function initCart() {
        updateCartDisplay();
        
        cartFloating.addEventListener('click', () => {
            cartModal.classList.add('active');
        });
        
        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });
        
        // Fermer la modal en cliquant à l'extérieur
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });
    }
    
    function addToCart(productId) {
        const card = document.querySelector(`[data-product="${productId}"]`);
        const title = card.querySelector('.product-title').textContent;
        const price = parseInt(card.dataset.price);
        const image = card.querySelector('img').src;
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                title: title,
                price: price,
                image: image,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        showNotification(`${title} ajouté au panier !`);
    }
    
    function updateCartDisplay() {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        cartTotal.textContent = `${totalPrice}€`;
        cartTotalPrice.textContent = `${totalPrice}€`;
        
        // Mettre à jour l'affichage des articles
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${item.price}€</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Fonction globale pour les boutons de quantité
    window.updateQuantity = function(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    };
    
    // Modal de détails produit
    function initProductModal() {
        closeModal.addEventListener('click', () => {
            productModal.classList.remove('active');
        });
        
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                productModal.classList.remove('active');
            }
        });
    }
    
    function showProductDetails(productId) {
        const card = document.querySelector(`[data-product="${productId}"]`);
        const title = card.querySelector('.product-title').textContent;
        const description = card.querySelector('.product-description').textContent;
        const price = card.dataset.price;
        const image = card.querySelector('img').src;
        const category = card.dataset.category;
        const brand = card.dataset.brand;
        const rating = card.querySelector('.rating-text').textContent;
        
        const modalContent = document.getElementById('modalProductInfo');
        modalContent.innerHTML = `
            <div class="modal-product-image">
                <img src="${image}" alt="${title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 12px;">
            </div>
            <div class="modal-product-details" style="padding: 2rem;">
                <h2 style="margin-bottom: 1rem; color: var(--text-primary);">${title}</h2>
                <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                    <span style="background: var(--primary-color); color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem;">${category}</span>
                    <span style="background: var(--secondary-color); color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem;">${brand}</span>
                </div>
                <p style="color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.6;">${description}</p>
                <div style="margin-bottom: 1rem;">
                    <span style="font-size: 1.2rem; margin-right: 1rem;">⭐⭐⭐⭐⭐</span>
                    <span style="color: var(--text-secondary);">${rating}</span>
                </div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color); margin-bottom: 2rem;">${price}€</div>
                <button class="add-to-cart" onclick="addToCart('${productId}'); productModal.classList.remove('active');" style="width: 100%; padding: 1rem; font-size: 1.1rem;">Ajouter au panier</button>
            </div>
        `;
        
        productModal.classList.add('active');
    }
    
    // Initialisation
    function init() {
        initTheme();
        animateCards();
        handleAddToCart();
        handleViewDetails();
        pageLoadAnimation();
        initSearchAndFilters();
        initFavorites();
        initCart();
        initProductModal();
    }
    
    // Lancement de l'initialisation
    init();
    
    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        // Recalcul des animations si nécessaire
        productCards.forEach(card => {
            card.style.transition = 'none';
            setTimeout(() => {
                card.style.transition = '';
            }, 100);
        });
    });
    
    // Animation CSS pour le pulse
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
});
