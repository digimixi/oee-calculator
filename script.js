document.addEventListener('DOMContentLoaded', function() {
    // 初始計算
    calculateOEE();
    
    // 為所有輸入欄位添加事件監聽器
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // 確保總生產數量在兩個欄位中保持同步
            if (this.id === 'total-pieces') {
                document.getElementById('total-production').value = this.value;
            } else if (this.id === 'total-production') {
                document.getElementById('total-pieces').value = this.value;
            }
            
            // 如果最大操作時間或計畫停機時間變更，更新計劃生產時間
            if (this.id === 'max-operation-time' || this.id === 'planned-downtime') {
                const maxOperationTime = parseFloat(document.getElementById('max-operation-time').value) || 0;
                const plannedDowntime = parseFloat(document.getElementById('planned-downtime').value) || 0;
                const loadingTime = maxOperationTime - plannedDowntime;
                document.getElementById('planned-production-time').value = loadingTime > 0 ? loadingTime : 0;
            }
            
            // 即時計算結果
            calculateOEE();
        });
    });
    
    // 計算按鈕點擊事件
    document.getElementById('calculate-btn').addEventListener('click', calculateOEE);
    
    // 計算 OEE 函數
    function calculateOEE() {
        // 獲取時間參數
        const maxOperationTime = parseFloat(document.getElementById('max-operation-time').value) || 0;
        const plannedDowntime = parseFloat(document.getElementById('planned-downtime').value) || 0;
        
        // 計算負荷時間/計畫工作時間
        const loadingTime = maxOperationTime - plannedDowntime;
        
        // 獲取可用性參數
        const plannedProductionTime = parseFloat(document.getElementById('planned-production-time').value) || 0;
        const downtime = parseFloat(document.getElementById('downtime').value) || 0;
        
        // 獲取性能參數
        const idealCycleTime = parseFloat(document.getElementById('ideal-cycle-time').value) || 0;
        const totalPieces = parseInt(document.getElementById('total-pieces').value) || 0;
        
        // 獲取品質參數
        const totalProduction = parseInt(document.getElementById('total-production').value) || 0;
        const defectivePieces = parseInt(document.getElementById('defective-pieces').value) || 0;
        
        // 計算稼動時間
        const runTime = plannedProductionTime - downtime;
        
        // 計算可用性
        const availability = plannedProductionTime > 0 ? runTime / plannedProductionTime : 0;
        
        // 計算性能
        const idealProductionTime = (idealCycleTime * totalPieces) / 60; // 轉換為分鐘
        const performance = runTime > 0 && idealProductionTime > 0 ? idealProductionTime / runTime : 0;
        
        // 計算品質
        const goodPieces = totalProduction - defectivePieces;
        const quality = totalProduction > 0 ? goodPieces / totalProduction : 0;
        
        // 計算 OEE
        const oee = availability * performance * quality;
        
        // 更新結果顯示
        document.getElementById('loading-time-result').textContent = loadingTime.toFixed(0) + '分鐘';
        document.getElementById('running-time-result').textContent = runTime.toFixed(0) + '分鐘';
        document.getElementById('good-pieces-result').textContent = goodPieces + '件';
        document.getElementById('availability-result').textContent = formatPercentage(availability);
        document.getElementById('performance-result').textContent = formatPercentage(performance);
        document.getElementById('quality-result').textContent = formatPercentage(quality);
        document.getElementById('oee-result').textContent = formatPercentage(oee);
    }
    
    // 格式化百分比
    function formatPercentage(value) {
        return (value * 100).toFixed(1) + '%';
    }
});
