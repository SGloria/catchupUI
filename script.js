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
    
    // 初始化收藏状态
    initializeBookmarks();
    
    // 初始化已读状态
    initializeReadStatus();
    
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
    
    // 导航按钮事件
    document.querySelectorAll('.nav-btn, .footer-btn').forEach(btn => {
        btn.addEventListener('click', handleNavigation);
    });
    
    // 评论区域点击事件
    document.querySelectorAll('.comments-section').forEach(commentsSection => {
        // 为评论区域添加点击事件，阻止冒泡
        commentsSection.addEventListener('click', function(event) {
            event.stopPropagation();
            toggleComments(this);
        });
    });
    
    // 为card-actions区域添加点击事件，阻止冒泡
    document.querySelectorAll('.card-actions').forEach(cardActions => {
        cardActions.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });
}

// 切换评论区域显示状态
function toggleComments(commentsSection) {
    const commentsList = commentsSection.querySelector('.comments-list');
    const toggleIcon = commentsSection.querySelector('.comments-toggle i');
    const isCollapsed = commentsSection.classList.contains('collapsed');
    
    if (isCollapsed) {
        // 展开评论
        commentsSection.classList.remove('collapsed');
        toggleIcon.style.transform = 'rotate(180deg)';
        
        // 添加展开动画
        commentsList.style.maxHeight = '0';
        commentsList.style.opacity = '0';
        commentsList.style.overflow = 'hidden';
        commentsList.style.transition = 'all 0.3s ease';
        
        // 强制重绘
        commentsList.offsetHeight;
        
        // 计算实际高度
        commentsList.style.maxHeight = commentsList.scrollHeight + 'px';
        commentsList.style.opacity = '1';
        
        // 动画完成后移除maxHeight限制
        setTimeout(() => {
            commentsList.style.maxHeight = 'none';
        }, 300);
        
    } else {
        // 收起评论
        commentsList.style.transition = 'all 0.3s ease';
        commentsList.style.maxHeight = commentsList.scrollHeight + 'px';
        commentsList.style.overflow = 'hidden';
        
        // 强制重绘
        commentsList.offsetHeight;
        
        commentsList.style.maxHeight = '0';
        commentsList.style.opacity = '0';
        
        setTimeout(() => {
            commentsSection.classList.add('collapsed');
            toggleIcon.style.transform = 'rotate(0deg)';
        }, 300);
    }
    
    // 添加反馈动画
    const commentsHeader = commentsSection.querySelector('.comments-header');
    commentsHeader.style.transform = 'scale(0.98)';
    setTimeout(() => {
        commentsHeader.style.transform = 'scale(1)';
    }, 150);
    
    // 触感反馈（如果支持）
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

// 收藏文章功能
let bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarkedArticles')) || [];

function toggleBookmark(event, button) {
    event.stopPropagation();
    
    const articleId = button.getAttribute('data-article-id');
    const icon = button.querySelector('i');
    const isBookmarked = button.classList.contains('bookmarked');
    
    if (isBookmarked) {
        // 取消收藏
        button.classList.remove('bookmarked');
        icon.className = 'far fa-bookmark';
        
        // 从收藏列表中移除
        bookmarkedArticles = bookmarkedArticles.filter(id => id !== articleId);
        
        // 创建取消收藏动画
        createBookmarkParticles(button, '💔');
        
        showNotification('已取消收藏', 'info');
        
    } else {
        // 添加收藏
        button.classList.add('bookmarked');
        icon.className = 'fas fa-bookmark';
        
        // 添加到收藏列表
        if (!bookmarkedArticles.includes(articleId)) {
            bookmarkedArticles.push(articleId);
        }
        
        // 创建收藏动画
        createBookmarkParticles(button, '❤️');
        
        showNotification('已添加到收藏', 'success');
    }
    
    // 保存到本地存储
    localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarkedArticles));
    
    // 添加按钮动画
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
    
    // 触感反馈
    if (navigator.vibrate) {
        navigator.vibrate(isBookmarked ? 30 : 50);
    }
    
    // 更新收藏页面（如果存在）
    updateBookmarkPage();
}

// 创建收藏粒子特效
function createBookmarkParticles(button, emoji) {
    const rect = button.getBoundingClientRect();
    const particleCount = 3;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = emoji;
        particle.style.position = 'fixed';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        particle.style.fontSize = '14px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.transition = 'all 1.2s ease-out';
        
        document.body.appendChild(particle);
        
        // 随机方向和距离
        const angle = (i / particleCount) * 2 * Math.PI + Math.random() * 0.5;
        const distance = 30 + Math.random() * 15;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance - 20; // 向上偏移
        
        setTimeout(() => {
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = '0';
        }, 10);
        
        // 清理粒子
        setTimeout(() => {
            if (document.body.contains(particle)) {
                document.body.removeChild(particle);
            }
        }, 1200);
    }
}

// 初始化收藏状态
function initializeBookmarks() {
    document.querySelectorAll('.bookmark-btn').forEach(button => {
        const articleId = button.getAttribute('data-article-id');
        if (bookmarkedArticles.includes(articleId)) {
            button.classList.add('bookmarked');
            button.querySelector('i').className = 'fas fa-bookmark';
        }
    });
}

// 获取收藏的文章列表
function getBookmarkedArticles() {
    return bookmarkedArticles.map(id => {
        const articleCard = document.querySelector(`[data-article-id="${id}"]`).closest('.article-card');
        if (articleCard) {
            return {
                id: id,
                title: articleCard.querySelector('.card-title').textContent,
                summary: articleCard.querySelector('.card-summary').textContent,
                author: articleCard.querySelector('.author-name').textContent,
                time: articleCard.querySelector('.publish-time').textContent,
                tag: articleCard.querySelector('.card-tag').textContent,
                image: articleCard.querySelector('.card-thumbnail img').src
            };
        }
        return null;
    }).filter(article => article !== null);
}

// 更新收藏页面
function updateBookmarkPage() {
    // 这里可以实现收藏页面的更新逻辑
    // 例如：如果当前在收藏页面，重新渲染收藏列表
    console.log('📚 收藏列表已更新:', getBookmarkedArticles());
}

// 已读状态功能
let readArticles = JSON.parse(localStorage.getItem('readArticles')) || [];

function toggleReadStatus(event, button) {
    event.stopPropagation();
    
    const articleId = button.getAttribute('data-article-id');
    const icon = button.querySelector('i');
    const isRead = button.classList.contains('read');
    
    if (isRead) {
        // 标记为未读
        button.classList.remove('read');
        icon.className = 'far fa-circle';
        
        // 从已读列表中移除
        readArticles = readArticles.filter(id => id !== articleId);
        
        // 创建未读动画
        createReadStatusParticles(button, '📖');
        
        showNotification('已标记为未读', 'info');
        
    } else {
        // 标记为已读
        button.classList.add('read');
        icon.className = 'fas fa-check-circle';
        
        // 添加到已读列表
        if (!readArticles.includes(articleId)) {
            readArticles.push(articleId);
        }
        
        // 创建已读动画
        createReadStatusParticles(button, '✅');
        
        showNotification('已标记为已读', 'success');
    }
    
    // 保存到本地存储
    localStorage.setItem('readArticles', JSON.stringify(readArticles));
    
    // 添加按钮动画
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
    
    // 触感反馈
    if (navigator.vibrate) {
        navigator.vibrate(isRead ? 30 : 50);
    }
    
    // 更新视觉状态
    updateArticleReadState(articleId, !isRead);
}

// 创建已读状态粒子特效
function createReadStatusParticles(button, emoji) {
    const rect = button.getBoundingClientRect();
    const particleCount = 3;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = emoji;
        particle.style.position = 'fixed';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        particle.style.fontSize = '14px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.transition = 'all 1.2s ease-out';
        
        document.body.appendChild(particle);
        
        // 随机方向和距离
        const angle = (i / particleCount) * 2 * Math.PI + Math.random() * 0.5;
        const distance = 30 + Math.random() * 15;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance - 20; // 向上偏移
        
        setTimeout(() => {
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = '0';
        }, 10);
        
        // 清理粒子
        setTimeout(() => {
            if (document.body.contains(particle)) {
                document.body.removeChild(particle);
            }
        }, 1200);
    }
}

// 更新文章的已读视觉状态
function updateArticleReadState(articleId, isRead) {
    const articleCard = document.querySelector(`[data-article-id="${articleId}"]`).closest('.article-card');
    if (articleCard) {
        if (isRead) {
            articleCard.style.opacity = '0.7';
            articleCard.querySelector('.card-title').style.color = 'var(--text-secondary)';
        } else {
            articleCard.style.opacity = '1';
            articleCard.querySelector('.card-title').style.color = 'var(--text-primary)';
        }
    }
}

// 初始化已读状态
function initializeReadStatus() {
    document.querySelectorAll('.read-status-btn').forEach(button => {
        const articleId = button.getAttribute('data-article-id');
        if (readArticles.includes(articleId)) {
            button.classList.add('read');
            button.querySelector('i').className = 'fas fa-check-circle';
            updateArticleReadState(articleId, true);
        }
    });
}

// 获取已读文章列表
function getReadArticles() {
    return readArticles.map(id => {
        const articleCard = document.querySelector(`[data-article-id="${id}"]`).closest('.article-card');
        if (articleCard) {
            return {
                id: id,
                title: articleCard.querySelector('.card-title').textContent,
                summary: articleCard.querySelector('.card-summary').textContent,
                author: articleCard.querySelector('.author-name').textContent,
                time: articleCard.querySelector('.publish-time').textContent,
                tag: articleCard.querySelector('.card-tag').textContent,
                image: articleCard.querySelector('.card-thumbnail img').src
            };
        }
        return null;
    }).filter(article => article !== null);
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
    
    // 处理收藏页面
    if (buttonText === '收藏') {
        showBookmarkedArticles();
    } else if (buttonText === '团队') {
        showAllArticles();
    }
    
    console.log(`🧭 导航到: ${buttonText}`);
}

// 显示收藏的文章
function showBookmarkedArticles() {
    const articlesGrid = document.querySelector('.articles-grid');
    const allCards = articlesGrid.querySelectorAll('.article-card');
    
    allCards.forEach(card => {
        const bookmarkBtn = card.querySelector('.bookmark-btn');
        const articleId = bookmarkBtn.getAttribute('data-article-id');
        
        if (bookmarkedArticles.includes(articleId)) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
    
    // 显示收藏统计
    const bookmarkedCount = bookmarkedArticles.length;
    if (bookmarkedCount === 0) {
        showNotification('还没有收藏任何文章', 'info');
    }
}

// 显示所有文章
function showAllArticles() {
    const articlesGrid = document.querySelector('.articles-grid');
    const allCards = articlesGrid.querySelectorAll('.article-card');
    
    allCards.forEach(card => {
        card.style.display = 'block';
        card.style.animation = 'fadeInUp 0.5s ease forwards';
    });
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
        left: 20px;
        background: linear-gradient(45deg, rgba(37, 188, 255, 0.1), rgba(146, 35, 255, 0.1));
        border: none;
        border-radius: 8px;
        padding: 12px 16px;
        color: #ffffff;
        font-family: var(--font-primary);
        font-size: 12px;
        z-index: 10000;
        backdrop-filter: blur(10px);
        transform: translateX(-100%);
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
        notification.style.transform = 'translateX(-100%)';
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
        border: none;
        color: #25BCFF;
        box-shadow: 0 0 20px rgba(37, 188, 255, 0.3);
    }
    
    .cyber-notification.error {
        border: none;
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