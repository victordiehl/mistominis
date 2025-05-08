// js/detail.js
async function fetchProducts() {
    const res = await fetch('data/products.json');
    return await res.json();
  }
  
function getProductId() {
    return Number(new URLSearchParams(location.search).get('id')) || 1;
  }
  
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-count').textContent = cart.length;
  }
  
function addToCart(id) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  }
  
async function renderDetail() {
    const products = await fetchProducts();
    const product = products.find(p => p.id === getProductId());
    const container = document.getElementById('detail-container');
    if (!product) {
      container.textContent = 'Produto não encontrado.';
      return;
    }
    container.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.name}">
      <div class="product-info">
        <h2>${product.name}</h2>
        <p class="price">R$ ${product.price.toFixed(2)}</p>
        <p class="description">${product.description}</p>
        <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
      </div>
    `;
    updateCartCount();
  }
  
  window.addEventListener('DOMContentLoaded', renderDetail);
  