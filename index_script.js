var App = (function () {
    function _bindEvent() {
        console.log('bind event');
        $('#connect_submit').on('click', _test);
    }

    function _test() {
        
    }
    
    function init() {
        console.log('Hello');
        _bindEvent();
    }

    return {
        init
    }
})();