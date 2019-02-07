var dataPoints = new Array();
var labels = new Array();
var chart;
var n;
var p;
var x;
var tail;


$(document).ready(function(){
    getData();
     
    $('#n').on('input', function() {
        n = $(this).val();
        updateChart();
    });
    
    $("#p").on('input', function () {
        p = $(this).val();
        updateChart();            
    });
    
    $('#x').on('input', function() {
        x = $(this).val();
        probCalc();
    });
    
    $("input[type='radio']").on('input', function() {
        tail = $(this).val();
        probCalc();
    });
    
    chart = Highcharts.chart('container', {
    chart: {
        type: 'column',
        height: (40) + '%'
    },
    title: {
        text: 'Exact Binomial Distribution'
    },
    subtitle: {
        text: 'Barett Jones'
    },
    xAxis: {
        categories: labels,
        crosshair: true,
        showFirstLabel: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'SUM OF P(X)'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.3f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    series: [{
        name: 'X',
        data: dataPoints
    }],
    plotOptions: {
        series: {
            allowPointSelect: true,
            states: {
                select: {
                    color: 'red'
                }
            }
        }
    }
});
    
    
});

function updateChart(){
    if(!getData()){
        chart.series[0].update({
        data: dataPoints
        
    });
        
        chart.xAxis[0].update({
        categories: labels
        });
    }
}

function probCalc(){
    let sum = 0;
    $.each(chart.series[0].points, function(){
        this.select(false, false);
    });
    switch(tail){
        case 'left':
            $.each(chart.series[0].points, function(){
                if(this.category <= x){
                    this.select(true, true);
                    sum += this.y;
                }
            });
            $('#answer').html("Left Tail: " + sum.toFixed(3));
            break;
        case 'two':
            let mean = math.mean(labels);
            let dist = math.abs(mean-x);
            console.log(dist);
            $.each(chart.series[0].points, function(){
                if(this.category <= (mean-dist) || this.category>= (mean+dist)){
                    this.select(true, true);
                    sum += this.y;
                }
            });
            $('#answer').html("Two Tail: " + sum.toFixed(3));
            break;
        case 'right':
            $.each(chart.series[0].points, function(){
                if(this.category >= x){
                    this.select(true, true);
                    sum += this.y;
                }
            });
            $('#answer').html("Right Tail: " + sum.toFixed(3));
            break;
        case 'default':
            break;
    }
    
    console.log(sum);
    
    //chart.series[0].data[5].select(true, true);
}



function getData(){
    
    Big.DP = 10;
    Big.RM = 1;
    
    let n = $('#n').val();
    let p = $('#p').val();
    
    if(n>=.001 && n<=30000 && p>=.001 && p<1){
        if(n && p){
            dataPoints = [];
            labels = [];
            let b = 0;
            let cdf = 0;
            let cdfLast = 0;
            let j = math.add(n,1);
            for(let k = 1; k<j; k++){
                b = math.add(b,math.subtract( + math.log(n-k+1),math.log(k)));
                logpmf = b + k * math.log(p) + (n-k) * math.log(1-p);
                cdfLast = cdf;
                cdf += math.exp(logpmf);
                percentage = math.subtract(cdf,cdfLast)
                if(percentage >= .0001){
                    dataPoints.push(percentage);
                    labels.push(k);
                }

            }
    
        }
    }
    else{
        console.log("Temp Message. Not a valid input range");
        return true;
    }
}



