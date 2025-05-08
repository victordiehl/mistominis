// frontend/src/js/include-header.js
async function includeHeader() {
  try {
    const res  = await fetch('components/header.html');
    const html = await res.text();
    document.body.insertAdjacentHTML('afterbegin', html);
    // reaplica comportamentos após injetar:
    if (window.syncAuthUI)    syncAuthUI();
    if (window.updateCartCount) updateCartCount();
    if (window.searchProducts)  searchProducts(); 
  } catch (e) {
    console.error('Erro ao incluir header:', e);
  }
}
includeHeader();
