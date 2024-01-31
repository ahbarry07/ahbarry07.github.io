export function drawChartAttemps(attempsObject) {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Attemps');
    for (let at of attempsObject){
        data.addRows([
          [`${at.name}`, at.count]
        ]);
    }

    // Set chart options
    var options = {'title':'Nombre de tentative pour un exerice',
                   'width':850,
                   'height':500,
                };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
    chart.draw(data, options);

    google.charts.setOnLoadCallback(drawChartAttemps);
}
export function drawChartEvolution(evolutionData){
    
    var tab = []
    for (let evo of evolutionData){
        tab.push([`${evo.date}`,  evo.kb])
    }
   
    var data = google.visualization.arrayToDataTable([
        ['Date', 'kB'],
        ...tab,
    ]);

    var options = {
        title: 'Progression',
        hAxis: {title: 'Date',  titleTextStyle: {color: '#333'}},
        backgroundColor: '#f0f0f0',
        width: '800',
        vAxis: {minValue: 0},
       
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div2'));
    chart.draw(data, options);
}