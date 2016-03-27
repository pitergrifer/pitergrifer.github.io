$(document).ready(function () {
  /* Скрипт, задающий вариативную цветовую палитру превью постов */
  var postArray = $('.post');
  var maskArray = $('.mask');
  var borderColors = ['#14b9d6', '#e76049', '#2eb398', '#90899c', '#5692b1', '#f9b704', '#dd1787', '#e76049', '#585858'];
  var maskColors = ['rgba(20, 185, 214, .8)', 'rgba(231, 96, 73, .8)', 'rgba(46, 179, 152, .8)', 'rgba(144, 137, 156, .8)', 'rgba(86, 146, 177, .8)', 'rgba(249, 183, 4, .8)', 'rgba(221, 23, 135, .8)', 'rgba(231, 96, 73, .8)', 'rgba(88, 88, 88, .8)'];

  for (var i = 0; i < postArray.length; i++) {
    postArray.eq(i).css({
      'border-bottom': '5px solid',
      'border-bottom-color': borderColors[i]
    });
    maskArray.eq(i).css({
      'background-color': maskColors[i]
    });
  };

  /* Скрипт, задающий высоту меню категорий */
  var knowHeight = parseInt($('.height').height());
  $('.categories').css('height', knowHeight);

  /* Скрипт, расчитывающий параметры внутрипостовых блоков картинок */
  $(window).load(function () {
    var overlayImgArray = $('.inpost-img p');
    for (var i = 0; i < overlayImgArray.length; i++) {
      overlayImgArray.eq(i).css({
        'background-color': maskColors[i],
        'margin-top': overlayImgArray.eq(i).height() * -1 - 32
      });
    };
  });

  /* Скрипт просмотра увеличенного изображения */
  var imgWrapper = $('.img-wrapper');
  var inpostImg = $('.inpost-img img');
  var imgWindow = $('.big-img-window');
  var inWrapperImg = $('.img-wrapper img');
  var windowHeight = $(window).height();
  var loader = $('.loader');

  inWrapperImg.css({
    'max-height': windowHeight * 0.9 - 100
  });

  inpostImg.click(function () {
    imgWindow.addClass('big-img-window-active');
    loader.addClass('loader-on');
    if (imgWindow.hasClass('big-img-window-active')) {
      inWrapperImg.load(function () {
        loader.removeClass('loader-on');
        setTimeout(function () {
          imgWrapper.addClass('img-wrapper-drop');
        }, 1);
        var wrapperWidth = imgWrapper.width() + 60;
        var wrapperHeight = imgWrapper.height() + 60;
        imgWrapper.css({
          'marginLeft': wrapperWidth * -0.5,
          'marginTop': wrapperHeight * -0.5
        });
        $('.img-wrapper a').attr('href', $(this).attr('src'));
      }).attr('src', $(this).attr('src'));
    };
  });

  $('.big-img-close').click(function () {
    imgWrapper.addClass('jump-big-img');
    setTimeout(function () {
      imgWindow.removeClass('big-img-window-active');
      imgWrapper.removeClass('img-wrapper-drop');
    }, 600);
    setTimeout(function () {
      imgWrapper.removeClass('jump-big-img');
    }, 700);
  });
}); //ready end