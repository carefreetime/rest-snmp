var App = (function () {
    function _bindEvent() {
        console.log('bind event');
        $('#get_submit').on('click', _getsomething);
        $('#getbulk_submit').on('click', _getbulk);
        $('#set_submit').on('click', _set);
        $('#selectId').on('change', PDUOnChange);
        $('#n').on('change', NOnChange);
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

    function ChangeClass(obj) {
        var selectObj = document.getElementById(obj);
        if (selectObj.options[selectObj.options.selectedIndex].value == 3) {
            $('#tbody').html("");
            $("#table").addClass("hidden_text");
            $("#get").addClass("hidden_text");
            $("#getbulk").removeClass("hidden_text");
            $("#set").addClass("hidden_text");
        } else if (selectObj.options[selectObj.options.selectedIndex].value == 6) {
            $('#tbody').html("");
            $("#table").addClass("hidden_text");
            $("#get").addClass("hidden_text");
            $("#getbulk").addClass("hidden_text");
            $("#set").removeClass("hidden_text");
        } else if (selectObj.options[selectObj.options.selectedIndex].value == 0) {
            $('#tbody').html("");
            $("#table").addClass("hidden_text");
            $("#table").addClass("hidden_text");
            $("#get").addClass("hidden_text");
            $("#getbulk").addClass("hidden_text");
            $("#set").addClass("hidden_text");
        } else {
            $('#tbody').html("");
            $("#table").addClass("hidden_text");
            $("#get").removeClass("hidden_text");
            $("#getbulk").addClass("hidden_text");
            $("#set").addClass("hidden_text");
        }
    }

    function PDUOnChange() {
        ChangeClass("selectId");
    }

    function NOnChange() {
        $('#getbulk_oids').html("");
        $("#getbulk_button").removeClass("hidden_text");

        var n = document.getElementById("n").value;
        for (var i = 1; i <= n; i++) {
            $('#getbulk_oids').append(`
                <label for="oid" class="col-md-1 col-form-label text-right">oid`+i+`</label>
                <div class="col-md-3">
                    <input type="text" class="form-control" id="oid`+i+`">
                </div>                
            `);
        }

        var m = ++n;
        $('#getbulk_oids').append(`
            <label for="oid" class="col-md-1 col-form-label text-right">oid`+m+`</label>
            <div class="col-md-3">
                <input type="text" class="form-control" id="oid`+m+`">
            </div>
        `)
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
    }

    return {
        init
    }
})();