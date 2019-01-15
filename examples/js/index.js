let data1 = [

]
let data2 = [

]
let data3 = [

]
let data4 = [

]
let data5 = [

]
for(let i = 0; i<= 60; i++){
    data1.push(
        {
            x: (new Date()).getTime() - 60e3 + (1e3 * i),
            y: Math.random() * 50
        }
    )
    data2.push(
        {
            x: (new Date()).getTime() - 60e3 + (1e3 * i),
            y: Math.random() * 50
        }
    )
    data3.push(
        {
            x: (new Date()).getTime() - 60e3 + (1e3 * i),
            y: Math.random() * 50
        }
    )
    data4.push(
        {
            x: (new Date()).getTime() - 60e3 + (1e3 * i),
            y: Math.random() * 50
        }
    )
    data5.push(
        {
            x: (new Date()).getTime() - 60e3 + (1e3 * i),
            y: Math.random() * 50
        }
    )

}
console.log(data1)

let c = new SolidChart.Chart({
    container: document.getElementById('container'),
    //width: window.innerWidth - 10,
    //height: window.innerHeight - 10,
    xAxis: [
        {}
    ],
    grid: {
        unit: 'kW'
    },
    loadData: function(series, from, to, resolution){
        console.log(from, to)
        return  new Promise(r => setTimeout(r, 3000, [2]))


    },
    series: [
        {
            data: data1,
            settings: {
                color: 0xFF0000,
                type: 'time'
            }
        },

        {
            data: data2,
            settings: {
                color: 0x0000FF,
            }
        },
        {
            data: data3,
            settings: {
                color: 0x00FFFF,
            }
        },
        {
            data: data4,
            settings: {
                color: 0x00FF00,
            }
        },
        {
            data: data5,
            settings: {
                color: 0xFF00FF,
            }
        }

    ]
})
console.log(c)
var i = 0
setInterval(function(){

        c.series[0].addPoint({x: (new Date()).getTime(), y: Math.random() * 100})
        c.series[1].addPoint({x: (new Date()).getTime(), y: Math.random() * 100})
        c.series[2].addPoint({x: (new Date()).getTime(), y: Math.random() * 100})
        c.series[3].addPoint({x: (new Date()).getTime(), y: Math.random() * 100})
        c.series[4].addPoint({x: (new Date()).getTime(), y: Math.random() * 100})


    /*
    i++
    if(i > 5){
        c.pause(true)
    }
    if(i > 10){
        c.pause(false)
    }
    */
    ///console.log(c)
}, 1000)