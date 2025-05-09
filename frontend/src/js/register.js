// frontend/src/js/register.js

import { auth }                              from './firebase-init.js';
import { createUserWithEmailAndPassword }    from "https://www.gstatic.com/firebasejs/11.7.0/firebase-auth.js";
// Se for usar Firestore para salvar dados extras:
// import { db }                              from './firebase-init.js';
// import { doc, setDoc }                     from "https://www.gstatic.com/firebasejs/11.7.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const zipInput = document.getElementById('reg-zip');

  
  zipInput.addEventListener('blur', async () => {
    const cep = zipInput.value.replace(/\D/g, '');      // só números
    if (cep.length !== 8) return;                       // CEP inválido

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!res.ok) throw new Error('Erro ao consultar CEP');
      const data = await res.json();
      if (data.erro) throw new Error('CEP não encontrado');

      // Preenche os campos
      document.getElementById('reg-street').value       = data.logradouro || '';
      document.getElementById('reg-neighborhood').value = data.bairro     || '';
      document.getElementById('reg-city').value         = data.localidade || '';
      document.getElementById('reg-state').value        = data.uf         || '';
    } catch (err) {
      console.error(err);
      alert('Não foi possível buscar o CEP. Verifique e tente novamente.');
    }
  });


  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Coleta valores
    const name        = form['reg-name'].value.trim();
    const email       = form['reg-email'].value.trim();
    const password    = form['reg-password'].value;
    const confirmPass = form['reg-password-confirm'].value;
    const phone       = form['reg-phone'].value.trim();
    const cpf         = form['reg-cpf'].value.trim();
    const street      = form['reg-street'].value.trim();
    const number      = form['reg-number'].value.trim();
    const complement  = form['reg-complement'].value.trim();
    const neighborhood= form['reg-neighborhood'].value.trim();
    const city        = form['reg-city'].value.trim();
    const state       = form['reg-state'].value.trim();
    const zip         = form['reg-zip'].value.trim();

    // Validação simples
    if (password !== confirmPass) {
      return alert('As senhas não conferem.');
    }

    try {
      // Cria usuário no Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // Se quiser salvar os demais dados num banco (Firestore), experimente:
      
      await setDoc(doc(db, 'users', cred.user.uid), {
        name, email, phone, cpf,
        address: { street, number, complement, neighborhood, city, state, zip }
      });
      

      // Redireciona para a home ou área do usuário
      window.location.href = 'index.html';
    } catch (err) {
      alert('Erro no cadastro: ' + err.message);
    }
  });
});
