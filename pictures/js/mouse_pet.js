// mouse-pet.js
document.addEventListener('DOMContentLoaded', function() {
    let img = document.querySelector('.img');
    // 如果找不到鼠标宠物元素，直接返回
    if (!img) return;
    
    let deg = 0;
    let imgx = 0;
    let imgy = 0;
    let imgl = 0;
    let imgt = 0;
    let y = 0;
    let index = 0;
    let mouseX = 0;
    let mouseY = 0;

    function updateMousePosition(event) {
        // 获取鼠标的当前位置，加上滚动的距离
        mouseX = event.clientX + window.scrollX;
        mouseY = event.clientY + window.scrollY;
        
        // 其他逻辑保持不变
        imgx = mouseX - img.offsetLeft - img.clientWidth / 2;
        imgy = mouseY - img.offsetTop - img.clientHeight / 2;
        deg = (180 * Math.atan2(imgy, imgx)) / Math.PI;
        index = 0;
        if (img.offsetLeft < mouseX) {
            y = -180;
        } else {
            y = 0;
        }
    }

    window.addEventListener('mousemove', updateMousePosition);

    setInterval(() => {
        img.style.transform = "rotateZ(" + deg + "deg) rotateY(" + y + "deg)";
        index++;
        if (index < 50) {
            imgl += imgx / 50;
            imgt += imgy / 50;
        } else {
            imgl = mouseX - img.clientWidth / 2;
            imgt = mouseY - img.clientHeight / 2;
        }
        img.style.left = imgl + "px";
        img.style.top = imgt + "px";
    }, 10);
});