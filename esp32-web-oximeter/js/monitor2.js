// 传感器数据 - 监测仪2
var updateSensor_Timer2 = null;
var historyDatas2 = [];
var historyTimeLabels2 = [];
var historyBPM2 = [];
var historySpO22 = [];
var BPM2_e, SpO22_e;
var myChart2;

// 初始化监测仪2
function initHome2() {
    BPM2_e = document.getElementById("BPM2");
    SpO22_e = document.getElementById("SpO22");
    initChart2();
    updateSensor2();
}

//图表 - 监测仪2
function initChart2() {
    const historyChart2 = document.getElementById('historyChart2');
    if (!historyChart2) return;
    
    const data2 = {
        labels: historyTimeLabels2,
        datasets: [{
            label: '心率',
            data: historyBPM2,
            fill: false,
            borderColor: 'rgb(249, 84, 39)', // 设置线的颜色
            tension: 0.1,
            pointRadius: 0,
        }, {
            label: '血氧',
            data: historySpO22,
            fill: false,
            borderColor: 'rgb(0, 122, 204)', // 设置线的颜色
            tension: 0.1,
            pointRadius: 0,
        }]
    };
    const config2 = {
        type: 'line', // 设置图表类型
        data: data2,
        options: {
            responsive: true, // 设置图表为响应式，根据屏幕窗口变化而变化
            maintainAspectRatio: false,
            bezierCurve: true, // 是否使用贝塞尔曲线? 即:线条是否弯曲
            legend: {
                usePointStyle: true,
            },
            animation: {
                duration: 0.1
            }
        }
    };
    myChart2 = new Chart(historyChart2, config2);
}

//获取传感器数据 - 监测仪2
function updateSensor2() {
    //关闭定时器
    if (updateSensor_Timer2 != null)
        clearInterval(updateSensor_Timer2);

    const data = null;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function() {
        if (this.readyState === this.DONE) {
            var json = JSON.parse(this.responseText);
            //更新页面数据
            if (BPM2_e) BPM2_e.innerText = json.BPM.toFixed(0);
            //血氧
            if (SpO22_e) {
                if (json.SpO2.toFixed(0) != 80)
                    SpO22_e.innerText = json.SpO2.toFixed(0);
                else
                    SpO22_e.innerText = "---";
            }
            //保存数据
            json["localTime"] = Date.now();
            historyDatas2.push(json);
            //更新历史图表数据
            historyTimeLabels2.push(getTime());
            historyBPM2.push(json.BPM);
            historySpO22.push(json.SpO2);
            //弹出旧图表数据
            while (historyTimeLabels2.length > chartHistoryPoint) {
                historyTimeLabels2.shift();
                historyBPM2.shift();
                historySpO22.shift();
            }
            //更新图表
            if (myChart2) myChart2.update();
            //重启定时器
            updateSensor_Timer2 = setInterval(updateSensor2, updateSensorDelay * 1000);
        }
    });
    xhr.open("GET", "getBPM_SpO22");
    xhr.send(data);
}

//导出历史数据 - 监测仪2
function exportHistoricalData2() {
    saveJSON(historyDatas2, "ESP32血氧仪_监测仪2_" + Date.now() + ".json");
}