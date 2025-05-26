// 当前用户配置
const currentUser = {
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=24&h=24&fit=crop&crop=face',
    name: '当前用户'
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
}

// 反应功能（互斥操作）
function toggleReaction(event, button, reactionType) {
    event.stopPropagation();
    
    const articleCard = button.closest('.article-card');
    const actionRow = button.closest('.action-row');
    const allButtons = actionRow.querySelectorAll('.stat-btn');
    const currentButton = button;
    const icon = button.querySelector('i');
    const countSpan = button.querySelector('span');
    const actionGroup = button.closest('.action-group');
    const avatarsContainer = actionGroup.querySelector('.user-avatars');
    const moreCount = avatarsContainer.querySelector('.more-count');
    
    // 获取当前状态
    const isCurrentlyActive = button.classList.contains(reactionType === 'like' ? 'liked' : 
                                                        reactionType === 'neutral' ? 'neutral' : 'disliked');
    
    // 清除所有其他按钮的活动状态
    allButtons.forEach(btn => {
        const btnGroup = btn.closest('.action-group');
        const btnIcon = btn.querySelector('i');
        const btnCount = btn.querySelector('span');
        const btnAvatars = btnGroup.querySelector('.user-avatars');
        const btnMoreCount = btnAvatars.querySelector('.more-count');
        
        // 移除用户头像（如果存在）
        const userAvatar = btnAvatars.querySelector('.mini-avatar[alt="当前用户"]');
        if (userAvatar) {
            userAvatar.remove();
            
            // 更新计数
            let count = parseInt(btnCount.textContent);
            count--;
            btnCount.textContent = count;
            
            // 更新更多计数
            if (btnMoreCount) {
                let moreCountNum = parseInt(btnMoreCount.textContent.replace('+', ''));
                moreCountNum--;
                if (moreCountNum > 0) {
                    btnMoreCount.textContent = `+${moreCountNum}`;
                } else {
                    btnMoreCount.textContent = '';
                }
            }
        }
        
        // 移除活动状态
        btn.classList.remove('liked', 'neutral', 'disliked');
        
        // 重置图标
        if (btn.classList.contains('like-btn')) {
            btnIcon.className = 'far fa-thumbs-up';
        } else if (btn.classList.contains('neutral-btn')) {
            btnIcon.className = 'far fa-meh';
        } else if (btn.classList.contains('dislike-btn')) {
            btnIcon.className = 'far fa-thumbs-down';
        }
    });
    
    // 如果点击的不是当前活动的按钮，则激活它
    if (!isCurrentlyActive) {
        let count = parseInt(countSpan.textContent);
        count++;
        countSpan.textContent = count;
        
        // 添加活动状态
        if (reactionType === 'like') {
            button.classList.add('liked');
            icon.className = 'fas fa-thumbs-up';
            createReactionParticles(button, '👍');
        } else if (reactionType === 'neutral') {
            button.classList.add('neutral');
            icon.className = 'fas fa-meh';
            createReactionParticles(button, '😐');
        } else if (reactionType === 'dislike') {
            button.classList.add('disliked');
            icon.className = 'fas fa-thumbs-down';
            createReactionParticles(button, '👎');
        }
        
        // 添加当前用户的头像
        const newAvatar = document.createElement('img');
        newAvatar.src = currentUser.avatar;
        newAvatar.alt = '当前用户';
        newAvatar.className = 'mini-avatar';
        avatarsContainer.insertBefore(newAvatar, avatarsContainer.firstChild);
        
        // 更新更多计数
        if (moreCount) {
            let moreCountNum = parseInt(moreCount.textContent.replace('+', '')) || 0;
            moreCountNum++;
            moreCount.textContent = `+${moreCountNum}`;
        }
        
        // 添加动画效果
        button.style.transform = 'scale(1.2)';
        
        // 头像入场动画
        newAvatar.style.transform = 'scale(0)';
        newAvatar.style.opacity = '0';
        setTimeout(() => {
            newAvatar.style.transition = 'all 0.3s ease';
            newAvatar.style.transform = 'scale(1)';
            newAvatar.style.opacity = '1';
        }, 50);
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    } else {
        // 如果点击的是当前活动的按钮，只是添加一个小的动画反馈
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
    
    // 触感反馈（如果支持）
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// 创建反应粒子特效
function createReactionParticles(button, emoji) {
    const rect = button.getBoundingClientRect();
    const particleCount = 5;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = emoji;
        particle.style.position = 'fixed';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        particle.style.fontSize = '16px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.transition = 'all 1s ease-out';
        
        document.body.appendChild(particle);
        
        // 随机方向和距离
        const angle = (i / particleCount) * 2 * Math.PI;
        const distance = 40 + Math.random() * 20;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        setTimeout(() => {
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = '0';
        }, 10);
        
        // 清理粒子
        setTimeout(() => {
            if (document.body.contains(particle)) {
                document.body.removeChild(particle);
            }
        }, 1000);
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
        const colors = [
            '#25BCFF', '#1781E8', '#9223FF', '#E62DE8', '#FF0DC0'
        ];
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: colors[Math.floor(Math.random() * colors.length)]
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
                    el.style.animation = 'pulse-glow 3s ease-in-out infinite alternate';
                }, 100);
            }
        });
    }, 3000);
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
        background: linear-gradient(45deg, rgba(37, 188, 255, 0.1), rgba(146, 35, 255, 0.1));
        border: 1px solid #25BCFF;
        border-radius: 8px;
        padding: 12px 16px;
        color: #ffffff;
        font-family: var(--font-primary);
        font-size: 12px;
        z-index: 10000;
        backdrop-filter: blur(10px);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 0 20px rgba(37, 188, 255, 0.3);
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
        border-color: #25BCFF;
        color: #25BCFF;
        box-shadow: 0 0 20px rgba(37, 188, 255, 0.3);
    }
    
    .cyber-notification.error {
        border-color: #FF0DC0;
        color: #FF0DC0;
        box-shadow: 0 0 20px rgba(255, 13, 192, 0.3);
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