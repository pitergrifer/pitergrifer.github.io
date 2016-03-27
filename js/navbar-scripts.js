$(document).ready(function () {
  var menuButton = $('.menu-button');
  var shareButton = $('.share');
  var dropShare = $('.share ul');
  var searchButton = $('.search');
  var profileButton = $('.profile');
  var searchField = $('.nav-search');
  var searchFieldClose = $('.nav-search-close');
  var loginWindow = $('.login-window');
  var loginForm = $('.login-window form');
  var loginFormClose = $('.nav-profile-close');
  var burger = $('.burger');
  var categories = $('.categories');

  function patternAction(activeObject) {
    menuButton.not(activeObject).removeClass('menu-button-active').removeClass('search-hover').removeClass('profile-hover');
    if (activeObject == shareButton || activeObject == burger) {
      activeObject.toggleClass('menu-button-active');
      if (activeObject == shareButton) {
        if (dropShare.hasClass('drop-share')) {
          dropShare.removeClass('drop-share');
        } else {
          dropShare.addClass('drop-share');
        };
        if (categories.hasClass('categories-show')) {
          categories.removeClass('categories-show');
        };
      } else if (activeObject == burger) {
        if (dropShare.hasClass('drop-share')) {
          dropShare.removeClass('drop-share');
        };
        if (categories.hasClass('categories-show')) {
          categories.removeClass('categories-show');
        } else {
          categories.addClass('categories-show');
        };
      };
    } else {
      if (activeObject == searchButton) {
        activeObject.toggleClass('menu-button-active').toggleClass('search-hover');
      } else if (activeObject == profileButton) {
        activeObject.toggleClass('menu-button-active').toggleClass('profile-hover');
      };
      if (dropShare.hasClass('drop-share')) {
        dropShare.removeClass('drop-share');
      };
      if (categories.hasClass('categories-show')) {
        categories.removeClass('categories-show');
      };
    };
  };
  menuButton.click(function () {
    if ($(this).hasClass('share')) {
      patternAction(shareButton);
    } else if ($(this).hasClass('search')) {
      patternAction(searchButton);
      searchField.toggleClass('nav-search-active');
      searchFieldClose.toggleClass('nav-search-close-visible');
    } else if ($(this).hasClass('profile')) {
      patternAction(profileButton);
      loginWindow.toggleClass('login-window-active');
    } else if ($(this).hasClass('burger')) {
      patternAction(burger);
    };
  });
  searchFieldClose.click(function () {
    $(this).toggleClass('nav-search-close-visible');
    searchField.removeClass('nav-search-active');
    searchButton.toggleClass('menu-button-active').toggleClass('search-hover');
  });
  loginFormClose.click(function () {
    profileButton.toggleClass('menu-button-active').toggleClass('profile-hover');
    loginForm.addClass('jump-profile');
    setTimeout(function () {
      loginForm.removeClass('jump-profile');
    }, 700);
    setTimeout(function () {
      loginWindow.toggleClass('login-window-active');
    }, 600);
  });
}); //ready end