/**
 * Proprietary Helper library by Adam Opalecký
 * Allows to use most useful functions from jQuery and Lodash within one single file without any need to download any of the two
 * Has bonus helpful functions ranging from Math and Color to String and Array utility
 */
var HelperDOMElement = /** @class */ (function () {
    function HelperDOMElement(element) {
        this.classArray = [];
        this.data = [];
        this.element = element;
        for (var c in this.element.classList) {
            if (!(c === undefined || c === null) && this.element.classList.hasOwnProperty(c)) {
                this.classArray.push(this.element.classList[c]);
            }
        }
        this.id = this.element.getAttribute('id');
        for (var att in this.element.attributes) {
            if (this.element.attributes.hasOwnProperty(att) && this.element.attributes[att].name && this.element.attributes[att].name.match(/data-.*/)) {
                var otp = {};
                otp[this.element.attributes[att].name.split('data-')[0]] = this.element.attributes[att].value;
                this.data.push(otp);
            }
        }
    }
    HelperDOMElement.prototype.addClass = function (cl) { };
    HelperDOMElement.prototype.removeClass = function (cl) { };
    HelperDOMElement.prototype.listen = function (eventName, callBack) { };
    HelperDOMElement.prototype.append = function (child) { };
    HelperDOMElement.prototype.inner = function (child) { };
    return HelperDOMElement;
}());
var Color = /** @class */ (function () {
    function Color() {
    }
    return Color;
}());
var Helper = /** @class */ (function () {
    function Helper() {
    }
    // DOM functions
    Helper.Element = function (selector) { return new HelperDOMElement(document.createElement('div')); };
    // Logic functions
    Helper.isEqual = function (object1, object2) { return false; };
    Helper.isEmpty = function (object) { return false; };
    // String function
    Helper.repeat = function (str, amount) { return ''; };
    Helper.replaceAll = function (str, search, replace) { return ''; };
    ;
    // Color functions
    Helper.getRandomColor = function (amount) { return new Color(); };
    Helper.getComplimentaryColor = function (color, amount) { return new Color(); };
    return Helper;
}());
