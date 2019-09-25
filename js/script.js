const   score = document.querySelector('.score');
const   start = document.querySelector('.start');
const   gameArea = document.querySelector('.gameArea'),
        car = document.createElement('div'),
        modalScore = document.querySelector('.modal'),
        controls = document.querySelector('.controls'),
        modalButton = document.querySelector('.modal--button'),
        modalContainer = document.querySelector('.modal-container'),
        modalScoreOut = document.querySelector('.modal-score'),
        modalResult = document.querySelector('.modal--result'),
        // music = document.createElement('embed'); 
        music = document.createElement('audio'); 
        car.classList.add('car');

    // console.log(Math.floor(Math.random() * (5 - 1 + 1)) + 1);
    
    start.addEventListener('click', startGame);
    document.addEventListener('keydown', startRun);
    document.addEventListener('keyup', stopRun);
    // modalButton.addEventListener('click', function(){
    //     modalScore.style.display = 'none';
    // });
    
    const keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowRight: false,
        ArrowLeft: false
    };
    
    const setting = {
        start: false,
        score: 0,
        speed: 3,
        traffic: 3
    };
    // Получаем кол-во элементов
    function getQuantityElements(heightElement) {
        return Math.floor(gameArea.offsetHeight / heightElement + 1);
    }
    
    function startGame(){
        start.classList.add('hide');
        gameArea.innerHTML = '';
        // console.log(gameArea.offsetHeight);
        // console.log(gameArea.offsetHeight);
        for (let i = 0; i < getQuantityElements(100); i++) {
            const line = document.createElement('div');
            line. classList.add('line');
            line.style.top = (i * 100) +'px';
            line.y = i * 100;
            gameArea.appendChild(line);
        }
        
        gameArea.appendChild(car);
        music.setAttribute('autoplay', true);
        music.setAttribute('loop', true);
        music.setAttribute('controls', true);
        music.setAttribute('src', './mp3/cospe-cotton-candy.mp3');
        // music.setAttribute('type', 'audio/mp3');
        music.classList.add('music');
        controls.appendChild(music);
        car.style.left = (gameArea.offsetWidth / 2) - (car.offsetWidth / 2) + 'px';
        car.style.top = 'auto';
        
        
        for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
            const enemy = document.createElement('div');
            enemy.classList.add('enemy');
            enemy.y = -100 * setting.traffic * (i + 1);
            enemy.style.top = enemy.y + 'px';
            // for (let k = 0; k < getQuantityElements(100 * setting.traffic); k++) {
                //         enemy.style.background = 'transparent url(./img/enemy'+ i +'.png) center /cover no-repeat';
                //     }
                let random = Math.floor(Math.random() * (6 - 0 + 1)) + 1;
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

function moveRoad(){ // функция движения полос на дороге
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
                setting.start = false;
                start.classList.remove('hide');
                
            
        }
        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';

        // Если машинки достигли конца экрана, то поднимаем их вверх на -100px
        if (item.y >= document.documentElement.clientHeight ) {
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50) ) + 'px';
        }
    });

}
function scoreModal(name) {
    modalScoreOut.textContent = setting.score;
    modalResult.innerHTML = '';
    modalResult.textContent = name;
    modalScore.style.display = 'block';
}
function scoreModalClose(){
    modalScore.style.display = 'none';
}
function scoreResult(){
    if (!setting.start) {  
        // записываем счет в localStorage
        if (storage.getItem('score')) {
            let storageScore = storage.getItem('score');
            
            if (setting.score < storageScore) {
                let result = "Вы не достигли лучшего результата " + storageScore;
                scoreModal(result);
                
            } if (setting.score > storageScore) {
                let result = "Вы побели предыдуший рекорд! " + storageScore;
                storage.setItem('score', setting.score);
                scoreModal(result);
                
            } if (storageScore === setting.score) {
                let result = "Ваш результат совпадает с предыдущим. " + setting.score;
                scoreModal(result);
            }
        } else {
            // modalScore.style.display = 'block';
            let result = 'Новый рекорд!';
            scoreModal(result);

            storage.setItem('score', setting.score);
        }    
    
    }
    
}

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

