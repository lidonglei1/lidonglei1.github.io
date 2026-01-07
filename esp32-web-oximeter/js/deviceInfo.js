// 设备信息相关变量
var updateDeviceInfo_Timer = null;

// 初始化设备信息页面
function initDeviceInfo() {
    updateDeviceInfo();
    // 设置定时器，定期更新设备信息
    if (updateDeviceInfo_Timer != null) {
        clearInterval(updateDeviceInfo_Timer);
    }
    updateDeviceInfo_Timer = setInterval(updateDeviceInfo, 5000); // 每5秒更新一次
}

// 获取设备信息
function updateDeviceInfo() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "getDeviceInfo");
    xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                const json = JSON.parse(this.responseText);
                // 更新设备信息显示
                const deviceName_e = document.getElementById("deviceName");
                const CPU_e = document.getElementById("CPU");
                const MEM_e = document.getElementById("MEM");
                const FLASH_e = document.getElementById("FLASH");
                const STA_IP_e = document.getElementById("STA_IP");
                const compilationDate_e = document.getElementById("compilationDate");
                const sdkVersion_e = document.getElementById("sdkVersion");
                const sketchMD5_e = document.getElementById("sketchMD5");
                
                if (deviceName_e) deviceName_e.innerText = json.deviceName || "N/A";
                if (CPU_e) CPU_e.innerText = json.CPU || "N/A";
                if (MEM_e) MEM_e.innerText = json.MEM || "N/A";
                if (FLASH_e) FLASH_e.innerText = json.FLASH || "N/A";
                if (STA_IP_e) STA_IP_e.innerText = json.STA_IP || "0.0.0.0";
                if (compilationDate_e) compilationDate_e.innerText = json.compilationDate || "N/A";
                if (sdkVersion_e) sdkVersion_e.innerText = json.sdkVersion || "N/A";
                if (sketchMD5_e) sketchMD5_e.innerText = json.sketchMD5 || "N/A";
            } else {
                console.error("获取设备信息失败");
            }
        }
    };
    xhr.send();
}

// 页面卸载时清除定时器
window.addEventListener('beforeunload', function() {
    if (updateDeviceInfo_Timer != null) {
        clearInterval(updateDeviceInfo_Timer);
    }
});