/**
 * Because explorer is dumb but I need the translations to be happening...
 */
(function () {
    var translation_request = new XMLHttpRequest();
    translation_request.addEventListener('loadend', function (data) {
        var translations_EN = JSON.parse(data.target.responseText);
        var elements = document.querySelectorAll('*[translate]');
        for (var element in elements) {
            if (elements[element].constructor.name !== 'Function' && elements[element].constructor.name !== 'Number') {
                elements[element].innerText = translations_EN[elements[element].getAttribute('translate')];
            }
        }
    })
    translation_request.open('GET', 'lang/english.json');
    translation_request.send();
})();
