// legend.js - 地图图例组件

function createMapLegend() {
    // 检查是否已经有图例，避免重复创建
    if (document.getElementById('map-legend')) {
        return;
    }
    
    // 创建图例容器
    var legendContainer = document.createElement('div');
    legendContainer.id = 'map-legend';
    legendContainer.style.cssText = `
        position: absolute;
        bottom: 20px;
        right: 20px;
        background: white;
        border-radius: 5px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        padding: 12px;
        z-index: 1000;
        font-family: Arial, sans-serif;
        min-width: 150px;
    `;
    
    // 徒步点图例（山峰图片）
    var hikingItem = createLegendItem(
        './Images/peak_icon.png',
        '徒步点',
        '24px'
    );
    legendContainer.appendChild(hikingItem);
    
    // 游玩点图例 - 使用高德地图标记样式
    var tourItem = createLegendItem(
        null,
        '游玩点',
        '24px',
        'amap-marker'
    );
    legendContainer.appendChild(tourItem);
    
    // 城市边界图例
    var borderItem = createBorderLegendItem();
    legendContainer.appendChild(borderItem);
    
    // 添加到页面
    document.body.appendChild(legendContainer);
    
    // 监听地图容器变化，确保图例始终可见
    adjustLegendPosition();
    
    return legendContainer;
}

// 创建城市边界图例项
function createBorderLegendItem() {
    var item = document.createElement('div');
    item.style.cssText = `
        display: flex;
        align-items: center;
        margin: 10px 0;
        height: 24px;
    `;
    
    // 图标容器 - 用于显示边界样式
    var iconContainer = document.createElement('div');
    iconContainer.style.cssText = `
        width: 24px;
        height: 24px;
        margin-right: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        position: relative;
    `;
    
    // 创建城市边界图标
    var borderIcon = document.createElement('div');
    borderIcon.style.cssText = `
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // 填充区域（模拟面填充）
    var fillArea = document.createElement('div');
    fillArea.style.cssText = `
        position: absolute;
        width: 16px;
        height: 16px;
        background-color: #ccebc5;
        opacity: 0.5;
        border-radius: 3px;
    `;
    
    // 边框（虚线样式）
    var borderLine = document.createElement('div');
    borderLine.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        border: 1px dashed #2b8cbe;
        border-radius: 3px;
        box-sizing: border-box;
    `;
    
    borderIcon.appendChild(fillArea);
    borderIcon.appendChild(borderLine);
    iconContainer.appendChild(borderIcon);
    
    // 标签
    var label = document.createElement('div');
    label.textContent = '城市边界';
    label.style.cssText = `
        font-size: 14px;
        color: #555;
        font-weight: 500;
        display: flex;
        align-items: center;
        height: 100%;
        line-height: 1;
    `;
    
    item.appendChild(iconContainer);
    item.appendChild(label);
    
    return item;
}

// 创建单个图例项
function createLegendItem(iconUrl, labelText, iconSize, markerType) {
    var item = document.createElement('div');
    item.style.cssText = `
        display: flex;
        align-items: center;
        margin: 10px 0;
        height: ${iconSize};
    `;
    
    // 图标容器
    var iconContainer = document.createElement('div');
    iconContainer.style.cssText = `
        width: ${iconSize};
        height: ${iconSize};
        margin-right: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    `;
    
    if (markerType === 'amap-marker') {
        // 创建高德地图默认标记样式
        var amapMarker = document.createElement('div');
        amapMarker.style.cssText = `
            position: relative;
            width: 22px;
            height: 30px;
        `;
        
        // 标记的顶部（圆形部分）
        var markerTop = document.createElement('div');
        markerTop.style.cssText = `
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 14px;
            height: 14px;
            background: #29b6f6;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 4px rgba(0,0,0,0.3);
            z-index: 2;
        `;
        
        // 标记的底部（尖角部分）
        var markerBottom = document.createElement('div');
        markerBottom.style.cssText = `
            position: absolute;
            top: 8px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 16px solid #29b6f6;
            border-radius: 1px;
            z-index: 1;
        `;
        
        amapMarker.appendChild(markerTop);
        amapMarker.appendChild(markerBottom);
        iconContainer.appendChild(amapMarker);
        
    } else if (iconUrl) {
        // 使用图片图标
        var img = document.createElement('img');
        img.src = iconUrl;
        img.alt = labelText;
        img.style.cssText = `
            width: ${iconSize};
            height: ${iconSize};
            object-fit: contain;
            vertical-align: middle;
        `;
        
        // 图片加载失败时的备用样式
        img.onerror = function() {
            this.style.display = 'none';
            var fallback = document.createElement('div');
            fallback.style.cssText = `
                width: ${iconSize};
                height: ${iconSize};
                background: #4CAF50;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 14px;
            `;
            fallback.textContent = '徒';
            iconContainer.appendChild(fallback);
        };
        
        iconContainer.appendChild(img);
    } else {
        // 默认样式（蓝色圆点）
        var defaultIcon = document.createElement('div');
        defaultIcon.style.cssText = `
            width: 20px;
            height: 20px;
            background: #29b6f6;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 3px rgba(0,0,0,0.3);
        `;
        iconContainer.appendChild(defaultIcon);
    }
    
    // 标签
    var label = document.createElement('div');
    label.textContent = labelText;
    label.style.cssText = `
        font-size: 14px;
        color: #555;
        font-weight: 500;
        display: flex;
        align-items: center;
        height: 100%;
        line-height: 1;
    `;
    
    item.appendChild(iconContainer);
    item.appendChild(label);
    
    return item;
}

// 调整图例位置（避免被地图控件遮挡）
function adjustLegendPosition() {
    var legend = document.getElementById('map-legend');
    if (!legend) return;
    
    // 等待地图完全加载
    setTimeout(function() {
        var mapContainer = document.getElementById('container');
        if (!mapContainer) return;
        
        // 获取地图控件区域（通常在右下角）
        var controls = mapContainer.querySelectorAll('.amap-controls');
        var bottomOffset = 20;
        
        controls.forEach(function(control) {
            var rect = control.getBoundingClientRect();
            if (rect.bottom > window.innerHeight - 100) {
                // 如果有控件在底部，调整图例位置
                bottomOffset = rect.height + 30;
            }
        });
        
        legend.style.bottom = bottomOffset + 'px';
    }, 1000);
}

// 初始化图例（在地图加载完成后调用）
function initLegend() {
    // 方式1：如果地图有complete事件
    if (window.map && typeof map.on === 'function') {
        map.on('complete', function() {
            createMapLegend();
        });
    } 
    // 方式2：直接创建，延迟确保DOM加载完成
    else {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createMapLegend);
        } else {
            createMapLegend();
        }
    }
}

// 导出函数
window.createMapLegend = createMapLegend;
window.initLegend = initLegend;
window.adjustLegendPosition = adjustLegendPosition;

// 自动初始化
if (typeof map !== 'undefined') {
    // 如果地图已经存在
    initLegend();
} else {
    // 监听地图创建
    document.addEventListener('AMapLoaded', initLegend);
}