// gallery-loader.js
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;
    
    // 根据当前页面文件名确定文件夹名称
    function getPageName() {
        const path = window.location.pathname;
        const page = path.split("/").pop();
        return page.replace('.html', '').replace('.htm', '');
    }
    
    const folderName = getPageName();
    const imageFormats = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    let loadedCount = 0;
    
    function loadGalleryImages() {
        let formatIndex = 0;
        let imageIndex = 1;
        
        function tryLoadGalleryImage(index, format) {
            const imagePath = `./images/${folderName}/${index}${format}`;
            const img = new Image();
            
            img.onload = function() {
                // 图片加载成功，添加到画廊
                let imgElement = document.createElement('img');
                imgElement.src = imagePath;
                imgElement.alt = 'Gallery Image';
                gallery.appendChild(imgElement);
                loadedCount++;
                
                // 继续加载下一张同格式图片
                tryLoadGalleryImage(index + 1, format);
            };
            
            img.onerror = function() {
                // 当前格式加载失败，尝试下一个格式
                if (formatIndex < imageFormats.length - 1) {
                    formatIndex++;
                    tryLoadGalleryImage(1, imageFormats[formatIndex]);
                } else {
                    // 所有格式都尝试过了，停止加载
                    console.log(`在文件夹 ${folderName} 中共加载了 ${loadedCount} 张画廊图片`);
                }
            };
            
            img.src = imagePath;
        }
        
        // 从第一种格式开始加载
        tryLoadGalleryImage(1, imageFormats[formatIndex]);
    }
    
    loadGalleryImages();
});