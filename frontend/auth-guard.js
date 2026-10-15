(() => {
  const currentPage = window.location.pathname.split('/').pop().toLowerCase();
  if (currentPage === '404.html') return;

  const isLoggedIn = Boolean(localStorage.getItem('watchcart_token'));
  const loginLink = document.querySelector('nav a[href="login.html"]');
  const profileLink = document.querySelector('nav a[href="profile.html"]');

  if (loginLink) loginLink.hidden = isLoggedIn;
  if (profileLink) profileLink.hidden = !isLoggedIn;

  if (currentPage === 'login.html') {
    if (isLoggedIn) window.location.replace('products.html');
    return;
  }

  if (!isLoggedIn) {
    sessionStorage.setItem('watchcart_return_to', window.location.href);
    window.location.replace('login.html');
  }
})();