document.addEventListener('DOMContentLoaded', function() {
    // 获取轮播图容器
    const container = document.getElementById('headleft');
    
    // 根据当前页面文件名确定文件夹名称
    function getPageName() {
        const path = window.location.pathname;
        const page = path.split("/").pop();
        return page.replace('.html', '').replace('.htm', '');
    }
    
    const folderName = getPageName();
    
    // 动态加载图片，不设置最大数量
    let imageCount = 0;
    
    // 尝试加载图片直到找不到文件
    function loadImages() {
        let i = 1;
        
        function tryLoadImage(index) {
            const imagePath = `./images/${folderName}/${index}.jpg`;
            const img = new Image();
            
            return new Promise((resolve) => {
                img.onload = function() {
                    // 图片加载成功
                    imageCount++;
                    
                    // 创建轮播图片元素
                    let carouselImg = document.createElement('img');
                    carouselImg.src = imagePath;
                    carouselImg.alt = `Image ${index}`;
                    carouselImg.style.opacity = 0;
                    carouselImg.style.position = 'absolute';
                    carouselImg.style.top = '0';
                    carouselImg.style.left = '0';
                    carouselImg.style.width = '100%';
                    carouselImg.style.height = '100%';
                    carouselImg.style.objectFit = 'contain';
                    carouselImg.style.transition = 'opacity 0.8s ease-in-out';
                    
                    container.appendChild(carouselImg);
                    
                    // 继续尝试加载下一张
                    resolve(true);
                };
                
                img.onerror = function() {
                    // 图片加载失败，停止加载
                    resolve(false);
                };
                
                img.src = imagePath;
            });
        }
        
        // 递归加载图片
        async function loadNextImage(index) {
            const success = await tryLoadImage(index);
            if (success) {
                await loadNextImage(index + 1);
            } else {
                // 所有图片加载完成，开始轮播
                if (imageCount > 0) {
                    startSlideshow();
                } else {
                    console.log(`在文件夹 ${folderName} 中未找到图片`);
                }
            }
        }
        
        loadNextImage(1);
    }
    
    // 开始轮播
    function startSlideshow() {
        const images = container.getElementsByTagName('img');
        let currentIndex = 0;
        
        function showImage(index) {
            // 隐藏所有图片
            for (let i = 0; i < images.length; i++) {
                images[i].style.opacity = 0;
            }
            
            // 显示当前图片
            if (images[index]) {
                images[index].style.opacity = 1;
            }
        }
        
        function autoSlide() {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        }
        
        // 显示第一张图片并开始轮播
        showImage(currentIndex);
        setInterval(autoSlide, 2000);
    }
    
    // 开始加载图片
    loadImages();
});