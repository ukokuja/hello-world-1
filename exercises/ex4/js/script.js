function init () {
    var container = document.getElementsByClassName('container')[0];
    for (var i = 0; i < 20; i++) {
        var row = document.createElement('div');
        row.className += 'row'
        container.appendChild(row);
        for (var j = 0; j < 20; j++) {
            var input = getInput(i, j);
            row.appendChild(input);
        }
    }
}

function getInput (i, j) {
    var container = document.createElement('div');
    container.className += 'col-sm'
    var input = document.createElement('input');
    input.setAttribute('type', 'password');
    input.setAttribute('y', i);
    input.setAttribute('x', j);
    container.appendChild(input)
    return container
}

function initGame() {
    var game = {
        direction: 2,
        x: 10,
        y: 10,
        limitX: 20,
        limitY: 20,
        list: [],
        bug: getBug(),
        isAlive: true,
        speed: 1,
        controls: {
            level: document.getElementById('level')
        },
        time: 0
    }
    setArrowInteractions(game);
    for (var i = game.x - 5; i < game.x; i++ ) {
        var ele = document.querySelector("input[x='"+(i)+"'][y='"+game.y+"']")
        ele.value = 1
        game.list.push(ele)
    }
    setBug(game);
    interval = setInterval(function (){
        if (game.speed == 10 || game.time % (10 - (game.speed)) == 0) {
            game = doGame(game);
            if (!game.isAlive) {
                clearInterval(interval);
            }
            renderGame(game);
        }
        
        game.time++
    }, 50)
}

function doGame (game) {
    if (game.direction == 1) {
        game.y = (game.y + 1) % game.limitY;
    } else if (game.direction == 2) {
        game.x = (game.x + 1) % game.limitX;
    } else if (game.direction == 3) {
        game.y = game.y - 1 < 0 ? game.limitY - 1 : game.y - 1;
    } else {
        game.x = game.x - 1 < 0 ? game.limitX - 1 : game.x - 1;
    }
    if (!isLost(game)) {
        game.isAlive = false
        doLost();
    }
    if (isWin(game)) {
        doWin();
    }
    return game;

}
function getBug () {
    var x = Math.floor(Math.random() * 19);
    var y = Math.floor(Math.random() * 19);
    return {
        x: x,
        y: y,
        element: document.querySelector("input[x='"+x+"'][y='"+y+"']")
    }
}
function setBug(game) {
    game.bug.element.value = 1
    game.bug.element.className = 'bug'
}
function resetBug(game) {
    game.bug.element.value = ''
    game.bug.element.className = ''
    game.bug = getBug()
}

function renderGame (game) {
    if (game.x == game.bug.x && game.y == game.bug.y) {
        resetBug(game);
        setBug(game)
        if (game.list.length % 2 == 0) {
            game.speed++;
            updateSpeed(game);
        }
    } else {
        var tail = game.list.pop()
        tail.value = null
    }
    var head = document.querySelector("input[x='"+game.x+"'][y='"+game.y+"']")
    head.value = 1
    game.list.unshift(head)
}


function setArrowInteractions (game) {
    
    document.addEventListener('keydown', function (ev) {
        e = ev || window.event;
        if (e.keyCode == '40') {
            game.direction = game.direction == 3 ? 3 : 1;
        }
        else if (e.keyCode == '38') {
            game.direction = game.direction == 1 ? 1 : 3;
        }
        else if (e.keyCode == '37') {
            game.direction = game.direction == 2 ? 2 : 4;
        }
        else if (e.keyCode == '39') {
            game.direction = game.direction == 4 ? 4 : 2;
        }
    })

    game.controls.level.addEventListener('change', function () {
        game.speed = parseInt(parseInt(game.controls.level.value) / 10)
    })
}

function isWin (game) {
    return game.list.length >= 15
}
function doLost() {
    alert('You have lost');
}
function doWin() {
    alert('You have won');
}

function isLost (game) {
    for (var i in game.list) {
        if (game.list[i] == document.querySelector("input[x='"+game.x+"'][y='"+game.y+"']")) {
            return false
        }
    }
    return true
}

function updateSpeed(game) {
    var level = parseInt(game.speed * 10)
    game.controls.level.value = level > 100 ? 100 : level
}