// ==========================================
// SUPABASE CONNECTION
// ==========================================

const SUPABASE_URL =
    "https://qupnfqtnlcwsdrtfyopz.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_k4hnl8V7V5Z0KtQOJHWNLA_bcIldGj_";

const supabaseClient =
    typeof supabase !== "undefined"
        ? supabase.createClient(
              SUPABASE_URL,
              SUPABASE_PUBLISHABLE_KEY
          )
        : null;


// ==========================================
// DOM CONTENT LOADED
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    replaceFeatherIcons();
    initScrollHeader();
    initMobileNav();
    initCart();
    initFilters();
    initSearch();
    initLoginForm();
    initCheckout();
    displayCart();
    updateCartCount();

});


// ==========================================
// FEATHER ICONS
// ==========================================

function replaceFeatherIcons() {

    if (typeof feather !== "undefined") {
        feather.replace();
    }

}


// ==========================================
// SCROLL HEADER
// ==========================================

function initScrollHeader() {

    const header =
        document.querySelector(".header");

    if (!header) {
        return;
    }

    function updateHeader() {

        if (window.scrollY > 20) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }

    window.addEventListener(
        "scroll",
        updateHeader
    );

    updateHeader();

}


// ==========================================
// MOBILE NAVIGATION
// ==========================================

function initMobileNav() {

    const menuToggle =
        document.getElementById("menuToggle");

    const navLinks =
        document.getElementById("navLinks");

    if (!menuToggle || !navLinks) {
        return;
    }

    function updateMenuIcon(iconName) {

        menuToggle.innerHTML = `
            <i data-feather="${iconName}"></i>
        `;

        replaceFeatherIcons();

    }

    function closeMenu() {

        navLinks.classList.remove("active");

        updateMenuIcon("menu");

    }

    menuToggle.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            navLinks.classList.toggle("active");

            const isOpen =
                navLinks.classList.contains("active");

            updateMenuIcon(
                isOpen ? "x" : "menu"
            );

        }
    );

    navLinks
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                closeMenu
            );

        });

    document.addEventListener(
        "click",
        event => {

            if (
                navLinks.classList.contains("active") &&
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {

                closeMenu();

            }

        }
    );

}


// ==========================================
// GET CART
// ==========================================

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem("shopEaseCart")
        ) || [];

    } catch (error) {

        console.error(
            "Cart read error:",
            error
        );

        return [];

    }

}


// ==========================================
// SAVE CART
// ==========================================

function saveCart(cart) {

    localStorage.setItem(
        "shopEaseCart",
        JSON.stringify(cart)
    );

}


// ==========================================
// GET PRODUCT PRICE
// ==========================================

function getProductPrice(priceText) {

    return Number(
        priceText
            .replace("₹", "")
            .replace("$", "")
            .replace(/,/g, "")
            .trim()
    );

}


// ==========================================
// UPDATE CART COUNT
// ==========================================

function updateCartCount() {

    const cart = getCart();

    const cartCount = cart.reduce(
        (total, product) => {

            return (
                total +
                Number(product.quantity || 0)
            );

        },
        0
    );

    document
        .querySelectorAll(".cart-count")
        .forEach(badge => {

            badge.textContent = cartCount;

        });

}


// ==========================================
// INITIALIZE CART
// ==========================================

function initCart() {

    const addToCartButtons =
        document.querySelectorAll(
            ".add-to-cart-btn"
        );

    addToCartButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const productCard =
                    button.closest(".product-card");

                if (!productCard) {
                    return;
                }

                const titleElement =
                    productCard.querySelector(
                        ".product-title"
                    );

                const priceElement =
                    productCard.querySelector(
                        ".product-price"
                    );

                const categoryElement =
                    productCard.querySelector(
                        ".product-category"
                    );

                const imageElement =
                    productCard.querySelector(
                        ".product-img"
                    );

                if (
                    !titleElement ||
                    !priceElement
                ) {
                    return;
                }

                const title =
                    titleElement.textContent.trim();

                const price =
                    getProductPrice(
                        priceElement.textContent
                    );

                const category =
                    categoryElement
                        ? categoryElement.textContent.trim()
                        : "Product";

                const image =
                    imageElement
                        ? imageElement.getAttribute("src")
                        : "";

                if (Number.isNaN(price)) {

                    console.error(
                        "Invalid product price."
                    );

                    return;

                }

                const cart = getCart();

                const existingProduct =
                    cart.find(product => {

                        return product.title === title;

                    });

                if (existingProduct) {

                    existingProduct.quantity += 1;

                } else {

                    cart.push({

                        title: title,
                        price: price,
                        category: category,
                        image: image,
                        quantity: 1

                    });

                }

                saveCart(cart);

                updateCartCount();

                animateCartBadge();

                showAddedButton(button);

            }
        );

    });

}


// ==========================================
// CART BADGE ANIMATION
// ==========================================

function animateCartBadge() {

    document
        .querySelectorAll(".cart-count")
        .forEach(badge => {

            badge.style.transform =
                "scale(1.4)";

            setTimeout(() => {

                badge.style.transform =
                    "scale(1)";

            }, 200);

        });

}


// ==========================================
// ADD BUTTON ANIMATION
// ==========================================

function showAddedButton(button) {

    button.innerHTML = `
        <i data-feather="check"></i>
    `;

    button.style.background =
        "var(--gradient-accent)";

    button.style.color = "#ffffff";

    replaceFeatherIcons();

    setTimeout(() => {

        button.innerHTML = `
            <i data-feather="plus"></i>
        `;

        button.style.background = "";

        button.style.color = "";

        replaceFeatherIcons();

    }, 1000);

}


// ==========================================
// DISPLAY CART
// ==========================================

function displayCart() {

    const cartContainer =
        document.getElementById("cartItems");

    if (!cartContainer) {
        return;
    }

    const cart = getCart();

    cartContainer.innerHTML = "";

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">

                <i data-feather="shopping-cart"></i>

                <h2>Your cart is empty</h2>

                <p>
                    Add some products and they will
                    appear here.
                </p>

                <a
                    href="shop.html"
                    class="btn btn-primary"
                >
                    Continue Shopping
                </a>

            </div>
        `;

        updateCartSummary();

        replaceFeatherIcons();

        return;

    }

    cart.forEach((product, index) => {

        const cartItem =
            document.createElement("article");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div class="cart-item-image">

                ${
                    product.image
                        ? `
                            <img
                                src="${product.image}"
                                alt="${product.title}"
                            >
                        `
                        : `
                            <i data-feather="image"></i>
                        `
                }

            </div>

            <div class="cart-item-info">

                <span class="cart-item-category">
                    ${product.category}
                </span>

                <h3 class="cart-item-title">
                    ${product.title}
                </h3>

                <span class="cart-item-price">
                    ₹${Number(product.price).toFixed(2)}
                </span>

            </div>

            <div class="cart-item-actions">

                <div class="quantity-control">

                    <button
                        class="quantity-btn"
                        type="button"
                        onclick="changeQuantity(${index}, -1)"
                    >
                        <i data-feather="minus"></i>
                    </button>

                    <span class="quantity-value">
                        ${product.quantity}
                    </span>

                    <button
                        class="quantity-btn"
                        type="button"
                        onclick="changeQuantity(${index}, 1)"
                    >
                        <i data-feather="plus"></i>
                    </button>

                </div>

                <button
                    class="remove-cart-btn"
                    type="button"
                    onclick="removeCartItem(${index})"
                >

                    <i data-feather="trash-2"></i>

                    Remove

                </button>

            </div>
        `;

        cartContainer.appendChild(cartItem);

    });

    updateCartSummary();

    replaceFeatherIcons();

}


// ==========================================
// CHANGE QUANTITY
// ==========================================

function changeQuantity(index, amount) {

    const cart = getCart();

    if (!cart[index]) {
        return;
    }

    cart[index].quantity =
        Number(cart[index].quantity) + amount;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    saveCart(cart);

    displayCart();

    updateCartCount();

}


// ==========================================
// REMOVE CART PRODUCT
// ==========================================

function removeCartItem(index) {

    const cart = getCart();

    if (!cart[index]) {
        return;
    }

    cart.splice(index, 1);

    saveCart(cart);

    displayCart();

    updateCartCount();

}


// ==========================================
// UPDATE CART SUMMARY
// ==========================================

function updateCartSummary() {

    const cart = getCart();

    const subtotal = cart.reduce(
        (total, product) => {

            return (
                total +
                Number(product.price) *
                Number(product.quantity)
            );

        },
        0
    );

    const shipping = 0;

    const total =
        subtotal + shipping;

    const subtotalElement =
        document.getElementById("subtotal");

    const shippingElement =
        document.getElementById("shipping");

    const totalElement =
        document.getElementById("total");

    if (subtotalElement) {

        subtotalElement.textContent =
            `₹${subtotal.toFixed(2)}`;

    }

    if (shippingElement) {

        shippingElement.textContent =
            shipping === 0
                ? "Free"
                : `₹${shipping.toFixed(2)}`;

    }

    if (totalElement) {

        totalElement.textContent =
            `₹${total.toFixed(2)}`;

    }

}


// ==========================================
// FILTER PRODUCTS
// ==========================================

function initFilters() {

    const filterSidebar =
        document.querySelector(
            ".filters-sidebar"
        );

    const productCards =
        document.querySelectorAll(
            ".product-card"
        );

    if (
        !filterSidebar ||
        productCards.length === 0
    ) {
        return;
    }

    const checkboxes =
        filterSidebar.querySelectorAll(
            'input[type="checkbox"]'
        );

    checkboxes.forEach(checkbox => {

        checkbox.addEventListener(
            "change",
            filterProducts
        );

    });

    function filterProducts() {

        const selectedCategories = [];

        const selectedPrices = [];

        checkboxes.forEach(checkbox => {

            if (!checkbox.checked) {
                return;
            }

            const labelElement =
                checkbox.closest("label");

            if (!labelElement) {
                return;
            }

            const label =
                labelElement.textContent.trim();

            if (
                label.includes("₹") ||
                label.includes("$") ||
                label.toLowerCase().includes("under")
            ) {

                selectedPrices.push(label);

            } else {

                selectedCategories.push(
                    label.toLowerCase()
                );

            }

        });

        productCards.forEach(card => {

            const categoryElement =
                card.querySelector(
                    ".product-category"
                );

            const priceElement =
                card.querySelector(
                    ".product-price"
                );

            if (
                !categoryElement ||
                !priceElement
            ) {
                return;
            }

            const category =
                categoryElement
                    .textContent
                    .trim()
                    .toLowerCase();

            const price =
                getProductPrice(
                    priceElement.textContent
                );

            const categoryMatch =
                selectedCategories.length === 0 ||
                selectedCategories.includes(category);

            const priceMatch =
                selectedPrices.length === 0 ||
                selectedPrices.some(range => {

                    const cleanRange =
                        range
                            .replace(/₹/g, "")
                            .replace(/\$/g, "")
                            .replace(/,/g, "");

                    const numbers =
                        cleanRange.match(
                            /\d+(\.\d+)?/g
                        );

                    if (!numbers) {
                        return true;
                    }

                    const values =
                        numbers.map(Number);

                    if (
                        cleanRange
                            .toLowerCase()
                            .includes("under")
                    ) {

                        return price < values[0];

                    }

                    if (values.length >= 2) {

                        return (
                            price >= values[0] &&
                            price <= values[1]
                        );

                    }

                    return true;

                });

            card.style.display =
                categoryMatch && priceMatch
                    ? ""
                    : "none";

        });

    }

}


// ==========================================
// SEARCH PRODUCTS
// ==========================================

function initSearch() {

    const searchButton =
        document.getElementById("searchBtn");

    const productCards =
        document.querySelectorAll(
            ".product-card"
        );

    if (
        !searchButton ||
        productCards.length === 0
    ) {
        return;
    }

    searchButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            const searchText = prompt(
                "Search ShopEase products"
            );

            if (searchText === null) {
                return;
            }

            const searchValue =
                searchText
                    .trim()
                    .toLowerCase();

            productCards.forEach(card => {

                const title =
                    card
                        .querySelector(".product-title")
                        ?.textContent
                        .toLowerCase() || "";

                const category =
                    card
                        .querySelector(".product-category")
                        ?.textContent
                        .toLowerCase() || "";

                card.style.display =
                    title.includes(searchValue) ||
                    category.includes(searchValue)
                        ? ""
                        : "none";

            });

        }
    );

}


// ==========================================
// LOGIN FORM
// LOGIN EXISTING USER OR CREATE NEW USER
// ==========================================

function initLoginForm() {

    const loginForm =
        document.getElementById("loginForm");

    if (!loginForm) {
        return;
    }

    if (!supabaseClient) {

        alert(
            "Supabase connection could not be loaded."
        );

        return;

    }

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const createAccount =
        document.getElementById("createAccount");

    if (!emailInput || !passwordInput) {
        return;
    }

    checkLoggedInUser();

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;

            if (!email || !password) {

                alert(
                    "Please enter email and password."
                );

                return;

            }

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                return;

            }

            if (password.length < 6) {

                alert(
                    "Password must contain at least 6 characters."
                );

                return;

            }

            const loginButton =
                document.getElementById("loginBtn");

            if (loginButton) {

                loginButton.disabled = true;

                loginButton.textContent =
                    "Signing In...";

            }

            try {

                // TRY LOGIN FIRST

                const {
                    data: loginData,
                    error: loginError
                } =
                    await supabaseClient.auth
                        .signInWithPassword({

                            email: email,
                            password: password

                        });


                // LOGIN SUCCESS

                if (!loginError) {

                    loginForm.reset();

                    showLoggedInProfile(
                        loginData.user
                    );

                    return;

                }


                // CREATE NEW ACCOUNT AUTOMATICALLY

                if (
                    loginError.message
                        .toLowerCase()
                        .includes("invalid login credentials")
                ) {

                    if (loginButton) {

                        loginButton.textContent =
                            "Creating Account...";

                    }

                    const {
                        data: signupData,
                        error: signupError
                    } =
                        await supabaseClient.auth
                            .signUp({

                                email: email,
                                password: password

                            });

                    if (signupError) {

                        alert(
                            signupError.message
                        );

                        return;

                    }

                    if (!signupData.session) {

                        alert(
                            "Account created successfully. Please confirm your email, then sign in."
                        );

                        return;

                    }

                    loginForm.reset();

                    showLoggedInProfile(
                        signupData.user
                    );

                    return;

                }


                alert(loginError.message);

            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );

                alert(
                    "Login connection error."
                );

            } finally {

                if (loginButton) {

                    loginButton.disabled = false;

                    loginButton.textContent =
                        "Sign In";

                }

            }

        }
    );


    // ======================================
    // CREATE ACCOUNT BUTTON
    // ======================================

    if (createAccount) {

        createAccount.addEventListener(
            "click",
            async event => {

                event.preventDefault();

                const email =
                    emailInput.value.trim();

                const password =
                    passwordInput.value;

                if (!email || !password) {

                    alert(
                        "Enter email and password first."
                    );

                    return;

                }

                if (password.length < 6) {

                    alert(
                        "Password must contain at least 6 characters."
                    );

                    return;

                }

                try {

                    const {
                        data,
                        error
                    } =
                        await supabaseClient.auth
                            .signUp({

                                email: email,
                                password: password

                            });

                    if (error) {

                        alert(error.message);

                        return;

                    }

                    if (!data.session) {

                        alert(
                            "Account created. Please check your email and confirm your account."
                        );

                        return;

                    }

                    loginForm.reset();

                    showLoggedInProfile(
                        data.user
                    );

                } catch (error) {

                    console.error(
                        "Signup Error:",
                        error
                    );

                    alert(
                        "Account creation error."
                    );

                }

            }
        );

    }

}


// ==========================================
// CHECK LOGIN SESSION
// ==========================================

async function checkLoggedInUser() {

    if (!supabaseClient) {
        return;
    }

    const {
        data,
        error
    } =
        await supabaseClient.auth.getSession();

    if (error) {

        console.error(
            "Session Error:",
            error.message
        );

        return;

    }

    if (
        data.session &&
        data.session.user
    ) {

        showLoggedInProfile(
            data.session.user
        );

    }

}


// ==========================================
// SHOW LOGGED IN PROFILE
// ==========================================

function showLoggedInProfile(user) {

    const authCard =
        document.querySelector(".auth-card");

    if (!authCard || !user) {
        return;
    }

    authCard.innerHTML = `
        <div class="auth-header">

            <div
                style="
                    width: 70px;
                    height: 70px;
                    margin: 0 auto 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--gradient-accent);
                    color: #ffffff;
                "
            >
                <i data-feather="user"></i>
            </div>

            <h2>Welcome</h2>

            <p>${user.email}</p>

        </div>

        <button
            type="button"
            class="btn btn-primary auth-btn"
            id="logoutBtn"
        >
            <i data-feather="log-out"></i>

            Logout
        </button>
    `;

    replaceFeatherIcons();

    const logoutButton =
        document.getElementById("logoutBtn");

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logoutUser
        );

    }

}


// ==========================================
// LOGOUT USER
// ==========================================

async function logoutUser() {

    if (!supabaseClient) {
        return;
    }

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {

        alert(error.message);

        return;

    }

    window.location.reload();

}


// ==========================================
// CHECKOUT + SAVE ORDER TO SUPABASE
// ==========================================

function initCheckout() {

    const checkoutBtn =
        document.getElementById("checkoutBtn");

    if (!checkoutBtn) {
        return;
    }

    checkoutBtn.addEventListener(
        "click",
        async event => {

            event.preventDefault();

            const cart = getCart();

            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;

            }

            if (!supabaseClient) {

                alert(
                    "Database connection error."
                );

                return;

            }

            const {
                data: sessionData,
                error: sessionError
            } =
                await supabaseClient.auth
                    .getSession();

            if (sessionError) {

                alert(
                    "Login session error."
                );

                return;

            }

            const user =
                sessionData.session?.user;

            if (!user) {

                alert(
                    "Please login before checkout."
                );

                window.location.href =
                    "login.html";

                return;

            }

            checkoutBtn.disabled = true;

            checkoutBtn.innerHTML =
                "Sending Request...";

            const orders =
                cart.map(product => {

                    return {

                        user_email:
                            user.email,

                        product_name:
                            product.title,

                        price:
                            Number(product.price),

                        quantity:
                            Number(product.quantity)

                    };

                });

            try {

                const { error } =
                    await supabaseClient
                        .from("orders")
                        .insert(orders);

                if (error) {

                    console.error(
                        "Order Error:",
                        error
                    );

                    alert(error.message);

                    return;

                }

                const requestPopup =
                    document.getElementById(
                        "requestPopup"
                    );

                if (requestPopup) {

                    requestPopup.classList.add(
                        "active"
                    );

                } else {

                    alert(
                        "Product request sent successfully!"
                    );

                }

                localStorage.removeItem(
                    "shopEaseCart"
                );

                displayCart();

                updateCartCount();

            } catch (error) {

                console.error(
                    "Checkout Error:",
                    error
                );

                alert(
                    "Checkout connection error."
                );

            } finally {

                checkoutBtn.disabled = false;

                checkoutBtn.innerHTML = `
                    Proceed to Checkout

                    <i data-feather="arrow-right"></i>
                `;

                replaceFeatherIcons();

            }

        }
    );

}