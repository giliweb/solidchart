let data1 = [

]
let data2 = [

]
for(let i = 0; i<= 100; i++){
    data1.push(
        {
            x: 0 + i,
            y: Math.random() * 600
        }
    )

    data2.push(
        {
            x: 0 + i,
            y: Math.random() * 600
        }
    )
}

let c = new SolidChart.Chart({
    container: document.getElementById('container'),
    xAxis: [
        {}
    ],
    series: [
        {
            data: data1,
            settings: {
                color: 0xFF0000,
            }
        },
        {
            data: data2,
            settings: {
                color: 0x0000FF,
            }
        }
    ]
})
console.log(c)
setInterval(function(){
    //c.series[0].addPoint({x: new Date(), y: Math.random() * 600})
    ///console.log(c)
}, 1000)