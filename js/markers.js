// 1.首先在页面头部添加CSS样式
function addAnimationStyles() {
    var style = document.createElement('style');
    style.innerHTML = `
        .marker-scale-in {
            animation: scaleIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .marker-scale-out {
            animation: scaleOut 0.3s ease forwards;
        }
        
        @keyframes scaleIn {
            0% {
                transform: scale(0) rotate(0deg);
                opacity: 0;
            }
            100% {
                transform: scale(1) rotate(360deg);
                opacity: 1;
            }
        }
        
        @keyframes scaleOut {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            100% {
                transform: scale(0.1);
                opacity: 0;
            }
        }
        
        /* 针对高德地图标记的特定选择器 */
        .amap-marker > div:first-child {
            transform-origin: center !important;
        }
    `;
    document.head.appendChild(style);
}
// 2.创建点标记函数
// 2.1徒步点
function createMarker1(map, lnglat, title, contentInfo, imgUrl, linkUrl, season) {
    
   var marker = new AMap.Marker({
        map: map,
        position: lnglat,
        offset: new AMap.Pixel(-32, -32)
    });

    // 添加季节属性到marker对象
    marker.season = season;
    
    // 添加文本标签
    var text = new AMap.Text({
        text: title,
        position: lnglat,
        style: {
            'background-color': '#29b6f6',
            'border-color': '#e1f5fe',
            'font-size': '16px',
        }
    });

    function showText() {
        text.setMap(map);
    }

    function removeText() {
        text.setMap(null);
    }

    function openInfoWindow() {
        var infoContent = [
            "<div style='padding:7px 0px 0px 0px;'>",
            "<h4>" + title + "</h4>",
            contentInfo.map(function(line) { 
                return "<p class='input-item'>" + line + "</p>"; 
            }).join(""),
            "<p class='input-item'>点击进入：<a href='" + linkUrl + "' target='_blank'>相册集</a></p>",
            "<img src='" + imgUrl + "' alt='" + title + "' style='width:300px; height:auto;'>",
            "</div>"
        ].join("");
    
        var infoWindow = new AMap.InfoWindow({
            content: infoContent,
            offset: new AMap.Pixel(0, -30)
        });
    
        infoWindow.open(map, marker.getPosition());
    }

    marker.on('mouseover', showText);
    marker.on('mouseout', removeText);
    marker.on('click', openInfoWindow);

    return marker;
}
// 2.2游玩点
function createMarker2(map, lnglat, title, contentInfo, imgUrl, linkUrl, season) {
    var marker = new AMap.Marker({
        map: map,
        position: lnglat,
    });
    // 添加季节属性到marker对象
    marker.season = season;
    var text = new AMap.Text({
        text: title,
        position: lnglat,
        style: {
            'background-color': '#29b6f6',
            'border-color': '#e1f5fe',
            'font-size': '16px',
        }
    });

    function showText() {
        text.setMap(map);
    }

    function removeText() {
        text.setMap(null); // 使用 setMap(null) 来移除对象
    }

    function openInfoWindow() {
        var infoContent = [
            "<div style='padding:7px 0px 0px 0px;'>",
            "<h4>" + title + "</h4>",
            contentInfo.map(function(line) { return "<p class='input-item'>" + line + "</p>"; }).join(""),
            // 动态生成链接，使用传入的 linkUrl 参数
            "<p class='input-item'>点击进入：<a href='" + linkUrl + "' target='_blank'>相册集</a></p>",
            // 正确地将 imgUrl 插入到 img 标签的 src 属性中
            "<img src='" + imgUrl + "' alt='" + title + "' style='width:300px; height:auto;'>",
            "</div>"
        ].join("");

        var infoWindow = new AMap.InfoWindow({
            content: infoContent,
            offset: new AMap.Pixel(0, -30)
        });

        infoWindow.open(map, marker.getPosition());
    }

    marker.on('mouseover', showText);
    marker.on('mouseout', removeText);
    marker.on('click', openInfoWindow);

    return marker;
}
// 3.按季节选择函数
// 3.1创建季节过滤函数
/*
function filterBySeason(season) {
    allMarkers.forEach(function(marker) {
        if (season === '全部' || marker.season === season) {
            marker.setMap(map);  // 显示符合条件的标记
        } else {
            marker.setMap(null); // 隐藏不符合条件的标记
        }
    });
}
*/
function filterBySeason(season) {
    // 记录当前显示的标记
    var currentShownMarkers = allMarkers.filter(function(marker) {
        return marker.getMap();
    });
    
    // 先为当前显示的标记添加淡出动画
    currentShownMarkers.forEach(function(marker) {
        var shouldHide = (season !== '全部' && marker.season !== season);
        
        if (shouldHide) {
            // 尝试添加淡出动画类
            try {
                // 给标记一个唯一ID以便查找
                if (!marker.animationId) {
                    marker.animationId = 'marker_' + Math.random().toString(36).substr(2, 9);
                }
                
                // 延迟隐藏，让CSS动画有时间执行
                setTimeout(function() {
                    marker.setMap(null);
                }, 250); // 比动画时间稍短
            } catch(e) {
                // 如果出错，直接隐藏
                marker.setMap(null);
            }
        }
    });
    
    // 延迟显示新标记
    setTimeout(function() {
        allMarkers.forEach(function(marker) {
            var shouldShow = (season === '全部' || marker.season === season);
            var isCurrentlyShown = marker.getMap();
            
            if (shouldShow && !isCurrentlyShown) {
                marker.setMap(map);
            }
        });
    }, 300);
}
// 3.2创建季节过滤按钮（可以添加到地图控件中）
function createSeasonFilterButtons() {
    // 创建按钮容器
    var buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'absolute';
    buttonContainer.style.top = '80px';
    buttonContainer.style.right = '20px';
    buttonContainer.style.zIndex = '1000';
    buttonContainer.style.background = 'white';
    buttonContainer.style.padding = '10px';
    buttonContainer.style.borderRadius = '5px';
    buttonContainer.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    
    // 按钮标题
    var title = document.createElement('div');
    title.innerHTML = '<strong>季节筛选：</strong>';
    title.style.marginBottom = '5px';
    buttonContainer.appendChild(title);
    
    // 季节选项
    var seasons = ['全部', '春季', '夏季', '秋季', '冬季'];
    
    seasons.forEach(function(season) {
        var button = document.createElement('button');
        button.innerHTML = season;
        button.style.margin = '2px';
        button.style.padding = '5px 10px';
        button.style.border = '1px solid #ccc';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = '#f0f0f0';
        
        // 鼠标悬停效果
        button.onmouseover = function() {
            this.style.backgroundColor = '#e0e0e0';
        };
        
        button.onmouseout = function() {
            this.style.backgroundColor = '#f0f0f0';
        };
        
        button.onclick = function() {
            filterBySeason(season);
            // 移除高亮当前选中的按钮的代码，让按钮点击后颜色不变
        };
        
        buttonContainer.appendChild(button);
    });
    
    // 将按钮容器添加到页面
    document.body.appendChild(buttonContainer);
}
// 4.存储所有标记的数组
var allMarkers = [];
// 4.1徒步点
var p1 = createMarker1(
    map,
    new AMap.LngLat(114.225756, 31.352571),
    '界岭村',
    [
        "地点 : 湖北省大悟县",
        "游历时间 : 2024年12月1日、2023年11月19日",
        "介绍 : 赏银杏，低难度徒步路线",
        "注意事项 :",
        "1. 如果去横岩子的话从靠近古银杏树的那里上去",
        "2. 注意游玩时间，银杏最佳观赏期每年不一样，第一次去的时候一般，第二次去的时候非常好。"
    ],
    'pictures/images/jieling/1.jpg',
    'pictures/jieling.html',
    '秋季'  // 添加季节属性
);
allMarkers.push(p1);

var p2 = createMarker1(
    map,
    new AMap.LngLat(100.222567, 27.018516),
    '干河坝',
    [
        "地点 : 云南省丽江市",
        "游历时间 : 2025年8月27日",
        "介绍 : 经典绝望坡，初级难度徒步路线",
        "注意事项 :",
        "1. 距离市区比较近，天气晴朗会更好看",
        "2. 拼车去的，还有一条线是玉龙大峡谷，难度更大一些"
    ],
    'pictures/images/ganheba/1.jpg',
    'pictures/ganheba.html',
    '夏季'  // 添加季节属性
);
allMarkers.push(p2);

var p3 = createMarker1(
    map,
    new AMap.LngLat(100.170329, 27.259231),
    '虎跳峡',
    [
        "地点 : 云南省迪庆州",
        "游历时间 : 2025年8月20日",
        "介绍 : 入门徒步路线，老少皆宜",
        "注意事项 :",
        "1. 近距离观水要去公路下面，徒步路线主要是高路观赏",
        "2. 可以拼车往返，车辆很多，但鱼龙混杂"
    ],
    'pictures/images/hutiaoxia/1.jpg',
    'pictures/hutiaoxia.html',
    '夏季'  // 添加季节属性
);
allMarkers.push(p3);

var p4 = createMarker1(
    map,
    new AMap.LngLat(99.972823, 28.244909),
    '老药山',
    [
        "地点 : 云南省迪庆州",
        "游历时间 : 2025年8月21日",
        "介绍 : 入门徒步路线",
        "注意事项 :",
        "1. 近距离观水要去公路下面，徒步路线主要是高路观赏",
        "2. 可以拼车往返，车辆很多，但鱼龙混杂"
    ],
    'pictures/images/laoyaoshan/1.jpg',
    'pictures/laoyaoshan.html',
    '夏季'  // 添加季节属性
);
allMarkers.push(p4);

var p5 = createMarker1(
    map,
    new AMap.LngLat(99.972823, 28.244909),
    '无底湖',
    [
        "地点 : 云南省迪庆州",
        "游历时间 : 2025年8月20日",
        "介绍 : 入门徒步路线，老少皆宜",
        "注意事项 :",
        "1. 近距离观水要去公路下面，徒步路线主要是高路观赏",
        "2. 可以拼车往返，车辆很多，但鱼龙混杂"
    ],
    'pictures/images/wudihu/1.jpg',
    'pictures/wudihu.html',
    '夏季'  // 添加季节属性
);
allMarkers.push(p5);
// 4.2游玩点
var m1 = createMarker2(
    map,
    new AMap.LngLat(118.792504, 32.071650),
    '南京市玄武湖',
    [
        "地点 : 江苏省南京市",
        "游历时间 : 2024年9月1日",
        "介绍 : 类似东湖，是一个不错的散步地点，可以看到地标建筑，密集程度中等",
        "注意事项 :"
    ],
    'pictures/images/nanjingxuanwu/1.jpg', // 图片URL
    'pictures/nanjingxuanwu.html',
    '秋季'
);
allMarkers.push(m1);
var m3 = createMarker2(
    map,
    new AMap.LngLat(114.295585, 30.608446),
    '武汉市解放公园',
    [
        "地点 : 湖北省武汉市",
        "游历时间 : 2024年11月26日",
        "介绍 : 武汉必去公园之一，园内多为杉类树木，还有银杏树、鸽子和岛中塔",
        "注意事项 :"
    ],
    'pictures/images/wuhanjiefanggongyuan/1.jpg', // 图片URL
    'pictures/wuhanjiefanggongyuan.html' ,
    '秋季'
);
allMarkers.push(m3);
var m4 = createMarker2(
    map,
    new AMap.LngLat(122.123375, 37.513591),
    '威海市',
    [
        "游历时间 : 2024年1月19日",
        "介绍 : 海边的曼彻斯特",
        "注意事项 :"
    ],
    'pictures/images/weihai/1.jpg', // 图片URL
    'pictures/weihai.html',// 完整链接路径
    '冬季'
);
allMarkers.push(m4);
// 5.页面加载完成后创建筛选按钮
window.onload = function() {
    createSeasonFilterButtons();
    addAnimationStyles(); // 添加CSS样式

};



