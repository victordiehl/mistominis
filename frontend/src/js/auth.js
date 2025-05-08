// js/auth.js
import { auth } from './firebase-init.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut
} from 'https://www.gstatic.com/firebasejs/11.7.0/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1) Login com e-mail/senha
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email    = loginForm.email.value;
      const password = loginForm.password.value;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'index.html';  // sucesso: vai para home
      } catch (err) {
        alert(`Erro no login: ${err.message}`);
      }
    });
  }

  // 2) Registro de novo usuário (se existir)
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email    = registerForm.email.value;
      const password = registerForm.password.value;
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        window.location.href = 'index.html';  // registrado e logado
      } catch (err) {
        alert(`Erro no cadastro: ${err.message}`);
      }
    });
  }

  // 3) Login via Google
  const googleBtn = document.getElementById('google-btn');
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        window.location.href = 'index.html';
      } catch (err) {
        alert(`Erro no login Google: ${err.message}`);
      }
    });
  }

  // 4) Monitora mudanças no estado de autenticação
  onAuthStateChanged(auth, user => {
    const headerActions = document.querySelector('header .header-actions');
    // Remove botões antigos, se houver
    const loginBtn  = document.querySelector('.login-button');
    const logoutBtn = document.querySelector('.logout-button');
    if (loginBtn)  loginBtn.remove();
    if (logoutBtn) logoutBtn.remove();

    if (user) {
      // Se estiver logado, mostra botão de logout
      const btn = document.createElement('button');
      btn.textContent   = `👤 ${user.email}`;
      btn.className     = 'logout-button';
      btn.onclick       = () => signOut(auth);
      headerActions.appendChild(btn);
    } else {
      // Se não, mostra botão de login
      const btn = document.createElement('button');
      btn.textContent   = '👤';
      btn.className     = 'login-button';
      btn.onclick       = () => window.location.href = 'login.html';
      headerActions.appendChild(btn);
    }
  });
});
