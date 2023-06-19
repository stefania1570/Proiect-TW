const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar_menu');
const navLogo = document.querySelector('#navbar_logo');

// Display Mobile Menu
const mobileMenu = () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
  };
  
  menu.addEventListener('click', mobileMenu);

  // Show active menu when scrolling
const highlightMenu = () => {
    const elem = document.querySelector('.highlight');
    const homeMenu = document.querySelector('#home-page');
    const movies = document.querySelector('#movies-page');
    const tv_shows = document.querySelector('#tv-shows-page');
  
    // adds 'highlight' class to my menu items
    if (window.innerWidth > 960 && window.scrollY < 600) {
      homeMenu.classList.add('highlight');
      movies.classList.remove('highlight');
      return;
    } else if (window.innerWidth > 960 && window.scrollY < 1400) {
      movies.classList.add('highlight');
      homeMenu.classList.remove('highlight');
      tv_shows.classList.remove('highlight');
      return;
    } else if (window.innerWidth > 960 && window.scrollY < 2345) {
      tv_shows.classList.add('highlight');
      movies.classList.remove('highlight');
      return;
    }
  
    if ((elem && window.innerWIdth < 960 && window.scrollY < 600) || elem) {
      elem.classList.remove('highlight');
    }
  };
  
  window.addEventListener('scroll', highlightMenu);
  window.addEventListener('click', highlightMenu);
  //api key: f44d1cab4cfa09f296ab19d09156ce1c ca sa nu mai deschid tmdb
 