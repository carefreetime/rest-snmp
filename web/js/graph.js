var App = (function () {
    function _bindEvent() {
        console.log('bind event');
        google.charts.load('current', {'packages':['line']});
        google.charts.setOnLoadCallback(drawChart);
        $('#serviceId').on('change', _serviceChange);
        $('#selectId').on('change', _selectChange);
        $('#start').on('click', _graph);
        $('#stop').on('click', _stopGraph);
        $('#clear').on('click', _clearGraph);
    }

    var serviceId = 0;
    var selectId = 0;
    var sec = 0;
    var service;
    var getifInOctets, getifOutOctets;

    function _graph() {
        sec = $('#sec').val();
        if (serviceId == 1) {
            service = 'ifInOctets';
            getifInOctets = setInterval(_getifInOctets, sec * 1000);
        } else {
            service = 'ifOutOctets';            
            getifOutOctets = setInterval(_getifOutOctets, sec * 1000);
        }        
    }

    function _stopGraph() {
        clearInterval(getifInOctets);
        clearInterval(getifOutOctets);
    }

    function _clearGraph() {
        _stopGraph();
        ifOctets = [];
        drawChart();
    }

    function _getifNumber() {
        var selectId = $('selectId').val();
        $.ajax({
            url : `http://163.22.32.174:4000/get/1.3.6.1.2.1.2.1.0/`,
            type : 'get',
            dataType : 'json',
            contentType: 'application/json', 
			xhrFields: {
				withCredentials: true
			},
            success : function(data) {
                var value = data.value;
                for (var i = 1; i <= value; i++) {
                    $('#selectId').append(`
                        <option value="` + i + `">` + i + `</option>
                    `);
                }                
            },
            error : function(jqXHR) {
                console.log(jqXHR);
            }
        });
    }

    function _serviceChange() {
        var selectObj = document.getElementById("serviceId");
        serviceId = selectObj.options[selectObj.options.selectedIndex].value;
        _getifNumber()
    }

    function _selectChange() {
        var selectObj = document.getElementById("selectId");
        selectId = selectObj.options[selectObj.options.selectedIndex].value;
    }

    var ifOctets = [];
    var date = [];
    var tmp = 0;

    function drawChart() {
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Times');
        data.addColumn('number', service);

        // 計算流量的公式
        // (ifInOctetsCurrent - ifInOctetsPrevious) * 8 / pollingSeconds
        for (var i = 0; i <= ifOctets.length; i++) {
            data.addRows([[date[i], (parseFloat(ifOctets[i]) - tmp) * 8 / sec]]);
            tmp =  parseFloat(ifOctets[i]);          
        }

        // Set chart options
        var options = {
            chart: {
                title: service,
            },
            width: "100%",
            height: 500
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.charts.Line(document.getElementById('linechart_material'));
        chart.draw(data, google.charts.Line.convertOptions(options));
    }

    function _getifInOctets() {
        $.ajax({
            url : `http://163.22.32.174:4000/get/1.3.6.1.2.1.2.2.1.10.` + selectId + `/`,
            type : 'get',
            dataType : 'json',
            contentType: 'application/json', 
			xhrFields: {
				withCredentials: true
			},
            success : function(data) {
                var value = data.value;                
                ifOctets.push(value); 
                date.push(new Date().toLocaleTimeString());
                drawChart();       
            },
            error : function(jqXHR) {
                console.log(jqXHR);
            }
        });
    }

    function _getifOutOctets() {
        $.ajax({
            url : `http://163.22.32.174:4000/get/1.3.6.1.2.1.2.2.1.16.` + selectId + `/`,
            type : 'get',
            dataType : 'json',
            contentType: 'application/json', 
			xhrFields: {
				withCredentials: true
			},
            success : function(data) {
                var value = data.value;                
                ifOctets.push(value); 
                date.push(new Date().toLocaleTimeString());
                drawChart();       
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