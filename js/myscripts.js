$(document).ready(function () {
  $('.navbar-toggle').click(function () {
    $('.nvidia-navbar-mobile').toggleClass('nvidia-navbar-mobile-visible');
    $(this).toggleClass('active-burger');
  });
}); //ready end