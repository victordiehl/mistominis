// frontend/src/js/include-header.js
import { auth } from './firebase-init.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.7.0/firebase-auth.js';

async function includeHeader() {
  // 1) injeta o header
  const res  = await fetch('/components/header.html');
  const html = await res.text();
  document.body.insertAdjacentHTML('afterbegin', html);

  // 2) reaplica comportamentos globais
  syncAuthUI?.();
  updateCartCount?.();
  searchProducts?.();

  // 3) configura o dropdown de conta
  setupAccountDropdown();
  // 4) configura o handler de login
  setupLoginHandler();
  // 5) monitora mudanças de auth para alterar o comportamento
  setupAuthWatcher();
}

function setupAccountDropdown() {
  const container = document.querySelector('.account-container');
  const btn       = container.querySelector('.login-button');
  const dd        = container.querySelector('.account-dropdown');

  // previne fechar ao clicar dentro do dropdown
  dd.addEventListener('click', e => e.stopPropagation());
  // fecha ao clicar fora
  document.addEventListener('click', () => container.classList.remove('open'));

  // binding imediato para usuário _não_ logado
  btn.addEventListener('click', e => {
    e.stopPropagation();
    container.classList.toggle('open');
  });
}

function setupLoginHandler() {
  document.addEventListener('submit', async e => {
    if (e.target.id !== 'login-form') return;
    e.preventDefault();
    const email = e.target['login-email'].value;
    const pwd   = e.target['login-password'].value;
    try {
      await signInWithEmailAndPassword(auth, email, pwd);
      // após logar, o watcher vai ajustar o botão
    } catch (err) {
      alert('Falha no login: ' + err.message);
    }
  });
}

function setupAuthWatcher() {
  const container = document.querySelector('.account-container');
  const btn       = container.querySelector('.login-button');
  const dd        = container.querySelector('.account-dropdown');

  onAuthStateChanged(auth, user => {
    if (user) {
      // usuário logado: esconde dropdown e muda ação do botão
      dd.style.display        = 'none';
      container.classList.remove('open');
      btn.textContent         = user.email;
      btn.onclick             = () => window.location.href = 'usuario.html';
    } else {
      // não logado: restaura dropdown e texto
      dd.style.display        = '';
      btn.textContent         = 'Sua conta';
      btn.onclick             = e => {
        e.stopPropagation();
        container.classList.toggle('open');
      };
    }
  });
}

includeHeader();
