function init () {
    var articlesContainer = document.getElementById('layoutSymetric');
    addArticles(articlesContainer);
    addButtonActions(articlesContainer);
}

function addArticles (articlesContainer) {
    
    var student = {name: "Lucas", lastname: "Kujawski"};

    for (var i = 0; i < student.name.length * student.lastname.length; i++) {
        var article = document.createElement('article');
        if (i == 0) {
            article.appendChild(document.createTextNode(student.name.charAt(0)));
        }
        if (i < student.name.length) {
            article.className += 'isChangeArticle';
        }
        articlesContainer.appendChild(article);
    }
}

function addButtonActions (articlesContainer) {
    var clearButton = document.getElementsByClassName('clearMode')[0];
    var darkButton = document.getElementsByClassName('darkMode')[0];

    clearButton.onclick = function () {replaceClass(articlesContainer, 'clear');}
    darkButton.onclick = function () {replaceClass(articlesContainer, 'dark');}
}

function replaceClass (element, className) {
    element.className = className;
} 