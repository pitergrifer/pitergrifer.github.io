function Preloader(options) {
  var elem = options.elem;
  var sleep = options.sleep;
  var elemText = elem.firstElementChild;
  
  elemText.style.top = (elem.offsetHeight / 2) - (elemText.offsetHeight / 2) + "px";
  
  window.onload = function() {
    setTimeout(function() {
      document.body.removeChild(elem);
    }, sleep);
  };
};

var preloader = new Preloader({
  elem: document.getElementById('preload'),
  sleep: 1000
});