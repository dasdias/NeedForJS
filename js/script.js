const   score = document.querySelector('.score');
const   start = document.querySelector('.start');
const   gameArea = document.querySelector('.gameArea'),
        car = document.createElement('div');
        car.classList.add('car');


start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

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
    traffic: 2
};
// Получаем кол-во элементов
function getQuantityElements(heightElement) {
    return Math.floor(document.documentElement.clientHeight / heightElement + 1);
}

function startGame(){
    start.classList.add('hide');
    // console.log(gameArea.offsetHeight);
    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line. classList.add('line');
        line.style.top = (i * 100) +'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }
    
    gameArea.appendChild(car);
    console.log(getQuantityElements(100 * setting.traffic));

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
                enemy.classList.add('enemy');
                enemy.y = -100 * setting.traffic * (i + 1);
                enemy.style.top = enemy.y + 'px';
                for (let k = 0; k < getQuantityElements(100 * setting.traffic); k++) {
                        enemy.style.background = 'transparent url(./img/enemy'+ i +'.png) center /cover no-repeat';
                    }
                // enemy.style.background = 'transparent url(../img/enemy.png) center /cover no-repeat';
                enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50) ) + 'px';
                gameArea.appendChild(enemy);
        
    }

    setting.start = true;
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    if (setting.start) {
        requestAnimationFrame(playGame);
    }
}

function playGame(){
    // console.log('Play Game!');
    if (setting.start) {
        moveRoad();
        moveEnemy();
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

function startRun(event){
    event.preventDefault();
    for (const currentKey in keys) {
        // console.log(currentKey);
        if ( currentKey === event.key ) {
            keys[event.key] = true;
        }
    }
}
function stopRun(event){
    event.preventDefault();
    for (const currentKey in keys) {
        // console.log(currentKey);
        if ( currentKey === event.key ) {
            keys[event.key] = false;
        }
    }
    // keys[event.key] = false;
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
        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';

        // Если машинки достигли конца экрана, то поднимаем их вверх на -100px
        if (item.y >= document.documentElement.clientHeight ) {
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50) ) + 'px';
        }
    });

}

