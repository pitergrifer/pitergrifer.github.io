var PAGE_HEIGHT = scrollHeight(); // высота станицы с прокруткой сразу после загрузки (константа) 

/* Логика окна запроса даты рождения */
function AskingDate(options) {
  var elem = options.elem;
  var elemHeight = elem.offsetHeight;
  var dayField = options.day;
  var monthField = options.month;
  var yearField = options.year;
  var startBtn = options.startBtn;
  var btnDefaultValue = startBtn.getAttribute('value');
  var result = options.result;
    
  // вертикальная отцентровка объекта относительно окна
  var newTop = (document.documentElement.clientHeight / 2) - (elem.offsetHeight / 2);
  elem.style.top = newTop + "px";
  
  // функция проверки валидности ввода 
  function checkField(event) {
    event = event || window.event;
    var target = event.target;
    
    if (target.getAttribute('type') != 'text') return;
    
    startBtn.value = btnDefaultValue; // сброс значения кнопки (см. событие 'onclick' ниже)
    
    // проверка userAgent
    if (isMobile()) { // если мобильные устройства
      target.onchange = function() {
        if ((dayField.value.length == 2) && (monthField.value.length == 2) && (yearField.value.length == 4)) {
          startBtn.className = "btn-active";
        } else {
          startBtn.className = "btn-disabled";
        };
      };
    } else { // если настольные устройства
      var checkKey; // переменная-выражение проверки нажатой клавиши
      var checkspecialKey; // переменная-выражение обратная предыдущей для проверки специальной клавиши
      var keyPressed = false; // переменная, проверяющая зажатие Shift

      target.onkeydown = function(event) {
        if ((event.keyCode > 47) && (event.keyCode < 58)) { // проверка на номера 
          checkKey = (event.keyCode > 47) && (event.keyCode < 58);
          checkspecialKey = checkKey; 
        } else if ((event.keyCode > 95) && (event.keyCode < 106)) { // проверка на номара (Num-pad)
          checkKey = (event.keyCode > 95) && (event.keyCode < 106);
          checkspecialKey = checkKey; 
        } else if (event.keyCode == 8) { // проверка на Backspace
          checkKey = event.keyCode == 8;
          checkspecialKey = event.keyCode != 8;
        } else if (event.keyCode == 46) { // проверка на Del
          checkKey = event.keyCode == 46;
          checkspecialKey = event.keyCode != 46;
        } else if ((event.keyCode > 36) && (event.keyCode < 41)) { // проверка на стрелки
          checkKey = (event.keyCode > 36) && (event.keyCode < 41);
          checkspecialKey = !((event.keyCode > 36) && (event.keyCode < 41));
        } else { // иначе вернуть ложь
          checkKey = false;
          checkspecialKey = false;
        };

        if (event.keyCode == 16) { // проверить нажатие Shift для отлова вывода спец. символов
          keyPressed = true;
        };

        // основной блок с условиями проверки ввода и соответствующей логики
        if (checkKey && !keyPressed) {
          if ((target.getAttribute('id') == 'day') || (target.getAttribute('id') == 'month')) {
            if (target.value.length > 1) {
              if (checkspecialKey) {
                return false;  
              };
            };  
          } else if (target.getAttribute('id') == 'year') {
            if (target.value.length > 3) {
              if (checkspecialKey) {
                return false;  
              };
            };
          };  
        } else if (!checkKey || !checkspecialKey || keyPressed) {
          return false;
        };
      };

      // установка автофокуса и установка активного/деактивного класса кнопке начала теста   
      target.onkeyup = function() {
        keyPressed = false;

        if (target.value.length == 2) { // установка автофокуса
          target.nextElementSibling.focus();  
        } else if (target.value.length == 0) {
          target.previousElementSibling.focus();
        };

        // установка класса на стартовую кнопку
        if ((dayField.value.length == 2) && (monthField.value.length == 2) && (yearField.value.length == 4)) {
          startBtn.className = "btn-active";
        } else {
          startBtn.className = "btn-disabled";
        };
      };
    };
  };
  
  // функция вызова подсказки
  function callHelper(event) {
    event = event || window.event;
    var target = event.target;
    
    if (target.getAttribute('type') != 'text') return;
    
    // создание элемента-подсказки
    var helper = document.createElement('span');
    helper.className = 'helper';
    var helperText = target.getAttribute('data-helper');
    helper.innerHTML = helperText;
    
    // создание стрелки
    var helperArrow = document.createElement('div');
    helperArrow.className = 'arrow arrow-to-bottom';
    
    
    // специальный таймер задержки для корректного вывода подсказки
    var timerForCoords = setTimeout(function() {
      // добавление элемента-подсказки и стрелки
      document.body.appendChild(helper);
      helper.appendChild(helperArrow);
      
      // расчет координат элемента-подсказки и его стрелки  
      var targetCoords = target.getBoundingClientRect();
      var newHelperTop = targetCoords.top - helper.offsetHeight - 10 + windowTopScroll();
      var newHelperLeft = targetCoords.left - (helper.offsetWidth / 2) + (target.offsetWidth / 2);
      var newArrowTop = helper.offsetHeight - 2;
      var newArrowLeft = (helper.offsetWidth / 2) - (helperArrow.offsetWidth / 2);
      
      // условия позиционирования, учитывающие "вылеты" за грани экрана
      // "вылет" за верхнюю грань 
      if ((newHelperTop - windowTopScroll()) < 0) {
        newHelperTop = targetCoords.bottom + 10 + windowTopScroll();
        helperArrow.className = 'arrow arrow-to-top';
        newArrowTop = -18;
      };
      // "вылет" за левую грань
      if ((newHelperLeft - windowLeftScroll()) < 0) { 
        newHelperLeft = 0;
        newArrowLeft = (targetCoords.left + (target.offsetWidth / 2)) - (helperArrow.offsetWidth / 2) + windowLeftScroll();
      };
      // "вылет" за правую грань
      if ((document.documentElement.clientWidth - (newHelperLeft + helper.offsetWidth)) < 0) {
        newHelperLeft += document.documentElement.clientWidth - (newHelperLeft + helper.offsetWidth);
        newArrowLeft = (targetCoords.left + (target.offsetWidth / 2)) - (document.documentElement.clientWidth - helper.offsetWidth + (helperArrow.offsetWidth / 2));
      };
      
      // позиционирование элемента-подсказки
      helper.style.top = newHelperTop + "px";
      helper.style.left = newHelperLeft + "px";
    
      // позиционирование срелки
      helperArrow.style.top = newArrowTop + "px";
      helperArrow.style.left = newArrowLeft + "px";   
    }, 500);
    
    // удаление подсказки после потери фокуса на цели
    target.onblur = function() {
      clearTimeout(timerForCoords);
      document.body.removeChild(helper);
    };
  };
  
  // функция генерации сетки-результата
  var generationTime; // переменная вынесена из замыкания нарочно
  function genereteResult() {
    //засечь время начала генерации
    var startGeneration = new Date();
    
    // расчет оптимальной ширины сетки-результата
    var resultBlockWidth;
    if (scrollHeight() < document.body.clientWidth) {
      resultBlockWidth = scrollHeight();  
    } else if (scrollHeight() > document.body.clientWidth) {
      resultBlockWidth = document.body.clientWidth;
    };
    result.style.width = resultBlockWidth - 10 + "px";
    
    // расчет количества столбцов
    var columns;
    var sizeCoefficient = PAGE_HEIGHT / document.body.clientWidth;
    
    if (sizeCoefficient >= 1.4) {
      columns = 1;
    } else if (sizeCoefficient < 1.4) {
      columns = 3;
    };
    var rows = 9 / columns;
    
    for (var i = 0; i < rows; i++) { // цикл наполнения по Y 
      for (var j = 0; j < columns; j++) { // цикл наполнения по X
        // создание и добавление элемента
        var blockFeature = document.createElement('div');
        blockFeature.className = 'feature';
        result.appendChild(blockFeature);
        blockFeature.style.width = (result.clientWidth / columns) - (15 * (columns - 1)) + "px";
        blockFeature.style.height = blockFeature.offsetWidth + "px";
        
        // позиционирование элементов
        blockFeature.style.top = (blockFeature.offsetHeight * i) + (15 * i) + "px";
        var calculateCenteringX = (result.offsetWidth / 2) - (((blockFeature.offsetWidth * columns) + (15 * (columns - 1))) / 2);
        blockFeature.style.left = (blockFeature.offsetWidth * j) + (15 * j) + calculateCenteringX + "px";
        var calculateCenteringY = (scrollHeight() / 2) - (((blockFeature.offsetHeight * rows) + (15 * (rows - 1))) / 2);
        if (calculateCenteringY < 0) {
          calculateCenteringY = 10;
        };
        result.style.top = calculateCenteringY + "px";
        result.style.left = document.body.clientWidth / 2 - result.offsetWidth / 2 + "px";
      };
    };
    
    // время окончания генерации
    var endGeneration = new Date();
    
    // затраченное время на генерацию 
    generationTime = endGeneration - startGeneration;
    return generationTime;
  };
  
  // специальный метод добавление слушателя на событие 'focus' с делегированием  
  if (elem.addEventListener) { // все браузеры 
    elem.addEventListener('focus', checkField, true);
    elem.addEventListener('focus', callHelper, true);
  } else { // браузеры IE
    elem.onfocusin = checkField;
    elem.onfocusin = callHelper;
  };
  
  // обработка события нажатия на клавишу запуска теста
  elem.onclick = function(event) {
    event = event || window.event;
    var target = event.target;
    
    if (target.getAttribute('type') != 'button') return;
    
    // изменение текста кнопки старта, в зависимости от класса валидности данных,
    // а также, в случае правильного ввода, переход на следующую стадию
    if (target.className == 'btn-disabled') {
      target.value = "Вы ввели не все данные!"; 
    } else if (target.className == 'btn-active') {
      if ((dayField.value > 31) || (monthField.value > 12) || (yearField.value > new Date().getFullYear)) {
        target.value = "Такой даты не существует!"
      } else {
        target.value = "Загрузка...";
        genereteResult();
        setTimeout(function() {
          elem.className += " hide";
        }, generationTime);
        setTimeout(function() {
          elem.style.display = "none";
          result.style.visibility = "visible";
        }, 400);
      };
    };
  };
  
  // вывод значений полей в глобальную область видимости
  this.day = +dayField.value;
  this.month = +monthField.value;
  this.year = +yearField.value;
};

var askingDateWindow = new AskingDate({
  elem: document.querySelector('.ask-date'),
  day: document.getElementById('day'),
  month: document.getElementById('month'),
  year: document.getElementById('year'),
  startBtn: document.getElementById('start'),
  result: document.getElementById('result')
});