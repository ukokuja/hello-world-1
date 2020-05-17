function init () {
    var container = document.getElementById('secondGroup').getElementsByClassName('container')[0];
    for (var i = 0; i < 20; i++) {
        var row = document.createElement('div');
        row.className += 'row'
        container.appendChild(row);
        for (var j = 0; j < 20; j++) {
            var input = getInput(i, j);
            row.appendChild(input);
        }
    }
    addValidation();
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
        previous: getPrevious(),
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
            speed: document.getElementById('speed'),
            level: document.getElementById('level'),
            timer: document.getElementById('timer')
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
        updateTimer(game);
    }, 25)
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
    if (isLost(game)) {
        doLost();
        game.isAlive = false
        scrollEnd(game)
    }
    if (isWin(game)) {
        doWin();
        scrollEnd(game)
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
            updateLevel(game);
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
            e.preventDefault();
        }
        else if (e.keyCode == '38') {
            game.direction = game.direction == 1 ? 1 : 3;
            e.preventDefault();
        }
        else if (e.keyCode == '37') {
            game.direction = game.direction == 2 ? 2 : 4;
            e.preventDefault();
        }
        else if (e.keyCode == '39') {
            game.direction = game.direction == 4 ? 4 : 2;
            e.preventDefault();
        }
        
    })

    game.controls.speed.addEventListener('change', function () {
        game.speed = parseInt(parseInt(game.controls.speed.value) / 10)
    })

    $("#startPlay").click(function() {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#secondGroup").offset().top
        }, 1000);
    });
}

function isWin (game) {
    var isWin = true
    saveSession(game, isWin);
    return game.list.length >= 100
}
function doLost() {
    console.log('You have lost');
}
function doWin() {
    console.log('You have won');
}

function isLost (game) {
    for (var i in game.list) {
        
        if (game.list[i].getAttribute('x') == game.x && game.list[i].getAttribute('y') == game.y) {
            var isWin = false
            saveSession(game, isWin);
            return true
        }
    }
    return false
}

function updateSpeed(game) {
    var speed = parseInt(game.speed * 10)
    game.controls.speed.value = speed > 100 ? 100 : speed
}

function updateLevel(game) {
    var level = 1 + parseInt((parseInt(game.list.length) - 5)/3)
    game.controls.level.value = level
}

function updateTimer (game) {
    if (game.time % 40 == 0) {
        game.controls.timer.value = game.time / 40
    }
}

function saveSession(game, isWin) {
    game.previous.push({
        list: game.list.length,
        isWon: isWin,
        speed: game.speed,
        time: game.time
    })
    localStorage.setItem('snakeShenar', JSON.stringify(game.previous))
}

function getPrevious () {
    try {
        var previous = localStorage.getItem('snakeShenkar');
        if (!previous) return []
        return JSON.parse(previous);
    } catch {
        return []
    }
    return [];
}

function scrollEnd (game) {
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#finalGroup").offset().top
    }, 1000);
    $("#finalMessage").html(game.list.length + " in " + parseInt(game.time/40) + " seconds!!!!")
}


function addValidation () {
        window.addEventListener('load', function() {
          // Fetch all the forms we want to apply custom Bootstrap validation styles to
          var forms = document.getElementsByClassName('needs-validation');
          // Loop over them and prevent submission
          var validation = Array.prototype.filter.call(forms, function(form) {
            for (var i = 0; i < form.length; i++) {
                form[i].oninvalid = function (e){
                    e.target.className = e.target.className.replace(/\bis-invalid\b/,'');
                    e.target.className = e.target.className.replace(/\bis-valid\b/,'');
                    e.target.className += ' is-invalid'
                }
                form[i].onkeydown = function (e){
                    e.target.className = e.target.className.replace(/\bis-invalid\b/,'');
                    e.target.className = e.target.className.replace(/\bis-valid\b/,'');
                }

                form[i].onblur = function (e){
                    e.target.className = e.target.className.replace(/\bis-invalid\b/,'');
                    e.target.className = e.target.className.replace(/\bis-valid\b/,'');
                    e.target.checkValidity();
                    e.target.parentNode.classList.add('was-validated');
                }
            }
            form.addEventListener('submit', function(event) {
              if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
              }
              form.classList.add('was-validated');
            }, false);
          });
        }, false);
}