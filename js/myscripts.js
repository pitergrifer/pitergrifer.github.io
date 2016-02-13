$(document).ready(function () {
  /* Скрипт для кнопки Бургер */
  $('.navbar-toggle').click(function () {
    $('.nvidia-navbar-mobile').toggleClass('nvidia-navbar-mobile-visible');
    $(this).toggleClass('active-burger');
  });

  /* Работва слайдеров блога */
  $('.enjoy-block-1').hover(function () {
    $('.blog-caption-enjoy-1').slideDown(300);
    $('.blog-caption-enjoy-2').slideUp(300);
    $('.blog-caption-enjoy-3').slideUp(300);
  });
  $('.enjoy-block-2').hover(function () {
    $('.blog-caption-enjoy-1').slideUp(300);
    $('.blog-caption-enjoy-2').slideDown(300);
    $('.blog-caption-enjoy-3').slideUp(300);
  });
  $('.enjoy-block-3').hover(function () {
    $('.blog-caption-enjoy-1').slideUp(300);
    $('.blog-caption-enjoy-2').slideUp(300);
    $('.blog-caption-enjoy-3').slideDown(300);
  });

  $('.make-block-1').hover(function () {
    $('.blog-caption-make-1').slideDown(300);
    $('.blog-caption-make-2').slideUp(300);
    $('.blog-caption-make-3').slideUp(300);
  });
  $('.make-block-2').hover(function () {
    $('.blog-caption-make-1').slideUp(300);
    $('.blog-caption-make-2').slideDown(300);
    $('.blog-caption-make-3').slideUp(300);
  });
  $('.make-block-3').hover(function () {
    $('.blog-caption-make-1').slideUp(300);
    $('.blog-caption-make-2').slideUp(300);
    $('.blog-caption-make-3').slideDown(300);
  });

  $('.res-block-1').hover(function () {
    $('.blog-caption-res-1').slideDown(300);
    $('.blog-caption-res-2').slideUp(300);
    $('.blog-caption-res-3').slideUp(300);
  });
  $('.res-block-2').hover(function () {
    $('.blog-caption-res-1').slideUp(300);
    $('.blog-caption-res-2').slideDown(300);
    $('.blog-caption-res-3').slideUp(300);
  });
  $('.res-block-3').hover(function () {
    $('.blog-caption-res-1').slideUp(300);
    $('.blog-caption-res-2').slideUp(300);
    $('.blog-caption-res-3').slideDown(300);
  });

  $('.buy-block-1').hover(function () {
    $('.blog-caption-buy-1').slideDown(300);
    $('.blog-caption-buy-2').slideUp(300);
    $('.blog-caption-buy-3').slideUp(300);
  });
  $('.buy-block-2').hover(function () {
    $('.blog-caption-buy-1').slideUp(300);
    $('.blog-caption-buy-2').slideDown(300);
    $('.blog-caption-buy-3').slideUp(300);
  });
  $('.buy-block-3').hover(function () {
    $('.blog-caption-buy-1').slideUp(300);
    $('.blog-caption-buy-2').slideUp(300);
    $('.blog-caption-buy-3').slideDown(300);
  });
}); //ready end