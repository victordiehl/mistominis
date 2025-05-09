// frontend/src/js/main.js
(async () => {
  // Guarda o elemento no topo para checar presença
  const productListEl = document.getElementById('product-list');
  // Se não houver lista de produtos, nem roda o fetch nem expõe as funções
  if (!productListEl) return;

  // Só a partir daqui sabemos que estamos mesmo na página de catálogo
  let loadedProducts = [];
  const cartItems    = JSON.parse(localStorage.getItem('cart')) || [];

  async function fetchProducts() {
    const res = await fetch('/data/products.json');
    if (!res.ok) throw new Error('Erro ao carregar products.json');
    return await res.json();
  }

  function renderProducts(products) {
    productListEl.innerHTML = '';      // agora productListEl não é null
    products.forEach(p => {
      const link = document.createElement('a');
      link.href      = `produto.html?id=${p.id}`;
      link.className = 'product-link';
      link.innerHTML = `
        <div class="product">
          <img src="${p.imageUrl}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>R$ ${p.price.toFixed(2)}</p>
          <button class="add-cart"
            onclick="addToCart(${p.id}); event.stopPropagation();"
          >🛒</button>
        </div>
      `;
      productListEl.appendChild(link);
    });
  }

  function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = cartItems.length;
  }

  window.addToCart = id => {
    cartItems.push(id);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartCount();
  };

  window.searchProducts = () => {
    const term    = document.getElementById('search-input')?.value.toLowerCase() || '';
    const results = loadedProducts.filter(p =>
      p.name.toLowerCase().includes(term)
    );
    renderProducts(results);
  };

  window.applyFilters = () => {
    const filter = document.getElementById('filter-select')?.value;
    let results  = [...loadedProducts];
    if (filter === 'price-asc')      results.sort((a, b) => a.price - b.price);
    else if (filter === 'price-desc') results.sort((a, b) => b.price - a.price);
    else if (filter === 'name-asc')   results.sort((a, b) => a.name.localeCompare(b.name));
    else if (filter === 'name-desc')  results.sort((a, b) => b.name.localeCompare(a.name));
    renderProducts(results);
  };

  window.viewCart = () => window.location.href = 'carrinho.html';

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      loadedProducts = await fetchProducts();
      renderProducts(loadedProducts);
      updateCartCount();
    } catch (err) {
      console.error('Erro ao inicializar produtos:', err);
    }
  });
})();
