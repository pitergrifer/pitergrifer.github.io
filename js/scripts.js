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
  var newTop = (document.body.clientHeight / 2) - (elem.offsetHeight / 2);
  elem.style.top = newTop + "px";
  
  // функция проверки валидности ввода 
  function checkField(event) {
    event = event || window.event;
    var target = event.target;
    
    if (target.getAttribute('type') != 'text') return;
    
    startBtn.value = btnDefaultValue; // сброс значения кнопки (см. событие 'onclick' ниже)
    
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
        startBtn.classList = 'btn-active';
      } else {
        startBtn.classList = 'btn-disabled';
      };
    };
  };
  
  // функция вызова подсказки
  function callHelper(event) {
    event = event || window.event;
    var target = event.target;
    
    if (target.getAttribute('type') != 'text') return;
    
    // создание элемента-подсказки и его позиционирование
    var helper = document.createElement('span');
    helper.className = 'helper';
    var helperText = target.getAttribute('data-helper');
    helper.innerHTML = helperText;
    var targetCoords = target.getBoundingClientRect();
    document.body.appendChild(helper);
    helper.style.top = targetCoords.top - helper.offsetHeight - 10 + "px";
    helper.style.left = targetCoords.left - (helper.offsetWidth / 2) + (target.offsetWidth / 2) + "px";
    
    //создание декоративной срелки
    var helperArrow = document.createElement('div');
    helperArrow.className = 'arrow';
    helper.appendChild(helperArrow);
    helperArrow.style.top = helper.offsetHeight + "px";
    helperArrow.style.left = (helper.offsetWidth / 2) - (helperArrow.offsetWidth / 2) + "px"; 
    
    // удаление подсказки после потери фокуса на цели
    target.onblur = function() {
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
    if (document.body.clientHeight < document.body.clientWidth) {
      resultBlockWidth = document.body.clientHeight;  
    } else if (document.body.clientHeight > document.body.clientWidth) {
      resultBlockWidth = document.body.clientWidth;
    };
    result.style.width = resultBlockWidth - 10 + "px";
    
    // расчет количества столбцов
    var columns;
    var sizeCoefficient = document.body.clientHeight / document.body.clientWidth;
    if (sizeCoefficient > 1.6) {
      columns = 1;
    } else if (sizeCoefficient < 1.6) {
      columns = 3;
    };
    var rows = 9 / columns;
    
    var scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
    
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
        var calculateCenteringY = (scrollHeight / 2) - (((blockFeature.offsetHeight * rows) + (15 * (rows - 1))) / 2);
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
  if (elem.addEventListener) {
    elem.addEventListener('focus', checkField, true);
    elem.addEventListener('focus', callHelper, true);
  } else {
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
        alert(genereteResult.perfomence());
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
