var App = (function () {
    function _bindEvent() {
        console.log('bind event');
        _trap();
    }

    function _trap() {
        $.ajax({
            url : `http://163.22.32.174:4000/gettrap/`,
            type : 'get',
            dataType : 'json',
            success : function(data) {                
                for (let objects of data) {
                    var time = objects.time;
                    var op = objects.pdu.op;
                    var enterprise = objects.pdu.enterprise;
                    var agent_addr = objects.pdu.agent_addr;
                    var generic_trap = objects.pdu.generic_trap;
                    var specific_trap = objects.pdu.specific_trap;
                    var time_stamp = objects.pdu.time_stamp;
                    var oid = objects.pdu.varbinds.oid;
                    var typename = objects.pdu.varbinds.typename;
                    var value = objects.pdu.varbinds.value;
                    var string_value = objects.pdu.varbinds.string_value;
                    

                    $('#tbody').append(`
                        <tr>
                            <td>`+time+`</td>
                            <td></td>
                            <td>`+op+`</td>
                            <td>`+enterprise+`</td>
                            <td>`+agent_addr+`</td>
                            <td>`+generic_trap+`</td>
                            <td>`+specific_trap+`</td>
                            <td>`+time_stamp+`</td>
                            <td></td>
                            <td>`+oid+`</td>
                            <td>`+typename+`</td>
                            <td>`+value+`</td>
                            <td>`+string_value+`</td>
                        </tr>
                    `);
                }                           
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