let c = new SolidChart.Chart({
    container: document.getElementById('container'),
    series: [
        {
            data: [
                {
                    x: 1,
                    y: 2
                }
            ],
            options: {
                thisisanoption: 123
            }
        }
    ]
})
console.log(c)