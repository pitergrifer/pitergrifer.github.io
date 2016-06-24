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
  var loadTimeSleep = options.loadTimeSleep;
  
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
        } else if ((event.keyCode > 95) && (event.keyCode < 106)) { // проверка на номера (Num-pad)
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
        
        function detectFieldLength() { // функция засечки длины активного поля ввода
          if ((target.id == 'day') || (target.id == 'month')) {
            return 2;
          } else if (target.id == 'year') {
            return 4;
          };
        };
        
        if (target.value.length == detectFieldLength()) { // установка автофокуса
          if (detectFieldLength() == 2) {
            target.nextElementSibling.focus();  
          } else if (detectFieldLength() == 4) {
            startBtn.focus();
          };  
        } else if (target.value.length == 0) {
          if (target.previousElementSibling != null) {
            target.previousElementSibling.focus();
          };
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
      var newHelperLeft = targetCoords.left - (helper.offsetWidth / 2) + (target.offsetWidth / 2) + windowLeftScroll();
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
        newHelperLeft = 0 + windowLeftScroll();
        newArrowLeft = (targetCoords.left + (target.offsetWidth / 2)) - (helperArrow.offsetWidth / 2);
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
      if (helper.getAttribute('style') != null) {
        document.body.removeChild(helper);
      };
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
        result.style.height = (blockFeature.offsetHeight * rows) + (15 * (rows - 1)) + "px";
      };
    };
    
    // затраченное время на генерацию 
    generationTime = new Date() - startGeneration;
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
    if (target.className.search(/warn/ig) >= 0) { // проверка на наличие класса "warn"
      return false;
    } else if (target.value != "Начать тест") { // проверка value кнопки старта
      var prevClass = target.className;
      target.className += " warn";
      setTimeout(function() {
        target.className = prevClass;
      }, 300);
    } else if (target.className == "btn-disabled") { // проверка на деактивный класс
      target.value = "Вы ввели не все данные!";
    } else if (target.className == "btn-active") { // проверка на активный класс и валидность даты
      if ((dayField.value > 31) || (monthField.value > 12) || (yearField.value > new Date().getFullYear())) {
        target.value = "Такой даты не существует!";
      } else { // если все хорошо - генерировать сетку
        var fieldsValues = dayField.value + monthField.value + yearField.value;
        if (isDigit(fieldsValues)) {
          target.value = "Загрузка...";
          setTimeout(function() {
            genereteResult();
            console.log(generationTime);
            setTimeout(function() {
              elem.className += " hide";
            }, generationTime);
            setTimeout(function() {
              elem.style.display = "none";
              result.style.visibility = "visible";
            }, generationTime + 400); // 400 - время на анимацию в мс
          }, loadTimeSleep); // задержка необходима для мобильных устройств (виртуальная клавиатура влияет на генерацию сетки)
        } else {
          target.value = "Используйте только числа!";
        };
      };
    };
  };
  
  // вывод объектов полей в глобальную область 
  this.dayField = dayField;
  this.monthField = monthField;
  this.yearField = yearField;
  
  // вывод значений полей в глобальную область видимости
  this.day = function() {
    return +dayField.value; 
  };
  this.month = function() {
    return +monthField.value;
  };
  this.year = function() {
    return +yearField.value;  
  };
  
  // вывод стадии готовности "result" в глобальную область
  this.complete = function() {
    if (result.children.length == 0) {
      return false;
    } else {
      return true;
    };
  };
  
  // вывод элемента "result" в глобальную область видимости
  this.result = result;
  
  this.startBtn = startBtn;
};

// Создание объекта окна запроса даты рождения
var askingDateWindow = new AskingDate({
  elem: document.querySelector('.ask-date'),
  day: document.getElementById('day'),
  month: document.getElementById('month'),
  year: document.getElementById('year'),
  startBtn: document.getElementById('start'),
  result: document.getElementById('result'),
  loadTimeSleep: 1000
});

/* Логика сетки-результата */
function Result(options) {
  var elem = options.elem;
  var features = options.features;
  
  // функця расчетов 
  function calculations() {
    // получение первого рабочего числа
    var dayAndMonthAsStiring = askingDateWindow.day().toString() + askingDateWindow.month().toString(); 
    var firstPart = 0;
    for (var i = 0; i < dayAndMonthAsStiring.length; i++) {
      firstPart += parseInt(dayAndMonthAsStiring[i]); 
    };
    var yearAsString = askingDateWindow.year().toString();
    var secondPart = 0;
    for (var j = 0; j < yearAsString.length; j++) {
      secondPart += parseInt(yearAsString[j]);
    };
    var firstNumber = firstPart + secondPart;
    
    // получение второго рабочего числа
    var firstNumberAsString = firstNumber.toString();
    var secondNumber = 0;
    for (var k = 0; k < firstNumberAsString.length; k++) {
      secondNumber += parseInt(firstNumberAsString[k]);
    };
    
    // получение третьего рабочего числа
    var thirdNumber = firstNumber - (parseInt(askingDateWindow.day().toString()[0]) * 2);
    
    // получение четвертого рабочего числа
    var thirdNumberAsString = thirdNumber.toString();
    var fourthNumber = 0;
    for (var l = 0; l < thirdNumberAsString.length; l++) {
      fourthNumber += parseInt(thirdNumberAsString[0]);
    };
    
    // получение строки-результата, из которой будут собираться наборы из одинаковых цифр 
    return firstNumber.toString() + secondNumber.toString() + thirdNumber.toString() + fourthNumber.toString() + dayAndMonthAsStiring + yearAsString;
  };
  
  // кэширование данных функции c расчетами
  var calculationsResult = calculations();
  
  // функция сбора цифр в наборы
  function makeNumberPack() {
    var number = {};
    var pickUp = [];
    for (var i = 1; i < 10; i++) {
      pickUp = calculationsResult.match(new RegExp(i, 'ig'));
      if (pickUp == null) {
        pickUp = [];
      };
      number[i] = pickUp.length;
    };
    return number;
  };
  
  // кэширование данных функции создания набора цифр
  var numberPack = makeNumberPack();
  
  // функция создания характера
  function makePersonality() {
    var personality = {};
    var categories = [
      nature = [
        "", // костыль
        "Очень эгоистичный человек, думающий только о себе. Во всем ищет личную выгоду.",
        "Человек эгоистичный, но иногда может подумать о других.",
        "Человек с положительным устойчивым характером.",
        "Xарактер очень волевой и сильный.",
        "Cамодур и диктатор.",
        "Жестокий человек, но для близких пойдёт на всё. Крайне неприятен в общении. Подобные люди, к счастью, встречаются очень редко."
      ],
      bioenergy = [
        "Биополе отсутствует. Канал открыт для активного поглощения энергии. Таким людям нравятся старые вещи (коллекционеры). Они неплохо относятся к окружающим, но при этом пытаются поживиться за счёт других, \"поглощая\" их биополе.",
        "Биоэнергии хватает для жизни, но в данный момент её маловато, поэтому надо заниматься спортом. Эти люди сверхчувствительны к атмосферным перепадам.",
        "Биоэнергии достаточно, такой человек способен лечить других людей.",
        "Хороший экстрасенс.",
        "Этих людей очень любит противоположный пол. Однако если добавляются три шестёрки (666), нужно быть осторожнее!"
      ],
      orderliness = [
        "Очень аккуратный и пунктуальный человек, который выделяется среди окружающих культурной речью и воспитанностью.",
        "У таких людей всё зависит от настроения. Они не любят беспорядок, но уборку проводят опять-таки в зависимости от настроения(хочу- делаю. хочу - нет).",
        "Хорошие способности к точным наукам (математике, физики, химии).",
        "Способность к наукам. Аккуратные до занудства.",
        "Из этих людей получаются хорошие учёные. Отличительные черты - педантизм, аккуратность."
      ],
      health = [
        "У этого человека проблемы со здоровьем.",
        "Здоровье нормальное, болезни начинаются в преклонном возрасте.",
        "Очень здоровый человек, обладающий высокой сопротивляемостью болезням, живым темпераментом.",
        "Чрезвычайно здоровый человек, обладающий высокой сопротивляемостью болезням, живым темпераментом."
      ],
      intuition = [
        "Человек родился с неоткрытым коналом интуиции. Он активен, старается что-то предпринять. Всегда обдумывает свои действия, но неизбежно совершает много ошибок. Таким людям приходится пробивать себе дорогу в жизни тяжёлым трудом.",
        "Канал открытый, эти люди делают не очень много ошибок в жизни.",
        "Сильно развитая интуиция. Такие люди могут быть следователями или юристами.",
        "Практически ясновидящие. Все, то происходит вокруг, им понятно. Они знают, что делать.",
        "Таким людям подвластно время и пространство, они могут проникать в другие измерения."
      ],
      grounded = [
        "Человек пришёл в этот мир, чтобы получить профессию. Физический труд он нелюбит, но он вынужден им заниматься.",
        "Земной человек. Думает об учёбе, но без физической работы ему не обойтись.",
        "Любит трудиться, хотя физическая работа для него - только хобби.",
        "Знак тревожный. Очень привлекательный и темпераментный человек, однако потребует от партнёра больших денежных затрат.",
        "Этот человек в своих предыдущих земных превращениях много и тяжело работал."
      ],
      talent = [
        "Человек станет талантливым в своих последующих превращениях. А в нынешней жизни его ждёт тяжёлая судьба.",
        "У этого человека есть неярко выраженный талант.",
        "Такие люди очень талантливы. Они музыкальны, имеют художественный вкус, могут риовать. Челове этого знака наделён всем - и хорошим, и плохим. Для него не существует закрытых дверей. Даже если он попадёт под суд, ему помогут выиграть судебный процесс.",
        "Такие люди столкиваются с серьёзными трудностями.",
        "Люди с такой комбинацией цифр должны быть очень осмотрительны."
      ],
      responsibility = [
        "Человек легко берёт в долг, но не спешит отдавать.",
        "Человек с развитым чувством ответственности.",
        "Очень развито чувство ответственности. Этот человек всегда готов помочь другим людям.",
        "Человек призван служить народу.",
        "Человек имеет паропсихологические способности, а также имеет способности в области точных наук."
      ],
      intellect = [
        "", // костыль
        "Такому человеку надо развивать свой ум.",
        "Умная голова, но дана лентяю.",
        "Умный, удачливый человек.",
        "Человек редкого ума, однако груб и немилосерден."
      ]
    ];
    for (var i = 1; i < 10; i++) {
      var resetCounter = 0;
      while (numberPack[i] != resetCounter) {
        resetCounter++;
      };
      if (numberPack[i] == resetCounter) {
        personality[i] = categories[i - 1][resetCounter];
      };
    };
    return personality;
  };
  
  // кэширование данных функции создания набора личностных качеств
  var personalityPack = makePersonality();
  
  // функция, наполняющая сетку контентом, который генерируется в зависимости от расчетов (вызывается тут же)
  function fillFeatures() {
    var featuresTitles = [
      "Характер",
      "Биоэнергия",
      "Организованность",
      "Здоровье",
      "Интуиция",
      "Заземлённость",
      "Талант",
      "Ответственность",
      "Интеллект"
    ];
    for (var i = 0; i < features.length; i++) {
      var titleText = document.createTextNode(featuresTitles[i]);
      var titleBlock = document.createElement('span');
      titleBlock.appendChild(titleText);
      features[i].appendChild(titleBlock);
      titleBlock.style.fontSize = titleBlock.parentElement.offsetWidth / 2 * 0.1 * 0.1 + "em";
      titleBlock.style.top = (features[i].offsetHeight / 2) - (titleBlock.offsetHeight / 2) - 25 + "px";
      features[i].setAttribute('data-content', personalityPack[i + 1]);
      features[i].setAttribute('data-visited', 'false'); 
    };
  }; fillFeatures();
  
  // переменная, отсчитывающая количество кликов по карточкам
  var clickCounter = 0;
  
  // событие на клик по элементу result с делегированием
  elem.onclick = function(event) {
    event = event || window.event;
    var target = event.target;
    
    // функция поворота карты, принимающая аргумент target
    function rotateCard(target) {
      if (target.getAttribute('data-visited') == 'false') { // проверка значения атрибута "посещенность"
        clickCounter++; // если пользователь открыл карту первый раз, то увеличить переменную на один
        target.setAttribute('data-visited', 'true');
      };
      target.className += " rotate-card-normal";
      // таймеры нужны для эффекта "переворота" карты
      setTimeout(function() {
        target.firstChild.style.fontSize = target.offsetWidth / 2 * 0.1 * 0.1 + "em";
        var cachedDataContent = target.firstChild.innerHTML; 
        target.firstChild.innerHTML = target.getAttribute('data-content');
        target.firstChild.style.top = (target.offsetHeight / 2) - (target.firstChild.offsetHeight / 2) - 25 + "px";
        target.setAttribute('data-content', cachedDataContent);
        target.className += " rotate-card-reverse";
      }, 500);
      setTimeout(function() {
        target.className = "feature";
      }, 1000);
    };
    
    // вызов функции поворота карты с разными аргументами, зависящими от условий 
    if ((target.getAttribute('class') == 'feature') && (target.tagName == "DIV")) {
      rotateCard(target);
    } else if (target.tagName == "SPAN") {
      rotateCard(target.parentElement);
    } else {
      return;
    };
    
    // если счетчик кликов ровняется 9 - показать кнопку повторного начала теста 
    if (clickCounter == 9) {
      document.getElementById('restart').style.top = "0";
    };
  };
};

// Создание объекта сетки-результата должно происходить через эту рекурсивную функцию...
// она проверяет завершенность генерации сетки-результата
function checkComplete() {
  if (!askingDateWindow.complete()) {
    setTimeout(function() {
      checkComplete();
    }, 1000);  
  } else {
    var result = new Result({
      elem: askingDateWindow.result,
      features: document.querySelectorAll('.feature')
    });
  };
}; checkComplete(); // вызов функци

/* Логика объекта кнопки повторного начала теста */
function RestartTest(options) {
  var elem = options.elem;
  var ask = options.ask;
  var startBtn = options.start
  
  elem.style.top = elem.offsetHeight * -1 + "px";
  
  elem.onclick = function() {
    this.style.top = this.offsetHeight * -1 + "px";
    
    askingDateWindow.dayField.value = "";
    askingDateWindow.monthField.value = "";
    askingDateWindow.yearField.value = "";
    
    askingDateWindow.startBtn.value = "Начать тест";
    askingDateWindow.startBtn.className = "btn-disabled";
    
    askingDateWindow.result.className = "hide";
    
    setTimeout(function() {
      askingDateWindow.result.removeAttribute('class');
      
      askingDateWindow.result.removeAttribute('style');
      askingDateWindow.result.innerHTML = "";
      
      ask.style.display = "block";
      ask.className = "ask-date";
      
      checkComplete();
    }, 400);
  };
};

// Создание кнопки повторного начала теста
var restartTest = new RestartTest({
  elem: document.getElementById('restart'),
  ask: document.querySelector('.ask-date')
});

/* Логика объекта информационного окна */
function AboutTest(options) {
  var elem = options.elem;
  var infoText = options.infoText;
  var scroller = options.scroller;
  
  // установка размеров инфрмационного окна, относительно окна запроса даты рождения
  var askingDateWindowWidth = document.querySelector('.ask-date').offsetWidth;
  elem.style.width = askingDateWindowWidth + "px";
  var askingDateWindowHeight = document.querySelector('.ask-date').offsetHeight;
  elem.style.height = askingDateWindowHeight + "px";
  
  // горизонтальное и вертикальное позиционирование информационного окна
  var askingDateWindowCoords = document.querySelector('.ask-date').getBoundingClientRect();
  elem.style.left = askingDateWindowCoords.left + "px";
  elem.style.top = askingDateWindowCoords.top + "px";
  
  // позиционирование полосы прокрутки
  var infoCoords = elem.getBoundingClientRect();
  if (elem.clientHeight < infoText.offsetHeight) {
      var scrollerHeight = elem.clientHeight - (infoText.offsetHeight - elem.clientHeight);
    if (scrollerHeight < 10) {
      scrollerHeight = 10;
    };
      scroller.style.height = scrollerHeight + "px";
  };
  scroller.style.top = infoCoords.top + 10 + "px";
  scroller.style.left = infoCoords.right - scroller.offsetWidth + "px";
  
  // отслеживание события "перетаскивания" ползунка
  scroller.onmousedown = function(event) {
    event = event || window.event;
    
    // переменная для корректного расчета координат "захвата" курсором ползунка
    var сorrectPick = event.clientY - scroller.getBoundingClientRect().top;
    
    // функция расчета новых координат ползунка и скролирование текста
    function dragScroller(event) {
      
      var scrollerCoordsOld = scroller.getBoundingClientRect(); // первоначальные координаты ползунка
      var newTop = event.clientY - сorrectPick; // смещение ползунка по оси Y
      var topEdge = infoCoords.top + 10; // вычисление максимально допустимой верхней границы прокрутки
      var bottomEdge = elem.clientHeight - scroller.offsetHeight + 10; // вычисление максимально допустимой нижней границы прокрутки
      
      if (newTop < topEdge) { // проверка на "вылет" за верхнюю границу 
        newTop = topEdge;
      } else if (newTop > (bottomEdge + infoCoords.top)) { // проверка на "вылет" за нижнюю границу
        newTop = bottomEdge + infoCoords.top;
      };
      
      scroller.style.top = newTop + "px"; // установка новых координат ползунка
      
      // прокрутка видимой области в зависимости от разницы первоначальных и конечных координат ползунка 
      var scrollerCoordsNew = scroller.getBoundingClientRect();
      elem.scrollBy(0, (scrollerCoordsNew.top - scrollerCoordsOld.top));
    };
    
    dragScroller(event);
    
    // отслеживание события перемещения ползунка на документе, чтобы избежать проблемы с потерей захвата последнего 
    document.onmousemove = function(event) {
      dragScroller(event);
    };
    
    // отслеживание прекращения перемещения ползунка
    document.onmouseup = function() {
      document.onmousemove = null;
      document.onmouseup = null;
    };
    
    return false;
  };
};

// Создание информационного окна
var aboutTest = new AboutTest({
  elem: document.getElementById('info'),
  infoText: document.querySelector('#info span'),
  scroller: document.querySelector('#info div')
});