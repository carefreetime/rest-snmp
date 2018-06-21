var App = (function () {
    function _bindEvent() {
        console.log('bind event');
        $('#logout').on('click', _logout);
        $('#refresh').on('click', _refresh);
    }

    function _refresh() {
        location.reload();
    }

    function _logout() {
        $.ajax({
            url : `http://163.22.32.174:4000/logout/`,
            type :'get',
            dataType : 'json',
            success : function(data) {
                console.log(data);
            },
            error : function(jqXHR) {
                console.log(jqXHR);
            }
        });
    }

    function _getDefault(oid, idname) {
        $.ajax({
            url : `http://163.22.32.174:4000/get/` + oid,
            type : 'get',
            dataType : 'json',
            success : function(data) {
                var value = JSON.stringify(data.value);
                $('#' + idname).val(value);
            },
            error : function(jqXHR) {
                console.log(jqXHR);
            }
        });
    }

    function _getAgentAddr() {
        $.ajax({
            url : `http://163.22.32.174:4000/session/`,
            type : 'get',
            dataType : 'json',
            success : function(data) {
                var ip = JSON.stringify(data.ip);
                $('#ip_address').val(ip);
                if (ip == null) {
                    alert('Permisson denied.');
                    location.href = '/';
                } else {
                    _bindEvent();
                }
            },
            error : function(jqXHR) {
                console.log(jqXHR);
            }
        });
    }

    function init() {
        console.log('Hello');
        _getAgentAddr();
        _getDefault('1.3.6.1.2.1.1.5.0', 'sysName');
        _getDefault('1.3.6.1.2.1.2.1.0', 'ifNumber');
        _getDefault('1.3.6.1.2.1.1.4.0', 'sysContact');
        _getDefault('1.3.6.1.2.1.1.7.0', 'sysServices');
        _getDefault('1.3.6.1.2.1.1.6.0', 'sysLocation');
        _getDefault('1.3.6.1.2.1.1.1.0', 'sysDescr');
        _getDefault('1.3.6.1.2.1.1.2.0', 'sysObjectId');
        _getDefault('1.3.6.1.2.1.1.3.0', 'sysUpTime');
    }

    return {
        init
    }
})();