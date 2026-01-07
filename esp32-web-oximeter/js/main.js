// 全局变量 - 本地设置
var updateSensorDelay = 1; //单位:秒
var chartHistoryPoint = 30;

// 应用本地设置
function applyLocalConfig() {
    //读取本地存储
    if (window.localStorage) {
        updateSensorDelay = parseInt(localStorage.getItem("updateSensorDelay"));
        chartHistoryPoint = parseInt(localStorage.getItem("chartHistoryPoint"));
        if (isNaN(updateSensorDelay)) updateSensorDelay = 1;
        if (isNaN(chartHistoryPoint)) chartHistoryPoint = 30;
    }
    //应用设置
    const updateSensorDelay_e = document.getElementById("updateSensorDelay");
    const chartHistoryPoint_e = document.getElementById("chartHistoryPoint");
    if (updateSensorDelay_e) updateSensorDelay_e.value = updateSensorDelay;
    if (chartHistoryPoint_e) chartHistoryPoint_e.value = chartHistoryPoint;
}

//保存并应用本地设置
function saveLocalConfig() {
    //持久化
    var localStorage = window.localStorage;
    const updateSensorDelay_e = document.getElementById("updateSensorDelay");
    const chartHistoryPoint_e = document.getElementById("chartHistoryPoint");
    if (updateSensorDelay_e) localStorage.setItem("updateSensorDelay", updateSensorDelay_e.value);
    if (chartHistoryPoint_e) localStorage.setItem("chartHistoryPoint", chartHistoryPoint_e.value);
    //应用设置
    applyLocalConfig();
    alert("保存成功!");
}

//输出格式化后的时间
function getTime() {
    //将13位时间戳转换成时间格式 输出为2018-10-09
    var time = Date.now();
    var date = new Date(time); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return h + m + s;
}

//计算文本字节长度
function calByteLength(str) {
    return str.replace(/[\u0391-\uFFE5]/g, "##").length;
}

//保存JSON数据
//https://blog.csdn.net/qq_37312180/article/details/125088139
function saveJSON(data, filename) {
    if (!data) {
        alert("保存的数据为空");
        return;
    }
    if (!filename) filename = "json.json";
    if (typeof data === "object") {
        data = JSON.stringify(data, undefined, 4);
    }
    var blob = new Blob([data], {
            type: "text/json"
        }),
        e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
    e.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
    );
    a.dispatchEvent(e);
}

// 初始化共享设置
applyLocalConfig();