document.addEventListener("DOMContentLoaded", () => {
  // Menu data per restaurant
  const menus = {
    "burger-shack": {
      name: "Burger Shack",
      items: [
        { name: "Classic Burger", price: 8.99 },
        { name: "Double Cheddar Smash", price: 11.49 },
        { name: "Crispy Bacon & BBQ Burger", price: 12.99 },
        { name: "Truffle Fries", price: 4.99 },
      ],
    },
    "bella-italia": {
      name: "Bella Italia Pizza",
      items: [
        { name: "Margherita Pizza", price: 13.99 },
        { name: "Pepperoni Rustica", price: 15.49 },
        { name: "Four-Cheese Quattro", price: 16.99 },
        { name: "Garlic Knots (6 pcs)", price: 5.50 },
      ],
    },
    "tokyo-bento": {
      name: "Tokyo Bento & Ramen",
      items: [
        { name: "Tonkotsu Pork Ramen", price: 14.50 },
        { name: "Spicy Miso Ramen", price: 14.99 },
        { name: "Chicken Karaage Bento", price: 12.99 },
        { name: "Gyoza Dumplings", price: 6.25 },
      ],
    },
  };

  // State
  let cart = [];

  // DOM Elements
  const menuModal = document.getElementById("menu-modal");
  const modalTitle = document.getElementById("modal-restaurant-title");
  const modalMenuList = document.getElementById("modal-menu-list");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const viewMenuBtns = document.querySelectorAll(".btn-view-menu");

  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const openCartBtn = document.getElementById("open-cart-btn");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const cartCountEl = document.getElementById("cart-count");
  const cartTotalEl = document.getElementById("cart-total");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const checkoutBtn = document.getElementById("checkout-btn");

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  // Open & Populate Menu Modal
  const openMenuModal = (restaurantKey) => {
    const restaurant = menus[restaurantKey];
    if (!restaurant) return;

    modalTitle.textContent = `${restaurant.name} Menu`;
    modalMenuList.innerHTML = "";

    restaurant.items.forEach((item) => {
      const itemEl = document.createElement("div");
      itemEl.className = "menu-item";
      itemEl.innerHTML = `
        <div class="menu-item-details">
          <h3>${item.name}</h3>
          <p>$${item.price.toFixed(2)}</p>
        </div>
        <button class="btn-add-to-cart" data-name="${item.name}" data-price="${item.price}">
          Add to Cart
        </button>
      `;
      modalMenuList.appendChild(itemEl);
    });

    menuModal.classList.add("active");
    menuModal.setAttribute("aria-hidden", "false");
  };

  // Close Menu Modal
  const closeMenuModal = () => {
    menuModal.classList.remove("active");
    menuModal.setAttribute("aria-hidden", "true");
  };

  viewMenuBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      openMenuModal(target);
    });
  });

  closeModalBtn.addEventListener("click", closeMenuModal);
  window.addEventListener("click", (e) => {
    if (e.target === menuModal) closeMenuModal();
  });

  // Cart Functions
  const toggleCart = (open) => {
    if (open) {
      cartSidebar.classList.add("open");
      cartOverlay.classList.add("active");
    } else {
      cartSidebar.classList.remove("open");
      cartOverlay.classList.remove("active");
    }
  };

  openCartBtn.addEventListener("click", () => toggleCart(true));
  closeCartBtn.addEventListener("click", () => toggleCart(false));
  cartOverlay.addEventListener("click", () => toggleCart(false));

  const updateCartUI = () => {
    cartCountEl.textContent = cart.length;

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalEl.textContent = total.toFixed(2);

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is currently empty.</p>';
      return;
    }

    cartItemsContainer.innerHTML = "";
    cart.forEach((item, index) => {
      const lineItem = document.createElement("div");
      lineItem.className = "cart-line-item";
      lineItem.innerHTML = `
        <div class="cart-line-details">
          <strong>${item.name}</strong>
          <span>$${item.price.toFixed(2)}</span>
        </div>
        <button class="btn-remove-item" data-index="${index}">Remove</button>
      `;
      cartItemsContainer.appendChild(lineItem);
    });

    // Attach remove handlers
    document.querySelectorAll(".btn-remove-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const itemIndex = parseInt(e.target.getAttribute("data-index"), 10);
        cart.splice(itemIndex, 1);
        updateCartUI();
      });
    });
  };

  // Event Delegation for "Add to Cart"
  modalMenuList.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-add-to-cart")) {
      const name = e.target.getAttribute("data-name");
      const price = parseFloat(e.target.getAttribute("data-price"));

      cart.push({ name, price });
      updateCartUI();
      toggleCart(true); // Open cart sidebar on add
    }
  });

  // Checkout Action
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty! Add some delicious meals first.");
      return;
    }
    const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
    alert(`Order confirmed! Total: $${total}. Your food is being prepared.`);
    cart = [];
    updateCartUI();
    toggleCart(false);
  });

  // Mobile Hamburger Toggle
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("active"));
  });

  // Global Keydown Listeners (ESC)
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (menuModal.classList.contains("active")) closeMenuModal();
      if (cartSidebar.classList.contains("open")) toggleCart(false);
    }
  });
});