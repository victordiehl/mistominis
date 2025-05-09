// frontend/src/js/include-header.js
import { auth }                       from './firebase-init.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.7.0/firebase-auth.js';

async function includeHeader() {
  try {
    // 1) Injetar o fragmento de header
    const res  = await fetch('/components/header.html');
    const html = await res.text();
    document.body.insertAdjacentHTML('afterbegin', html);

    // 2) Reaplicar comportamentos globais
  if (typeof updateCartCount === 'function' && document.getElementById('cart-count')) {
        updateCartCount();
    }    
    // searchProducts?.();

    // 3) Configurar dropdown e login
    setupAccountBehavior();

  } catch (e) {
    console.error('Erro ao incluir header:', e);
  }
}

/**
 * Define comportamento do botão "Sua conta" de acordo com o estado de autenticação.
 */
function setupAccountBehavior() {
  const container = document.querySelector('.account-container');
  const loginBtn  = container.querySelector('.login-button');
  const dropdown  = container.querySelector('.account-dropdown');

  // Gerencia estado de usuário
  onAuthStateChanged(auth, user => {
    // Limpa qualquer listener anterior
    loginBtn.replaceWith(loginBtn.cloneNode(true));
    const btn = container.querySelector('.login-button');

    // Se estiver logado:
    if (user) {
      btn.textContent = user.email;             // ou user.displayName
      btn.onclick     = () => location.href = 'usuario.html';
      container.classList.remove('open');
      // garante que o dropdown não abra
      dropdown.style.display = 'none';
    } 
    // Se não estiver logado:
    else {
      btn.textContent = 'Sua conta';
      btn.onclick = e => {
        e.stopPropagation();
        container.classList.toggle('open');
      };
      // garante que o dropdown exista e seja interativo
      dropdown.style.display = '';
    }
  });

  // Previne fechamento ao clicar dentro do dropdown
  dropdown.addEventListener('click', e => e.stopPropagation());
  // Fecha ao clicar fora
  document.addEventListener('click', () => container.classList.remove('open'));

  // Captura o submit do formulário (login)
  document.addEventListener('submit', async e => {
    if (e.target.id !== 'login-form') return;
    e.preventDefault();
    const email = e.target['login-email'].value;
    const pwd   = e.target['login-password'].value;
    try {
      await signInWithEmailAndPassword(auth, email, pwd);
      window.location.href = 'usuario.html';
    } catch (err) {
      alert('Falha no login: ' + err.message);
    }
  });
}

includeHeader();
