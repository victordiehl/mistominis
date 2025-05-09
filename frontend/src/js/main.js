// js/main.js

// Busca produtos do JSON
async function fetchProducts() {
    const res = await fetch('./data/products.json');
    if (!res.ok) throw new Error('Não encontrou products.json');
    return await res.json();
  }
  
  function applyFilters() {
    const systems = Array.from(document.querySelectorAll('input[name="system-filter"]:checked')).map(cb => cb.value);
    const prices = Array.from(document.querySelectorAll('input[name="price-filter"]:checked')).map(cb => cb.value);
    let filtered = [...loadedProducts];
    if (systems.length) filtered = filtered.filter(p => systems.includes(p.category));
    if (prices.length) filtered = filtered.filter(p => prices.some(range => {
      const [min, max] = range.split('-').map(Number);
      return p.price >= min && p.price < max;
    }));
    renderProducts(filtered);
  }

  function searchProducts() {
    const term = document.getElementById('search-input').value.toLowerCase();
    const filtered = loadedProducts.filter(p => p.name.toLowerCase().includes(term));
    renderProducts(filtered);
  }

  function viewCart() {
    window.location.href = 'carrinho.html';
  }

  // Renderiza lista de produtos no index.html
  function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(p => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <a href="produto.html?id=${p.id}"><img src="${p.imageUrl}" alt="${p.name}"></a>
        <h3><a href="produto.html?id=${p.id}" style="text-decoration:none; color:inherit;">${p.name}</a></h3>
        <p>R$ ${p.price.toFixed(2)}</p>
        <a href="produto.html?id=${p.id}" class="details">Ver Detalhes</a>
        <button class="add-cart" onclick="addToCart(${p.id})">🛒</button>
      `;
      productList.appendChild(div);
    });
  }
  
  let loadedProducts = [];
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Adiciona produto ao carrinho
  function addToCart(id) {
    cartItems.push(id);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();
  }
  
  // Atualiza contador no header
  function updateCartCount() {
    document.getElementById('cart-count').textContent = cartItems.length;
  }
  
  // Inicializa ao carregar DOM
  window.addEventListener('DOMContentLoaded', async () => {
    loadedProducts = await fetchProducts();
    renderProducts(loadedProducts);
    updateCartCount();
  });
  