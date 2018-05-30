var App = (function () {
    function _bindEvent() {
        console.log('bind event');
        $('#connect_submit').on('click',_getData);
    }

    function _getData() {
        var ip = $('#ip').val();
        var community = $('#community').val();

        $.ajax({
            url : `http://163.22.32.174:4000/` + ip + `/` + community,
            type : 'post',
            dataType : 'json',
            data : JSON.stringify({
                ip : $('#ip').val(),
                community : $('#community').val()
            }),
            success : function(data) {
                console.log('success');
            },
            error : function(jqXHR) {
                console.log(jqXHR);
            }
        });
    }
    
    function init() {
        console.log('Hello');
        _bindEvent();
    }

    return {
        init
    }
})();