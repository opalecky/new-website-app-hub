/**
 * Because explorer is dumb but I need the translations to be happening...
 */
(function () {
    var lang = "czech";

    var queryParams = window.location.href.split('?')[1];
    if (queryParams !== undefined && queryParams !== null) {
        queryParams = queryParams.split('&');
        for (var i in queryParams) {
            if (queryParams[i].split('=')[0] === 'lang') {
                lang = queryParams[i].split('=')[1];
            }
        }
    }

    var ua = window.navigator.userAgent;
    if(parseInt(ua.substring(ua.indexOf("MSIE") + 5, ua.indexOf(".", ua.indexOf("MSIE")))) < 10) {
        document.body.innerHTML = '<span style="color: #000">You are using internet explorer of version lower than 10. I do not like that. My website doesn\'t like that. Please download a better browser: <a href="https://browsehappy.com/">https://browsehappy.com/</a></span>';
    }
    if (ua.indexOf("MSIE") > 0 || ua.indexOf("WOW64") > 0) {
        var language_options = document.querySelectorAll('.language-selector a');
        for (var i in language_options) {
            if (language_options[i] instanceof HTMLElement) {
                if(language_options[i].getAttribute('data-value') === lang) {
                    language_options[i].setAttribute('style', 'display: none');
                } else {
                    language_options[i].setAttribute('href', (window.location.protocol + '\/\/' + window.location.host + '\/?lang=' + language_options[i].getAttribute('data-value')));
                }
            }
        }
    }

    var translation_request = new XMLHttpRequest();

    translation_request.addEventListener('loadend', function (data) {
        var translations = JSON.parse(data.target.responseText);
        translation_request_g = new XMLHttpRequest();
        translation_request_g.addEventListener('loadend', function (data) {
            var translations_GLOB = JSON.parse(data.target.responseText);
            for (var i in translations_GLOB) {
                translations[i] = translations_GLOB[i];
            }
            var elements = document.querySelectorAll('*[translate]');
            for (var element in elements) {
                if (elements.hasOwnProperty(element) && elements[element] instanceof HTMLElement) {
                    elements[element].innerText = translations[elements[element].getAttribute('translate')];
                }
            }
        })
        translation_request_g.open('GET', 'lang/global.json');
        translation_request_g.send();
    })
    translation_request.open('GET', 'lang/' + lang + '.json');
    translation_request.send();
})();
