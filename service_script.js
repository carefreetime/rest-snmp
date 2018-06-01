var App = (function () {
    function _bindEvent() {
        console.log('bind event');
        $('#get_submit').on('click', _getsomething);
        $('#getbulk_submit').on('click', _getbulk);
        $('#set_submit').on('click', _set);
        $('#refresh').on('click', _refresh);
    }

    function _refresh() {
        location.reload();
    }

    function _getsomething() {
        $('#table').removeClass('hidden_text');
        $('#tbody').html("");

        var service = $('#selectId').val();
        switch(service) {
            case '1' :
                _get();
                break;
            case '2' :
                _getNext();
                break;
            case '4' :
                _getSubTree();
                break;
            case '5' :
                _walk();
                break;
        }
    }

    function _get() {
        var oid = $('#oid').val();
        $.ajax({
            url : `http://163.22.32.174:4000/get/` + oid,
            type : 'get',
            dataType : 'json',
            success : function(data) {
                var oid = data.oid;
                var type = data.type;
                var value = JSON.stringify(data.value);

                if(value == '""') {
                    $('#tbody').append(`
                        <tr>
                            <td bgcolor="#AAAAAA">`+oid+`</td>
                            <td bgcolor="#AAAAAA">`+type+`</td>
                            <td bgcolor="#AAAAAA"></td>
                        </tr>
                    `);
                } else {
                    $('#tbody').append(`
                        <tr>
                            <td>`+oid+`</td>
                            <td>`+type+`</td>
                            <td>`+value+`</td>
                        </tr>
                    `);
                }              
            },
            error : function(jqXHR) {
                console.log(jqXHR);
            }
        });
    }

    function _getNext() {
        var oid = $('#oid').val();
        $.ajax({
            url : `http://163.22.32.174:4000/getnext/` + oid,
            type : 'get',
            dataType : 'json',
            success : function(data) {
                var oid = data.oid;
                var type = data.type;
                var value = JSON.stringify(data.value);

                if(value == '""') {
                    $('#tbody').append(`
                        <tr>
                            <td bgcolor="#AAAAAA">`+oid+`</td>
                            <td bgcolor="#AAAAAA">`+type+`</td>
                            <td bgcolor="#AAAAAA"></td>
                        </tr>
                    `);
                } else {
                    $('#tbody').append(`
                        <tr>
                            <td>`+oid+`</td>
                            <td>`+type+`</td>
                            <td>`+value+`</td>
                        </tr>
                    `);
                } 
            },
            error : function(jqXHR) {
                console.log(jqXHR);
            }
        });
    }

    function _getSubTree() {
        var oid = $('#oid').val();
        $.ajax({
            url : `http://163.22.32.174:4000/subtree/` + oid,
            type : 'get',
            dataType : 'json',
            success : function(data) {
                for(let objects of data) {
                    var oid = objects.oid;
                    var type = objects.type;
                    var value = JSON.stringify(objects.value);

                    if(value == '""') {
                        $('#tbody').append(`
                            <tr>
                                <td bgcolor="#AAAAAA">`+oid+`</td>
                                <td bgcolor="#AAAAAA">`+type+`</td>
                                <td bgcolor="#AAAAAA"></td>
                            </tr>
                        `);
                    } else {
                        $('#tbody').append(`
                            <tr>
                                <td>`+oid+`</td>
                                <td>`+type+`</td>
                                <td>`+value+`</td>
                            </tr>
                        `);
                    } 
                }                  
            },
            error : function(jqXHR) {
                console.log(jqXHR);
            }
        });
    }

    function _walk() {
        var oid = $('#oid').val();
        $.ajax({
            url : `http://163.22.32.174:4000/walk/` + oid,
            type : 'get',
            dataType : 'json',
            success : function(data) {
                for(let objects of data) {
                    var oid = objects.oid;
                    var type = objects.type;
                    var value = JSON.stringify(objects.value);

                    if(value == '""') {
                        $('#tbody').append(`
                            <tr>
                                <td bgcolor="#AAAAAA">`+oid+`</td>
                                <td bgcolor="#AAAAAA">`+type+`</td>
                                <td bgcolor="#AAAAAA"></td>
                            </tr>
                        `);
                    } else {
                        $('#tbody').append(`
                            <tr>
                                <td>`+oid+`</td>
                                <td>`+type+`</td>
                                <td>`+value+`</td>
                            </tr>
                        `);
                    }    
                }   
            },
            error : function(jqXHR) {
                console.log(jqXHR);
            }
        });
    }

    function _getbulk() {
        $('#table').removeClass('hidden_text');
        $('#tbody').html("");

        var n = $('#n').val();
        var m = $('#m').val();
        
        var oids = '';
        for (var i = 1; i <= n; i++) {
            oids += ($('#oid' + i).val()) + ',';
        }    
        oids += ($('#oid' + (parseInt(n) + 1)).val());

        $.ajax ({
            url : `http://163.22.32.174:4000/getbulk/` + n + `/` + m + `/` + oids,
            type : 'get',
            dataType : 'json',
            success : function(data) {
                for(let objects of data) {
                    var oid = objects.oid;
                    var type = objects.type;
                    var value = JSON.stringify(objects.value);

                    if(value == '""') {
                        $('#tbody').append(`
                            <tr>
                                <td bgcolor="#AAAAAA">`+oid+`</td>
                                <td bgcolor="#AAAAAA">`+type+`</td>
                                <td bgcolor="#AAAAAA"></td>
                            </tr>
                        `);
                    } else {
                        $('#tbody').append(`
                            <tr>
                                <td>`+oid+`</td>
                                <td>`+type+`</td>
                                <td>`+value+`</td>
                            </tr>
                        `);
                    }    
                }   
            },
            error : function(jqXHR) {
                console.log(jqXHR);
            }
        });
    }

    function _set() {
        $('#table').removeClass('hidden_text');
        $('#tbody').html("");
        
        var oid = $('#oid0').val();
        var type = $('#type').val();
        var value = $('#value').val();

        $.ajax({
            url : `http://163.22.32.174:4000/set/` + oid + `/` + type + `/` + value,
            type : 'put',
            dataType : 'json',
            data : JSON.stringify({
                oid : $('#oid').val(),
                type : $('#type').val(),
                value : $('#value').val()
            }),
            success : function(data) {
                console.log('success');
                if(value == '""') {
                    $('#tbody').append(`
                        <tr>
                            <td bgcolor="#AAAAAA">`+oid+`</td>
                            <td bgcolor="#AAAAAA">`+type+`</td>
                            <td bgcolor="#AAAAAA"></td>
                        </tr>
                    `);
                } else {
                    $('#tbody').append(`
                        <tr>
                            <td>`+oid+`</td>
                            <td>`+type+`</td>
                            <td>`+value+`</td>
                        </tr>
                    `);
                }
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
        _bindEvent();
    }

    return {
        init
    }
})();