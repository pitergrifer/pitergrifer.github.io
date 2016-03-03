$(document).ready(function () {
  /* Кнопка "Бургер" */
  $('.social-links-drop-menu').click(function () {
    $(this).toggleClass('social-links-drop-menu-active');
    $('.social-links-mobile').toggleClass('social-links-mobile-active');
  });

  /* Мобильное меню */
  $('.mobile-menu-button').click(function () {
    $(this).toggleClass('mobile-menu-button-active');
    $('.life-style-navbar-mobile').toggleClass('life-style-navbar-mobile-active');
  });

  /* Скрипт активации поля поиска */
  $('.ls-button.search').click(function () {
    $(this).toggleClass('search-active');
    $('.submit-story').toggleClass('submit-story-deactive');
    $('.search-field').toggleClass('search-field-active');
  });

  /* Скрипт работы карусели */
  function rotation() {
    setTimeout(function () {
      if ($('.ls-arrow.right').attr('avalible') == 'false') {
        $('.ls-arrow.right').click(function () {
          //do nothing
        });
      } else if ($('.image:last').hasClass('active')) {
        $('.image.active').addClass('left');
        $('.image:first').addClass('next');
        setTimeout(function () {
          $('.image:first').addClass('current');
          activateCT();
        }, 1);
        setTimeout(function () {
          $('.image.active').removeClass('active').removeClass('left');
          $('.image:first').removeClass('next').removeClass('current').addClass('active');
          $('.ls-arrow.right').removeAttr('avalible');
        }, 500);
      } else {
        $('.image.active').addClass('left').next('.image').addClass('next');
        setTimeout(function () {
          $('.image.active').next('.image').addClass('current');
          activateCT();
        }, 1);
        setTimeout(function () {
          $('.image.active').removeClass('active').removeClass('left').next('.image').removeClass('next').removeClass('current').addClass('active');
          $('.ls-arrow.right').removeAttr('avalible');
        }, 500);
      };
      $('.ls-arrow.right').attr('avalible', 'false');
    }, 3000);
  };

  function rotationManager(flag, rotation, time) {
    if (flag)
      intervalID = setInterval(rotation, time);
    else
      clearInterval(intervalID);
  }

  rotationManager(true, rotation, 2000);

  $('#ls-carousel').hover(function () {
    rotationManager(false);
  }, function () {
    rotationManager(true, rotation, 2000);
  });

  function activateCT() {
    $('.life-style-carousel-indi li').removeClass('active');
    $('.image').each(function () {
      var activeImage = $('.image').index($('.image.current'));
      var toNumber = parseInt(activeImage);
      var titles = ['#carousel-title-1', '#carousel-title-2', '#carousel-title-3'];
      $(titles[toNumber]).addClass('active');
    });
  };

  $('.ls-arrow.right').click(function () {
    if ($('.ls-arrow.right').attr('avalible') == 'false') {
      $('.ls-arrow.right').click(function () {
        //do nothing
      });
    } else if ($('.image:last').hasClass('active')) {
      $('.image.active').addClass('left');
      $('.image:first').addClass('next');
      setTimeout(function () {
        $('.image:first').addClass('current');
        activateCT();
      }, 1);
      setTimeout(function () {
        $('.image.active').removeClass('active').removeClass('left');
        $('.image:first').removeClass('next').removeClass('current').addClass('active');
        $('.ls-arrow.right').removeAttr('avalible');
      }, 500);
    } else {
      $('.image.active').addClass('left').next('.image').addClass('next');
      setTimeout(function () {
        $('.image.active').next('.image').addClass('current');
        activateCT();
      }, 1);
      setTimeout(function () {
        $('.image.active').removeClass('active').removeClass('left').next('.image').removeClass('next').removeClass('current').addClass('active');
        $('.ls-arrow.right').removeAttr('avalible');
      }, 500);
    };
    $('.ls-arrow.right').attr('avalible', 'false');
  });

  $('.ls-arrow.left').click(function () {
    if ($('.ls-arrow.left').attr('avalible') == 'false') {
      $('.ls-arrow.left').click(function () {
        //do nothing
      });
    } else if ($('.image:first').hasClass('active')) {
      $('.image.active').addClass('right');
      $('.image:last').addClass('prev');
      setTimeout(function () {
        $('.image:last').addClass('current');
        activateCT();
      }, 1);
      setTimeout(function () {
        $('.image.active').removeClass('active').removeClass('right');
        $('.image:last').removeClass('prev').removeClass('current').addClass('active');
        $('.ls-arrow.left').removeAttr('avalible');
      }, 500);
    } else {
      $('.image.active').addClass('right').prev('.image').addClass('prev');
      setTimeout(function () {
        $('.image.active').prev('.image').addClass('current');
        activateCT();
      }, 1);
      setTimeout(function () {
        $('.image.active').removeClass('active').removeClass('right').prev('.image').removeClass('prev').removeClass('current').addClass('active');
        $('.ls-arrow.left').removeAttr('avalible');
      }, 500);
    };
    $('.ls-arrow.left').attr('avalible', 'false');
  });

  $('.life-style-carousel-indi li').each(function () {
    $('.image').each(function () {
      $('.life-style-carousel-indi li').click(function () {
        var activatedTitle = parseInt($('.life-style-carousel-indi li').index(this));
        var activeImage = parseInt($('.image').index($('.image.active')));
        var imageArray = $('.image');
        if (activatedTitle > activeImage) {
          $('.image.active').addClass('left');
          imageArray.eq(activatedTitle).addClass('next');
          setTimeout(function () {
            imageArray.eq(activatedTitle).addClass('current');
            activateCT();
          }, 1);
          setTimeout(function () {
            $('.image.active').removeClass('active').removeClass('left');
            imageArray.eq(activatedTitle).removeClass('next').removeClass('current').addClass('active');
            $('.ls-arrow.right').removeAttr('avalible');
            $('.ls-arrow.left').removeAttr('avalible');
          }, 500);
          $('.ls-arrow.right').attr('avalible', 'false');
          $('.ls-arrow.left').attr('avalible', 'false');
        } else if (activatedTitle < activeImage) {
          $('.image.active').addClass('right');
          imageArray.eq(activatedTitle).addClass('prev');
          setTimeout(function () {
            imageArray.eq(activatedTitle).addClass('current');
            activateCT();
          }, 1);
          setTimeout(function () {
            $('.image.active').removeClass('active').removeClass('right');
            imageArray.eq(activatedTitle).removeClass('prev').removeClass('current').addClass('active');
            $('.ls-arrow.right').removeAttr('avalible');
            $('.ls-arrow.left').removeAttr('avalible');
          }, 500);
          $('.ls-arrow.right').attr('avalible', 'false');
          $('.ls-arrow.left').attr('avalible', 'false');
        };
      });
    });
  });

  /* Скрипт работы инстаграмной карусели */
  var imgInstaArray = $('.insta-slider ul li');
  var checkImgWidth = parseInt($('.insta-slider ul li').width());
  var width = 200;
  var count = imgInstaArray.length;
  var currentPosition = 0;
  var sliderSelect = $('.insta-slider ul');
  var limitRotation = Math.min(((count * width) - width) * -1);
  $('.instagram-arrow.left').click(function () {
    if (currentPosition == 0) {
      $('.instagram-arrow.left').addClass('insta-arrow-disabled');
    } else {
      currentPosition = Math.min(currentPosition + width);
      $('.instagram-arrow.right').removeClass('insta-arrow-disabled');
      $('.instagram-arrow.left').removeClass('insta-arrow-disabled');
      $('#rotator').css('margin-left', currentPosition);
    };
  });
  $('.instagram-arrow.right').click(function () {
    if (currentPosition == limitRotation) {
      $('.instagram-arrow.right').addClass('insta-arrow-disabled');
    } else {
      currentPosition = Math.max(currentPosition - width);
      $('.instagram-arrow.right').removeClass('insta-arrow-disabled');
      $('.instagram-arrow.left').removeClass('insta-arrow-disabled');
      $('#rotator').css('margin-left', currentPosition);
    };
  });

  /* Скрипт модального окна */
  $('.can-be-big').click(function () {
    $(this).clone(false, false).prependTo('.container-big-img');
    $('.modal-img').toggleClass('slide-down-modal');
    $('.container-big-img .can-be-big').removeClass('can-be-big');
  });
  $('.toggle-modal').click(function () {
    $('.modal-img').toggleClass('slide-down-modal');
    setTimeout(function () {
      $('.container-big-img img').remove();
    }, 300);
  });

}); // Ready end