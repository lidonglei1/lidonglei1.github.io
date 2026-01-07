// 传感器数据 - 监测仪1
var updateSensor_Timer = null;
var historyDatas = [];
var historyTimeLabels = [];
var historyBPM = [];
var historySpO2 = [];
var BPM_e, SpO2_e;
var myChart;

// 初始化监测仪1
function initHome() {
    BPM_e = document.getElementById("BPM");
    SpO2_e = document.getElementById("SpO2");
    initChart();
    updateSensor();
}

//图表 - 监测仪1
function initChart() {
    const historyChart = document.getElementById('historyChart');
    if (!historyChart) return;
    
    const data = {
        labels: historyTimeLabels,
        datasets: [{
            label: '心率',
            data: historyBPM,
            fill: false,
            borderColor: 'rgb(249, 84, 39)', // 设置线的颜色
            tension: 0.1,
            pointRadius: 0,
        }, {
            label: '血氧',
            data: historySpO2,
            fill: false,
            borderColor: 'rgb(0, 122, 204)', // 设置线的颜色
            tension: 0.1,
            pointRadius: 0,
        }]
    };
    const config = {
        type: 'line', // 设置图表类型
        data: data,
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
    myChart = new Chart(historyChart, config);
}

//获取传感器数据 - 监测仪1
function updateSensor() {
    //关闭定时器
    if (updateSensor_Timer != null)
        clearInterval(updateSensor_Timer);

    const data = null;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function() {
        if (this.readyState === this.DONE) {
            var json = JSON.parse(this.responseText);
            //更新页面数据
            if (BPM_e) BPM_e.innerText = json.BPM.toFixed(0);
            //血氧
            if (SpO2_e) {
                if (json.SpO2.toFixed(0) != 80)
                    SpO2_e.innerText = json.SpO2.toFixed(0);
                else
                    SpO2_e.innerText = "---";
            }
            //保存数据
            json["localTime"] = Date.now();
            historyDatas.push(json);
            //更新历史图表数据
            historyTimeLabels.push(getTime());
            historyBPM.push(json.BPM);
            historySpO2.push(json.SpO2);
            //弹出旧图表数据
            while (historyTimeLabels.length > chartHistoryPoint) {
                historyTimeLabels.shift();
                historyBPM.shift();
                historySpO2.shift();
            }
            //更新图表
            if (myChart) myChart.update();
            //重启定时器
            updateSensor_Timer = setInterval(updateSensor, updateSensorDelay * 1000);
        }
    });
    xhr.open("GET", "getBPM_SpO2");
    xhr.send(data);
}

//导出历史数据 - 监测仪1
function exportHistoricalData() {
    saveJSON(historyDatas, "ESP32血氧仪_监测仪1_" + Date.now() + ".json");
}