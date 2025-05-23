// 全局变量
let currentUser = {
    id: 1,
    name: "赛博用户",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
};

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    addEventListeners();
    createCyberEffects();
});

// 初始化应用
function initializeApp() {
    console.log('🚀 CyberRead App 启动');
    
    // 创建赛博朋克粒子效果
    createParticleBackground();
    
    // 初始化过滤标签
    initializeFilters();
    
    // 模拟加载动画
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
}

// 添加事件监听器
function addEventListeners() {
    // 过滤标签点击事件
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', handleFilterClick);
    });
    
    // 排序选择事件
    const sortSelect = document.querySelector('.cyber-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortChange);
    }
    
    // 加载更多按钮
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreArticles);
    }
    
    // 导航按钮事件
    document.querySelectorAll('.nav-btn, .footer-btn').forEach(btn => {
        btn.addEventListener('click', handleNavigation);
    });
    
    // 评论展开事件
    document.querySelectorAll('.comments-header').forEach(header => {
        header.addEventListener('click', function(e) {
            e.stopPropagation();
            const commentsSection = this.parentElement;
            toggleComments(e, commentsSection);
        });
    });
}

// 点赞功能
function toggleLike(event, button) {
    event.stopPropagation();
    
    const icon = button.querySelector('i');
    const countSpan = button.querySelector('span');
    let count = parseInt(countSpan.textContent);
    
    if (button.classList.contains('liked')) {
        // 取消点赞
        button.classList.remove('liked');
        icon.className = 'far fa-heart';
        count--;
        
        // 添加取消点赞动画
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    } else {
        // 点赞
        button.classList.add('liked');
        icon.className = 'fas fa-heart';
        count++;
        
        // 添加点赞动画和特效
        button.style.transform = 'scale(1.2)';
        createHeartParticles(button);
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
    
    countSpan.textContent = count;
    
    // 触感反馈（如果支持）
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// 点踩功能
function toggleDislike(event, button) {
    event.stopPropagation();
    
    const icon = button.querySelector('i');
    const countSpan = button.querySelector('span');
    let count = parseInt(countSpan.textContent);
    
    if (button.classList.contains('disliked')) {
        button.classList.remove('disliked');
        icon.className = 'far fa-thumbs-down';
        count--;
    } else {
        button.classList.add('disliked');
        icon.className = 'fas fa-thumbs-down';
        count++;
        
        // 添加点踩动画
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
    
    countSpan.textContent = count;
}

// 评论展开/收起
function toggleComments(event, commentsSection) {
    if (!commentsSection) {
        commentsSection = event.target.closest('.comments-section');
    }
    
    const commentsList = commentsSection.querySelector('.comments-list');
    const toggleIcon = commentsSection.querySelector('.comments-toggle i');
    
    if (commentsSection.classList.contains('collapsed')) {
        // 展开评论
        commentsSection.classList.remove('collapsed');
        commentsList.style.display = 'block';
        toggleIcon.style.transform = 'rotate(180deg)';
        
        // 添加展开动画
        commentsList.style.opacity = '0';
        commentsList.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            commentsList.style.transition = 'all 0.3s ease';
            commentsList.style.opacity = '1';
            commentsList.style.transform = 'translateY(0)';
        }, 10);
    } else {
        // 收起评论
        commentsSection.classList.add('collapsed');
        commentsList.style.display = 'none';
        toggleIcon.style.transform = 'rotate(0deg)';
    }
}

// 文章打开功能
function openArticle(articleId) {
    console.log(`📖 打开文章 ID: ${articleId}`);
    
    // 添加点击动画
    const clickedCard = event.currentTarget;
    clickedCard.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
        // 这里可以跳转到文章页面
        window.location.href = `article.html?id=${articleId}`;
    }, 150);
    
    setTimeout(() => {
        clickedCard.style.transform = '';
    }, 300);
}

// 过滤功能
function handleFilterClick(event) {
    const clickedTag = event.target;
    
    // 移除其他标签的active状态
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.classList.remove('active');
    });
    
    // 添加当前标签的active状态
    clickedTag.classList.add('active');
    
    // 模拟过滤效果
    const filterValue = clickedTag.textContent.trim();
    filterArticles(filterValue);
    
    // 添加点击动画
    clickedTag.style.transform = 'scale(1.1)';
    setTimeout(() => {
        clickedTag.style.transform = 'scale(1)';
    }, 150);
}

// 文章过滤
function filterArticles(category) {
    const articles = document.querySelectorAll('.article-card');
    
    articles.forEach(article => {
        const articleTag = article.querySelector('.card-tag');
        const articleCategory = articleTag ? articleTag.textContent.trim() : '';
        
        if (category === '全部' || articleCategory === category) {
            article.style.display = 'block';
            article.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            article.style.display = 'none';
        }
    });
}

// 排序功能
function handleSortChange(event) {
    const sortValue = event.target.value;
    console.log(`🔄 排序方式: ${sortValue}`);
    
    // 这里可以实现实际的排序逻辑
    const articlesGrid = document.querySelector('.articles-grid');
    const articles = Array.from(articlesGrid.querySelectorAll('.article-card'));
    
    // 添加加载动画
    articlesGrid.style.opacity = '0.5';
    
    setTimeout(() => {
        // 模拟排序（这里只是重新排列DOM元素作为示例）
        articles.forEach(article => article.remove());
        
        if (sortValue === '最多点赞') {
            articles.sort((a, b) => {
                const likesA = parseInt(a.querySelector('.like-btn span').textContent);
                const likesB = parseInt(b.querySelector('.like-btn span').textContent);
                return likesB - likesA;
            });
        }
        
        articles.forEach(article => articlesGrid.appendChild(article));
        articlesGrid.style.opacity = '1';
    }, 500);
}

// 加载更多文章
function loadMoreArticles() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const originalText = loadMoreBtn.innerHTML;
    
    // 显示加载状态
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>加载中...</span>';
    loadMoreBtn.disabled = true;
    
    // 模拟网络请求
    setTimeout(() => {
        // 这里可以添加新的文章卡片
        console.log('📦 加载更多文章');
        
        // 恢复按钮状态
        loadMoreBtn.innerHTML = originalText;
        loadMoreBtn.disabled = false;
        
        // 显示成功提示
        showNotification('已加载更多文章', 'success');
    }, 2000);
}

// 导航功能
function handleNavigation(event) {
    const button = event.currentTarget;
    const buttonText = button.querySelector('span').textContent;
    
    // 移除其他按钮的active状态
    document.querySelectorAll('.nav-btn, .footer-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 添加当前按钮的active状态
    button.classList.add('active');
    
    // 添加点击动画
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
    
    console.log(`🧭 导航到: ${buttonText}`);
    showNotification(`导航到${buttonText}`, 'info');
}

// 创建心形粒子效果
function createHeartParticles(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = '💙';
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.fontSize = '12px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.transition = 'all 0.8s ease-out';
        
        document.body.appendChild(particle);
        
        // 动画
        setTimeout(() => {
            const angle = (i / 6) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
            particle.style.opacity = '0';
            particle.style.fontSize = '8px';
        }, 50);
        
        // 清理
        setTimeout(() => {
            particle.remove();
        }, 900);
    }
}

// 创建粒子背景
function createParticleBackground() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.3';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: `hsl(${180 + Math.random() * 60}, 100%, 70%)`
        };
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }
    
    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
        });
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // 添加发光效果
            ctx.shadowBlur = 10;
            ctx.shadowColor = particle.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    }
    
    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    initParticles();
    animate();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// 创建赛博朋克效果
function createCyberEffects() {
    // 随机闪烁效果
    setInterval(() => {
        const elements = document.querySelectorAll('.logo-icon, .notification-badge');
        elements.forEach(el => {
            if (Math.random() > 0.7) {
                el.style.animation = 'none';
                setTimeout(() => {
                    el.style.animation = 'pulse-glow 2s ease-in-out infinite alternate';
                }, 100);
            }
        });
    }, 3000);
    
    // 扫描线效果
    createScanlines();
}

// 创建扫描线效果
function createScanlines() {
    const scanline = document.createElement('div');
    scanline.style.position = 'fixed';
    scanline.style.top = '0';
    scanline.style.left = '0';
    scanline.style.width = '100%';
    scanline.style.height = '2px';
    scanline.style.background = 'linear-gradient(90deg, transparent, #00ffff, transparent)';
    scanline.style.pointerEvents = 'none';
    scanline.style.zIndex = '9998';
    scanline.style.opacity = '0.5';
    
    document.body.appendChild(scanline);
    
    function animateScanline() {
        scanline.style.transform = 'translateY(-2px)';
        scanline.style.transition = 'none';
        
        setTimeout(() => {
            scanline.style.transition = 'transform 3s linear';
            scanline.style.transform = `translateY(${window.innerHeight + 2}px)`;
        }, 100);
        
        setTimeout(() => {
            animateScanline();
        }, 3100);
    }
    
    setTimeout(() => {
        animateScanline();
    }, Math.random() * 5000);
}

// 通知系统
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `cyber-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, rgba(0, 255, 255, 0.1), rgba(255, 0, 170, 0.1));
        border: 1px solid var(--cyber-blue);
        border-radius: 8px;
        padding: 12px 16px;
        color: var(--cyber-blue);
        font-family: var(--font-primary);
        font-size: 12px;
        z-index: 10000;
        backdrop-filter: blur(10px);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动消失
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 初始化过滤器
function initializeFilters() {
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.5)';
        });
        
        tag.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.boxShadow = '';
            }
        });
    });
}

// CSS 动画关键帧（通过JavaScript注入）
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .cyber-notification.success {
        border-color: var(--cyber-green);
        color: var(--cyber-green);
        box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
    }
    
    .cyber-notification.error {
        border-color: var(--cyber-pink);
        color: var(--cyber-pink);
        box-shadow: 0 0 20px rgba(255, 0, 170, 0.3);
    }
    
    body.loaded .article-card {
        animation: fadeInUp 0.6s ease forwards;
    }
`;
document.head.appendChild(style);

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // ESC 关闭所有展开的评论
    if (e.key === 'Escape') {
        document.querySelectorAll('.comments-section:not(.collapsed)').forEach(section => {
            section.classList.add('collapsed');
            section.querySelector('.comments-list').style.display = 'none';
            section.querySelector('.comments-toggle i').style.transform = 'rotate(0deg)';
        });
    }
    
    // 空格键滚动到下一篇文章
    if (e.key === ' ' && !e.target.matches('input, textarea, select')) {
        e.preventDefault();
        const articles = document.querySelectorAll('.article-card');
        const scrollTop = window.pageYOffset;
        
        for (let article of articles) {
            const rect = article.getBoundingClientRect();
            if (rect.top > 100) {
                article.scrollIntoView({ behavior: 'smooth', block: 'start' });
                break;
            }
        }
    }
});

console.log('🎮 CyberRead 脚本加载完成'); 