function init () {
    addValidation();
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#firstGroup").offset().top
    }, 1000);
    $("#startPlay").click(function() {
        if (isMainPartValidate()) {
            initGame($('input[name="gender"]:checked').val(), $('#colorSelect option:selected').val());
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#secondGroup").offset().top
            }, 1000);
        }
    });
}

function getInput (i, j) {
    var container = document.createElement('div');
    container.className += 'col-sm col-xs col-sm col-lg'
    var input = document.createElement('div');
    input.setAttribute('y', i);
    input.setAttribute('x', j);
    container.appendChild(input)
    return container
}

function addBoard (limit, difficulty) {
    var container = document.getElementById('secondGroup').getElementsByClassName('container')[0];
    container.className += ' ' + difficulty;
    for (var i = 0; i < limit; i++) {
        var row = document.createElement('div');
        row.className += 'row'
        container.appendChild(row);
        for (var j = 0; j < limit; j++) {
            var input = getInput(i, j);
            row.appendChild(input);
        }
    }
}
function initGame(difficulty, colors) {
    limit = 20;
    if (difficulty == 'easy') {
        limit = 10;
    } else if (difficulty == 'medium') {
        limit = 15;
    }
    addBoard(limit, difficulty)
    var game = {
        previous: getPrevious(),
        direction: 2,
        x: 3,
        y: 3,
        limitX: limit,
        limitY: limit,
        list: [],
        bug: getBug(limit),
        isAlive: true,
        speed: 10,
        controls: {
            speed: document.getElementById('speed'),
            level: document.getElementById('level'),
            timer: document.getElementById('timer')
        },
        time: 0,
        colors: colors.split(',')
    }
    setArrowInteractions(game);
    for (var i = game.x - 3; i < game.x; i++ ) {
        var ele = document.querySelector("div[x='"+(i)+"'][y='"+game.y+"']")
        ele.className = '   current-' + game.colors[i % game.colors.length]
        game.list.push(ele);
    }
    game.x++;
    setBug(game);
    interval = setInterval(function (){
        if (game.speed == 20 || game.time % (20 - (game.speed)) == 0) {
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
function getBug (limit) {
    var x = Math.floor(Math.random() * (limit - 1));
    var y = Math.floor(Math.random() * (limit - 1));
    element = document.querySelector("div[x='"+x+"'][y='"+y+"']")
    while (!element || element.className.indexOf('current') > -1) {
        x = Math.floor(Math.random() * (limit - 1));
        y = Math.floor(Math.random() * (limit - 1));
        console.log(x, y, element.className)
        element = document.querySelector("div[x='"+x+"'][y='"+y+"']")
    }
    return {
        x: x,
        y: y,
        element: element
    }
}
function setBug(game) {
    game.bug.element.className = 'bug'
}
function resetBug(game) {
    game.bug.element.className = ''
    game.bug = getBug(game.limitX)
}

function renderGame (game) {
    if (game.x == game.bug.x && game.y == game.bug.y) {
        resetBug(game);
        setBug(game)
        if (game.list.length % 3 == 0) {
            game.speed++;
            updateSpeed(game);
            updateLevel(game);
        }
    } else {
        var tail = game.list.pop()
        tail.className = ''
    }
    var head = document.querySelector("div[x='"+game.x+"'][y='"+game.y+"']")
    head.className = '   current-' + game.colors[game.x % game.colors.length]
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
        game.speed = parseInt(parseInt(game.controls.speed.value))
    })
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
    var speed = parseInt(game.speed)
    game.controls.speed.value = speed > 20 ? 20 : speed
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

function isMainPartValidate () {
    var isValid = true;
    var inputs = document.getElementById('firstGroup').getElementsByTagName('input')
    Array.prototype.filter.call(inputs, function(input) {
        if (!input.checkValidity()) {
            isValid = false
        }
    })
    return isValid
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