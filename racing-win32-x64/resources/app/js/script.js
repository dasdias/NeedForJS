const   score = document.querySelector('.score');
const   start = document.querySelectorAll('.start');
const   startWindow = document.querySelector('.game');
const   gameArea = document.querySelector('.gameArea'),
        car = document.createElement('div'),
        modalScore = document.querySelector('.modal'),
        controls = document.querySelector('.controls'),
        modalButton = document.querySelector('.modal--button'),
        modalContainer = document.querySelector('.modal-container'),
        modalScoreOut = document.querySelector('.modal-score'),
        modalResult = document.querySelector('.modal--result'),
        record = document.querySelector('.score-record'),
        resetScore = document.querySelector('.controls-button'),
        audio = new Audio();
        // music = document.createElement('embed'); 
        // music = document.createElement('audio');
        car.classList.add('car');
    // console.log(Math.floor(Math.random() * (5 - 1 + 1)) + 1);

    start.forEach(function(item){ 
        // console.log(item);
        item.addEventListener('click', getLevel); // устанавливаем нужный уровень сложности
        item.addEventListener('click', startGame); // запускаем игру
        // let level = item.getAttribute('data-level');
    });

    document.addEventListener('keydown', startRun);
    document.addEventListener('keyup', stopRun);
    document.addEventListener('keydown', pauseGame);
    // modalButton.addEventListener('click', function(){
    //     modalScore.style.display = 'none';
    // });
    
    const keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowRight: false,
        ArrowLeft: false,
        32: 32
    };
    
    const setting = {
        start: false,
        score: 0,
        speed: 3,
        traffic: 3,
        
    };

    // ждем загрузки всего документа
    document.addEventListener('DOMContentLoaded', function(){ 

        // вешаем обработчик событий
        resetScore.addEventListener('click', () => {
            storage.removeItem('score'); // удаляем счет в localStorage
            record.innerHTML = '0'; // перезаписываем рекорд балов на странице
        });

        // если в localStorage есть балы то записываем их на странице
        if (storage.getItem('score')) {
            record.textContent = storage.getItem('score');
        } else { // если нет, то записываем ноль
            record.textContent = 0;
        }
    });

// получаем data-level для установки уровня сложности
    function getLevel() { 
        let level = this.getAttribute('data-level');
        if (+level === 3) {
            setting.speed = +level;
            setting.traffic = 3;
        } if (+level === 8) {
            setting.speed = +level;
            setting.traffic = 2;
        } if (+level === 12) {
            setting.speed = +level;
            setting.traffic = 3;
        }
    }

    // Получаем кол-во элементов
    function getQuantityElements(heightElement) {
        return Math.floor(gameArea.offsetHeight / heightElement + 1);
    }
    
    function startGame(){
        startWindow.classList.add('hide');
        gameArea.innerHTML = '';
        // console.log(gameArea.offsetHeight);
        // console.log(gameArea.offsetHeight);

        // создаём линии
        for (let i = 0; i < getQuantityElements(100); i++) {
            const line = document.createElement('div');
            line. classList.add('line');
            line.style.top = (i * 100) +'px';
            line.y = i * 100;
            gameArea.appendChild(line);
        }

        gameArea.appendChild(car);

        // добавляем музыку
        audio.setAttribute('src', './mp3/cospe-cotton-candy.mp3');
        audio.setAttribute('controls', true);
        audio.classList.add('music');
        audio.setAttribute('loop', true);
        // Запускаем музыку только если mp3 файл загрузился
        audio.addEventListener('loadeddata', () => {
            controls.appendChild(audio);
            audio.play();
        });

        // console.log(audio);
        
        // music.setAttribute('src', './mp3/cospe-cotton-candy.mp3');
        // music.setAttribute('autoplay', true);
        // music.setAttribute('loop', true);
        // music.setAttribute('controls', true);
        // music.setAttribute('type', 'audio/mp3');
        // music.classList.add('music');
        // controls.appendChild(music);

// определяем положение машинки пользователя при старте
        car.style.left = (gameArea.offsetWidth / 2) - (car.offsetWidth / 2) + 'px';
        car.style.top = 'auto';
        
        // создаём машинки
        for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
            const enemy = document.createElement('div');
            enemy.classList.add('enemy');
            enemy.y = -100 * setting.traffic * (i + 1);
            enemy.style.top = enemy.y + 'px';
            // for (let k = 0; k < getQuantityElements(100 * setting.traffic); k++) {
                //         enemy.style.background = 'transparent url(./img/enemy'+ i +'.png) center /cover no-repeat';
                //     }
                const random = Math.floor(Math.random() * (6 - 0 + 1)) + 1;
                enemy.style.background = `transparent url(./img/enemy${random}.png) center /cover no-repeat`;
                enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50) ) + 'px';
                gameArea.appendChild(enemy);
                
            }
            setting.score = 0;
            setting.start = true;
            setting.x = car.offsetLeft;
            setting.y = car.offsetTop;

            if (setting.start) {
                scoreModalClose();
                requestAnimationFrame(playGame);
            }
        }
        
        function playGame(){
            // console.log('Play Game!');
            if (setting.start) {
                setting.score += setting.speed;
                score.textContent = setting.score;
                moveRoad();
                moveEnemy();
                scoreResult();
                // scoreModalClose();
                
                
                if (keys.ArrowLeft && setting.x  > 0) {
                    setting.x -= setting.speed;
                }
                
                if (keys.ArrowRight && setting.x <  (gameArea.offsetWidth - car.offsetWidth) ) {
                    setting.x += setting.speed;
                }

        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }

        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;
        }


        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';

        requestAnimationFrame(playGame);
    }
}
// Функция записи в объект keys - true
function startRun(event){
    event.preventDefault();
    // Если "имя" нажатой клавиши есть в объекте keys то этому св-ву присваиваем true
    if (keys.hasOwnProperty(event.key)){
        keys[event.key] = true;
    }
}

// Функция записи в объект keys - false
function stopRun(event){
    event.preventDefault();
    if (keys.hasOwnProperty(event.key)){
        keys[event.key] = false;
    }    
}

// функция паузы в игре
function pauseGame(event){
    event.preventDefault();
    if (keys.hasOwnProperty(event.which)){ 
        switch (setting.start) {
            case true:
                setting.start = false;
                audio.pause();
                break;
                case false:
                    setting.start = true;
                    playGame();
                    audio.play();
                break;
        }
    }    
}

// функция движения полос на дороге
function moveRoad(){ 
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line){
        line.y += setting.speed;
        line.style.top = line.y + 'px';

// Если line.y больше размера окна клиента, то line.y уводим за окно, чтобы линии плавно выезжали
        if (line.y >= document.documentElement.clientHeight) {
            line.y = -100;
        }
    });
}

function moveEnemy(){
    let enemy = document.querySelectorAll('.enemy');
    // console.log(enemy);

    enemy.forEach(function(item){
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();
        
        if (carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left && 
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
                // console.log('ДТП');
                audio.pause();
                setting.start = false;
                startWindow.classList.remove('hide');
                
            
        }
        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';

        // Если машинки достигли конца экрана, то поднимаем их вверх на -100px
        if (item.y >= document.documentElement.clientHeight ) {
            item.y = -100 * setting.traffic;
            const random = Math.floor(Math.random() * (6 - 0 + 1)) + 1;
            item.style.background = `transparent url(./img/enemy${random}.png) center /cover no-repeat`;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50) ) + 'px';
        }
    });

}

// модальное окно с счетом
function scoreModal(name, record) {
    modalScoreOut.textContent = setting.score;
    modalResult.innerHTML = '';
    modalResult.textContent = name;
    modalScore.style.display = 'block';
    record.textContent = record;
}

// закрыть модальное окно
function scoreModalClose(){
    modalScore.style.display = 'none';
}

// сравниваем набранные очки и передвём их функции модального окна
function scoreResult(){
    if (!setting.start) {  
        // записываем счет в localStorage
        if (storage.getItem('score')) {
            let storageScore = storage.getItem('score');
            
            if (setting.score < storageScore) {
                const result = "Вы не достигли лучшего результата " + storageScore;
                scoreModal(result, storageScore);
                
            } if (setting.score > storageScore) {
                const result = "Вы побели предыдуший рекорд! " + storageScore;
                storage.setItem('score', setting.score);
                scoreModal(result, storageScore);
                record.textContent = storage.getItem('score');

                
            } if (storageScore === setting.score) {
                const result = "Ваш результат совпадает с предыдущим. " + setting.score;
                scoreModal(result, storageScore);
            }
        } else {
            // modalScore.style.display = 'block';
            const result = 'Новый рекорд!';
            const storageScore = 0;
            scoreModal(result, storageScore);

            storage.setItem('score', setting.score);
            record.textContent = storage.getItem('score');
        }    
    
    }
    
}
// Объект для записи значений в localStorage
const storage = {
    getItem(name) {
        const ls = localStorage.getItem(name);
        if (ls) {
            return JSON.parse(ls);
        }
    },
    setItem(name, value) {
        localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem(name) {
        localStorage.removeItem(name);
    },
};

// record.addEventListener('click', oneClick);
    
// function oneClick(){
//     console.log('Кликнули первый раз');
//     record.removeEventListener('click', oneClick );
//     record.addEventListener('click', twoClick );
// }

// function twoClick(){
//     console.log('Кликнули ещё раз');
// } 
