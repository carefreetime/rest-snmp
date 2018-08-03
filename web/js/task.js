var App = (function () {
    function _bindEvent() {
        console.log('bind event');
        $('#add').on('click', _addTask);
        $('#selectId').on('change', PDUOnChange);
        $('#n').on('change', NOnChange);
        $('#sec').on('change', gettime);
        $(document).on('click', '.start', _start);
        $(document).on('click', '.stop', stop);
        $(document).on('click', '.delete', _delete);
    }

    var service, sec;
    var task = 0;

    function _addTask() {
        var pdu = PDUOnChange();
        var service_content = '';
        switch (pdu) {
            case '1' :
                service = 'Get';
                service_content = $('#oid').val();
                break;
            case '2' :
                service = 'GetNext';    
                service_content = $('#oid').val();                           
                break;
            case '3' :
                service = 'GetBulk';   
                var n = $('#n').val();
                for (var i = 1; i <= n; i++) {
                    service_content = service_content + $('#oid' + i ).val() + ',';
                }
                ++n;
                service_content = service_content + $('#oid' + n).val();
                console.log(service_content);
                break;
            case '4' :
                service = 'GetSubTree';    
                service_content = $('#oid').val();                           
                break;
            case '5' :
                service = 'Walk';       
                service_content = $('#oid').val();
                break;                                    
        }       

        var n = $('#n').val();
        if(!n) {
            n = 0;
        }
        var m = $('#m').val();
        if(!m) {
            m = 0;
        }

        $.ajax({
            url : `http://163.22.32.174:4000/store/` + service + `/` + service_content + `/` + sec + `/` + n + `/` + m,
            type : 'get',
            dataType : 'json',
            success : function(data) {
                console.log(success);   
            },
            error : function(jqXHR) {
                console.log(jqXHR);
            }
        });
        location.reload(); 
    }

    var get, getnext, getbulk, getsubtree, walk;

    function _start() {
        var tid = $(this).parents('.list-group-item').attr('data-id');           
        var taskid = $(this).parents('.list-group-item').attr('id');        

        $.ajax({
            url : `http://163.22.32.174:4000/gettask/` + tid,
            type : 'get',
            dataType : 'json',
            success : function(data) {                
                for (let objects of data) {
                    var pdu = objects.pdu;
                    var second = objects.second;
                    var oid = objects.oid;
                    var n = objects.n;
                    var m = objects.m;
                    
                    switch (pdu) {
                        case 'Get' :
                            get = setInterval(_get, second * 1000, oid, taskid);
                            break;
                        case 'GetNext' :     
                            getnext = setInterval(_getNext, second * 1000, oid, taskid);                                             
                            break;
                        case 'GetBulk' :
                            getbulk = setInterval(_getbulk, second * 1000, oid, taskid, n, m);
                            break;
                        case 'GetSubTree' :
                            getsubtree = setInterval(_getSubTree, second * 1000, oid, taskid);                 
                            break;
                        case 'Walk' :
                            walk = setInterval(_walk, second * 1000, oid, taskid);                        
                            break;                                    
                    }
                }     
                                     
            },
            error : function(jqXHR) {
                console.log(jqXHR);
            }
        });        
    }

    function stop() {
        var tid = $(this).parents('.list-group-item').attr('data-id');        
        $.ajax({
            url : `http://163.22.32.174:4000/gettask/` + tid,
            type : 'get',
            dataType : 'json',
            success : function(data) {                
                for (let objects of data) {
                    var pdu = objects.pdu;
                    
                    switch (pdu) {
                        case 'Get' :
                            clearInterval(get);
                            break;
                        case 'GetNext' :     
                            clearInterval(getnext);                                     
                            break;
                        case 'GetBulk' :
                            clearInterval(getbulk);                        
                            break;
                        case 'GetSubTree' :
                            clearInterval(getsubtree);                                           
                            break;
                        case 'Walk' :
                            clearInterval(walk);                                                  
                            break;                                    
                    }
                }     
                                     
            },
            error : function(jqXHR) {
                console.log(jqXHR);
            }
        });
    }

    function _delete() {
        var tid = $(this).parents('.list-group-item').attr('data-id');
        $.ajax({
            url : `http://163.22.32.174:4000/deletetask/` + tid,
            type : 'get',
            dataType : 'json',
            success : function(data) {
                console.log(success);    
            },
            error : function(jqXHR) {
                console.log(jqXHR);
            }
        });
        location.reload();
    }

    function gettime() {
        sec = $('#sec').val();
    }

    function PDUOnChange() {
        var selectObj = document.getElementById("selectId");
        if (selectObj.options[selectObj.options.selectedIndex].value == 3) {
            $("#get").addClass("hidden_text");
            $("#getbulk").removeClass("hidden_text"); 
        } else if (selectObj.options[selectObj.options.selectedIndex].value == 0) {
            $("#get").addClass("hidden_text");
            $("#getbulk").addClass("hidden_text");
        } else {
            $("#get").removeClass("hidden_text");
            $("#getbulk").addClass("hidden_text");
        }
        return selectObj.options[selectObj.options.selectedIndex].value;
    }

    function NOnChange() {
        $('#getbulk_oids').html("");
        $("#getbulk_button").removeClass("hidden_text");

        var n = $('#n').val();
        for (var i = 1; i <= n; i++) {
            $('#getbulk_oids').append(`
                <label for="oid" class="col-md-1 col-form-label text-right" style="margin-top: 10px">oid`+i+`</label>
                <div class="col-md-5">
                    <input type="text" class="form-control" id="oid`+i+`">
                </div>                
            `);
        }

        var m = ++n;
        $('#getbulk_oids').append(`
            <label for="oid" class="col-md-1 col-form-label text-right" style="margin-top: 10px">oid`+m+`</label>
            <div class="col-md-5">
                <input type="text" class="form-control" id="oid`+m+`">
            </div>
        `);
    }

    function _get(oid, taskid) {
        $.ajax({
            url : `http://163.22.32.174:4000/get/` + oid,
            type : 'get',
            dataType : 'json',
            success : function(data) {
                var oid = data.oid;
                var type = data.type;
                var value = JSON.stringify(data.value);

                $("#list" + taskid).removeClass("hidden_text");
                if (oid) {
                    if(value == '""') {
                        $('#task' + taskid).append(`
                            <tr>
                                <td bgcolor="#AAAAAA">`+oid+`</td>
                                <td bgcolor="#AAAAAA">`+type+`</td>
                                <td bgcolor="#AAAAAA"></td>
                            </tr>
                        `);
                    } else {
                        $('#task' + taskid).append(`
                            <tr>
                                <td>`+oid+`</td>
                                <td>`+type+`</td>
                                <td>`+value+`</td>
                            </tr>
                        `);
                    } 
                } else {
                    clearInterval(get);
                    $("#list" + taskid).addClass('hidden_text');
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

    function _getNext(oid, taskid) {
        $.ajax({
            url : `http://163.22.32.174:4000/getnext/` + oid,
            type : 'get',
            dataType : 'json',
            success : function(data) {
                var oid = data.oid;
                var type = data.type;
                var value = JSON.stringify(data.value);

                $("#list" + taskid).removeClass("hidden_text");
                if (oid) {
                    if(value == '""') {
                        $('#task' + taskid).append(`
                            <tr>
                                <td bgcolor="#AAAAAA">`+oid+`</td>
                                <td bgcolor="#AAAAAA">`+type+`</td>
                                <td bgcolor="#AAAAAA"></td>
                            </tr>
                        `);
                    } else {
                        $('#task' + taskid).append(`
                            <tr>
                                <td>`+oid+`</td>
                                <td>`+type+`</td>
                                <td>`+value+`</td>
                            </tr>
                        `);
                    } 
                } else {
                    clearInterval(getnext);
                    $("#list" + taskid).addClass('hidden_text');
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

    function _getSubTree(oid, taskid) {
        $.ajax({
            url : `http://163.22.32.174:4000/subtree/` + oid,
            type : 'get',
            dataType : 'json',
            success : function(data) {
                for(let objects of data) {
                    var oid = objects.oid;
                    var type = objects.type;
                    var value = JSON.stringify(objects.value);

                    $("#list" + taskid).removeClass("hidden_text");
                    if (oid) {
                        if(value == '""') {
                            $('#task' + taskid).append(`
                                <tr>
                                    <td bgcolor="#AAAAAA">`+oid+`</td>
                                    <td bgcolor="#AAAAAA">`+type+`</td>
                                    <td bgcolor="#AAAAAA"></td>
                                </tr>
                            `);
                        } else {
                            $('#task' + taskid).append(`
                                <tr>
                                    <td>`+oid+`</td>
                                    <td>`+type+`</td>
                                    <td>`+value+`</td>
                                </tr>
                            `);
                        } 
                    } else {
                        clearInterval(getsubtree);
                        $("#list" + taskid).addClass('hidden_text');
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

    function _walk(oid, taskid) {
        $.ajax({
            url : `http://163.22.32.174:4000/walk/` + oid,
            type : 'get',
            dataType : 'json',
            success : function(data) {
                for(let objects of data) {
                    var oid = objects.oid;
                    var type = objects.type;
                    var value = JSON.stringify(objects.value);

                    $("#list" + taskid).removeClass("hidden_text");
                    if (oid) {
                        if(value == '""') {
                            $('#task' + taskid).append(`
                                <tr>
                                    <td bgcolor="#AAAAAA">`+oid+`</td>
                                    <td bgcolor="#AAAAAA">`+type+`</td>
                                    <td bgcolor="#AAAAAA"></td>
                                </tr>
                            `);
                        } else {
                            $('#task' + taskid).append(`
                                <tr>
                                    <td>`+oid+`</td>
                                    <td>`+type+`</td>
                                    <td>`+value+`</td>
                                </tr>
                            `);
                        } 
                    } else {
                        clearInterval(walk);
                        $("#list" + taskid).addClass('hidden_text');
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

    function _getbulk(oid, taskid, n, m) {
        $.ajax ({
            url : `http://163.22.32.174:4000/getbulk/` + n + `/` + m + `/` + oid,
            type : 'get',
            dataType : 'json',
            success : function(data) {
                for(let objects of data) {
                    var oid = objects.oid;
                    var type = objects.type;
                    var value = JSON.stringify(objects.value);

                    $("#list" + taskid).removeClass("hidden_text");
                    if (oid) {
                        if(value == '""') {
                            $('#task' + taskid).append(`
                                <tr>
                                    <td bgcolor="#AAAAAA">`+oid+`</td>
                                    <td bgcolor="#AAAAAA">`+type+`</td>
                                    <td bgcolor="#AAAAAA"></td>
                                </tr>
                            `);
                        } else {
                            $('#task' + taskid).append(`
                                <tr>
                                    <td>`+oid+`</td>
                                    <td>`+type+`</td>
                                    <td>`+value+`</td>
                                </tr>
                            `);
                        } 
                    } else {
                        clearInterval(getbulk);
                        $("#list" + taskid).addClass('hidden_text');
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

    function _task() {
        $.ajax({
            url : `http://163.22.32.174:4000/gettask/`,
            type : 'get',
            dataType : 'json',
            success : function(data) { 
                for (let objects of data) {
                    task++;
                    var pdu = objects.pdu;
                    var oid = objects.oid;
                    var second = objects.second;
                    var n = objects.n;
                    var m = objects.m;
                    var id = objects._id;                    

                    $('#list-tab').append(`
                    <a class="list-group-item list-group-item-action" data-id="${id}" id="` + task + 
                    `" data-toggle="list" href="#list` + task + `" role="tab" style="margin-bottom: 5px">
                        <div class="row">
                            <div class="col-md-6"><h6>` + pdu + `</h6></div>
                            <div class="col-md-2">every</div>
                            <div class="col-md-1">` + second + `</div>
                            <div class="col-md-1">seconds</div>
                            <div class="col-md-12">` + oid + `</div>
                        </div>
                        <span class="pull-right">
                            <button class="btn btn-success start"><i class="fa fa-play" aria-hidden="true"></i></button>
                            <button class="btn btn-warning stop"><i class="fa fa-stop" aria-hidden="true" style="color:white"></i></button>
                            <button class="btn btn-danger delete"><i class="fa fa-trash-o fa-lg"></i></button>
                        </span>
                    </a>`);
                    $('#nav-tabContent').append(`<div class="tab-pane fade show hidden_text" id="list` + task + `" role="tabpanel">
                    <table class="table table-dark">
                        <thead>
                            <tr>
                            <th scope="col">oid</th>
                            <th scope="col">type</th>
                            <th scope="col">value</th>
                            </tr>
                        </thead>
                        <tbody  id="task` + task + `" ></tbody>
                    </table>
                    </div>`);        
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
                     _task();
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