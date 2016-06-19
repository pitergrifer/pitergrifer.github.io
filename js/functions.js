// функция проверки типа устройства
function isMobile() {
  if (navigator.userAgent.match(/Android/ig) ||
      navigator.userAgent.match(/webOS/ig) ||
      navigator.userAgent.match(/iPhone/ig) ||
      navigator.userAgent.match(/iPod/ig) ||
      navigator.userAgent.match(/iPad/ig) ||
      navigator.userAgent.match(/Blackberry/ig)) { // true - если мобильные устройства
    return true;  
  } else { // false - если настольные
    return false;
  };
};

// функция замера высоты всей страницы с прокруткой
function scrollHeight() {
  return +Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
};

// функция замера высоты прокрученной области страницы
function windowTopScroll() {
  return window.pageYOffset || document.documentElement.scrollTop;
};

// функция замера ширениы прокрученной области страницы
function windowLeftScroll() {
  return window.pageXOffset || document.documentElement.scrollLeft;
};