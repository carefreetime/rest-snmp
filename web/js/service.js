var App = (function () {
    function _bindEvent() {
        console.log('bind event');
        $('#get_submit').on('click', _getsomething);
        $('#getbulk_submit').on('click', _getbulk);
        $('#set_submit').on('click', _set);
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

                if (oid) {
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
                } else {
                    $('#table').addClass('hidden_text');
                    var name = data.name;
                    var message = data.message;
                    alert(name + ' ' + message);
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

                if (oid) {
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
                } else {
                    $('#table').addClass('hidden_text');
                    var name = data.name;
                    var message = data.message;
                    alert(name + ' ' + message);
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

                    if (oid) {
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
                    } else {
                        $('#table').addClass('hidden_text');
                        var name = data.name;
                        var message = data.message;
                        alert(name + ' ' + message);
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

                    if (oid) {
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
                    } else {
                        $('#table').addClass('hidden_text');
                        var name = data.name;
                        var message = data.message;
                        alert(name + ' ' + message);
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

                    if (oid) {
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
                    } else {
                        $('#table').addClass('hidden_text');
                        var name = data.name;
                        var message = data.message;
                        alert(name + ' ' + message);
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
                if (oid) {
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
                } else {
                    $('#table').addClass('hidden_text');
                    var name = data.name;
                    var message = data.message;
                    alert(name + ' ' + message);
                }
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
                if (!ip) {
                    alert("Permission Denied.")
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
    }

    return {
        init
    }
})();