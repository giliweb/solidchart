let c = new SolidChart.Chart({
    container: document.getElementById('container'),
    xAxis: [
        {}
    ],
    series: [
        {
            data: [
                {
                    x: 200,
                    y: Math.random() * 600
                }
            ],
            options: {
                thisisanoption: 123
            }
        }
    ]
})
console.log(c)
setInterval(function(){
    c.series[0].addPoint({x: new Date(), y: Math.random() * 600})
    ///console.log(c)
}, 1000)