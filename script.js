// 当前用户配置
const currentUser = {
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=24&h=24&fit=crop&crop=face',
    name: '当前用户'
};

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    addEventListeners();
    // createCyberEffects(); // 注释掉闪烁动画效果
});

// 初始化应用
function initializeApp() {
    console.log('🚀 CyberRead App 启动');
    
    // 创建赛博朋克粒子效果
    // createParticleBackground(); // 注释掉悬浮颗粒动画
    
    // 初始化过滤标签
    initializeFilters();
    
    // 初始化收藏状态
    initializeBookmarks();
    
    // 初始化已读状态
    initializeReadStatus();
    
    // 初始化侧边栏
    initializeSidebar();
    
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

// 侧边栏控制功能
let currentSidebar = null;

function toggleSidebar(type) {
    const overlay = document.querySelector('.sidebar-overlay');
    const allSidebars = document.querySelectorAll('.sidebar');
    const targetSidebar = document.getElementById(`${type}Sidebar`);
    
    // 如果点击的是当前打开的侧边栏，则关闭
    if (currentSidebar === type) {
        closeSidebar();
        return;
    }
    
    // 关闭所有侧边栏
    allSidebars.forEach(sidebar => {
        sidebar.classList.remove('active');
    });
    
    // 显示遮罩层
    overlay.classList.add('active');
    
    // 显示目标侧边栏
    setTimeout(() => {
        targetSidebar.classList.add('active');
    }, 50);
    
    currentSidebar = type;
    
    // 阻止body滚动
    document.body.style.overflow = 'hidden';
    
    // 添加ESC键关闭
    document.addEventListener('keydown', handleEscapeKey);
}

function closeSidebar() {
    const overlay = document.querySelector('.sidebar-overlay');
    const allSidebars = document.querySelectorAll('.sidebar');
    
    // 隐藏所有侧边栏
    allSidebars.forEach(sidebar => {
        sidebar.classList.remove('active');
    });
    
    // 隐藏遮罩层
    setTimeout(() => {
        overlay.classList.remove('active');
    }, 200);
    
    currentSidebar = null;
    
    // 恢复body滚动
    document.body.style.overflow = '';
    
    // 移除ESC键监听
    document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        closeSidebar();
    }
}

// 搜索功能
function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        // 添加到搜索历史
        addToSearchHistory(searchTerm);
        
        // 执行搜索
        console.log('🔍 搜索:', searchTerm);
        showNotification(`搜索: ${searchTerm}`, 'info');
        
        // 清空搜索框
        searchInput.value = '';
        
        // 关闭侧边栏
        closeSidebar();
    }
}

function addToSearchHistory(term) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
    // 移除重复项
    searchHistory = searchHistory.filter(item => item !== term);
    
    // 添加到开头
    searchHistory.unshift(term);
    
    // 限制历史记录数量
    if (searchHistory.length > 10) {
        searchHistory = searchHistory.slice(0, 10);
    }
    
    // 保存到本地存储
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    
    // 更新显示
    updateSearchHistoryDisplay();
}

function updateSearchHistoryDisplay() {
    const historyList = document.querySelector('.search-history-list');
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
    historyList.innerHTML = '';
    
    searchHistory.forEach(term => {
        const historyItem = document.createElement('div');
        historyItem.className = 'search-history-item';
        historyItem.innerHTML = `
            <i class="fas fa-clock"></i>
            <span>${term}</span>
            <button class="remove-history-btn" onclick="removeFromSearchHistory('${term}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        historyItem.addEventListener('click', () => {
            document.querySelector('.search-input').value = term;
        });
        historyList.appendChild(historyItem);
    });
}

function removeFromSearchHistory(term) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory = searchHistory.filter(item => item !== term);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    updateSearchHistoryDisplay();
}

function clearSearchHistory() {
    localStorage.removeItem('searchHistory');
    updateSearchHistoryDisplay();
    showNotification('搜索历史已清除', 'info');
}

// 过滤功能
function applyFilters() {
    const timeFilter = document.querySelector('input[name="timeFilter"]:checked').value;
    const readFilter = document.querySelector('input[name="readFilter"]:checked').value;
    const sourceFilter = document.querySelector('.source-select').value;
    
    console.log('🔧 应用过滤:', { timeFilter, readFilter, sourceFilter });
    
    // 这里可以实现实际的过滤逻辑
    filterArticlesByConditions(timeFilter, readFilter, sourceFilter);
    
    showNotification('过滤条件已应用', 'success');
    closeSidebar();
}

function filterArticlesByConditions(timeFilter, readFilter, sourceFilter) {
    const articles = document.querySelectorAll('.article-card');
    
    articles.forEach(article => {
        let shouldShow = true;
        
        // 已读状态过滤
        if (readFilter !== 'all') {
            const articleId = article.querySelector('.read-status-btn').getAttribute('data-article-id');
            const isRead = readArticles.includes(articleId);
            
            if (readFilter === 'read' && !isRead) shouldShow = false;
            if (readFilter === 'unread' && isRead) shouldShow = false;
        }
        
        // 分享来源过滤
        if (sourceFilter !== 'all') {
            const authorName = article.querySelector('.author-name').textContent;
            if (authorName !== sourceFilter) shouldShow = false;
        }
        
        // 时间过滤（这里简化处理，实际应用中需要解析时间）
        // timeFilter 逻辑可以根据需要实现
        
        article.style.display = shouldShow ? 'block' : 'none';
    });
}

function resetFilters() {
    // 重置所有过滤选项
    document.querySelector('input[name="timeFilter"][value="all"]').checked = true;
    document.querySelector('input[name="readFilter"][value="all"]').checked = true;
    document.querySelector('.source-select').value = 'all';
    
    // 显示所有文章
    showAllArticles();
    
    showNotification('过滤条件已重置', 'info');
}

// 消息功能
function markMessageAsRead(messageElement) {
    messageElement.classList.remove('unread');
    
    // 更新通知徽章
    const badge = document.querySelector('.notification-badge');
    let count = parseInt(badge.textContent);
    if (count > 0) {
        count--;
        badge.textContent = count;
        if (count === 0) {
            badge.style.display = 'none';
        }
    }
}

// 初始化侧边栏相关事件
function initializeSidebar() {
    // 搜索框回车事件
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // 搜索按钮点击事件
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    // 清除历史按钮
    const clearHistoryBtn = document.querySelector('.clear-history-btn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearSearchHistory);
    }
    
    // 应用过滤按钮
    const applyFilterBtn = document.querySelector('.apply-filter-btn');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyFilters);
    }
    
    // 重置过滤按钮
    const resetFilterBtn = document.querySelector('.reset-filter-btn');
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', resetFilters);
    }
    
    // 消息点击事件
    document.querySelectorAll('.message-item').forEach(messageItem => {
        messageItem.addEventListener('click', function() {
            markMessageAsRead(this);
        });
    });
    
    // 初始化搜索历史显示
    updateSearchHistoryDisplay();
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
    
    // 页面切换逻辑
    const articlesGrid = document.querySelector('.articles-grid');
    const userProfilePage = document.querySelector('.user-profile-page');
    
    if (buttonText === '我的') {
        // 显示用户详情页面
        showUserProfilePage();
    } else if (buttonText === '收藏') {
        // 显示收藏页面
        hideUserProfilePage();
        showBookmarkedArticles();
    } else if (buttonText === '团队') {
        // 显示文章列表
        hideUserProfilePage();
        showAllArticles();
    } else {
        // 其他页面
        hideUserProfilePage();
        showAllArticles();
    }
    
    console.log(`🧭 导航到: ${buttonText}`);
}

// 显示用户详情页面
function showUserProfilePage() {
    const articlesGrid = document.querySelector('.articles-grid');
    const userProfilePage = document.querySelector('.user-profile-page');
    
    // 隐藏文章列表
    articlesGrid.style.display = 'none';
    
    // 显示用户详情页面
    userProfilePage.style.display = 'block';
    
    // 添加淡入动画
    setTimeout(() => {
        userProfilePage.classList.add('active');
    }, 50);
    
    // 初始化图表
    setTimeout(() => {
        initializeReadingChart();
        animateStatsNumbers();
    }, 300);
}

// 隐藏用户详情页面
function hideUserProfilePage() {
    const articlesGrid = document.querySelector('.articles-grid');
    const userProfilePage = document.querySelector('.user-profile-page');
    
    // 隐藏用户详情页面
    userProfilePage.classList.remove('active');
    setTimeout(() => {
        userProfilePage.style.display = 'none';
    }, 300);
    
    // 显示文章列表
    articlesGrid.style.display = 'grid';
}

// 初始化阅读统计图表
function initializeReadingChart() {
    const canvas = document.getElementById('readingChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 模拟7天的阅读数据
    const readingData = [12, 8, 15, 6, 10, 18, 14];
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const maxValue = Math.max(...readingData);
    
    // 设置图表区域
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / readingData.length;
    
    // 设置渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#25BCFF');
    gradient.addColorStop(0.5, '#1781E8');
    gradient.addColorStop(1, '#9223FF');
    
    // 绘制背景网格
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // 水平网格线
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // 绘制柱状图
    readingData.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + index * barWidth + barWidth * 0.2;
        const y = height - padding - barHeight;
        const actualBarWidth = barWidth * 0.6;
        
        // 绘制柱子
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, actualBarWidth, barHeight);
        
        // 绘制数值标签
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText(value.toString(), x + actualBarWidth / 2, y - 5);
        
        // 绘制日期标签
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Orbitron';
        ctx.fillText(days[index], x + actualBarWidth / 2, height - padding + 15);
    });
    
    // 绘制Y轴标签
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '10px Orbitron';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        const value = Math.round((maxValue / 4) * (4 - i));
        const y = padding + (chartHeight / 4) * i + 5;
        ctx.fillText(value.toString(), padding - 10, y);
    }
    
    // 添加动画效果
    animateChart(ctx, readingData, days, maxValue, width, height, padding);
}

// 图表动画
function animateChart(ctx, data, days, maxValue, width, height, padding) {
    let progress = 0;
    const duration = 1500; // 1.5秒
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / duration, 1);
        
        // 使用easeOutCubic缓动函数
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        // 清空画布
        ctx.clearRect(0, 0, width, height);
        
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const barWidth = chartWidth / data.length;
        
        // 重新绘制网格
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // 设置渐变
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#25BCFF');
        gradient.addColorStop(0.5, '#1781E8');
        gradient.addColorStop(1, '#9223FF');
        
        // 绘制动画柱状图
        data.forEach((value, index) => {
            const animatedValue = value * easeProgress;
            const barHeight = (animatedValue / maxValue) * chartHeight;
            const x = padding + index * barWidth + barWidth * 0.2;
            const y = height - padding - barHeight;
            const actualBarWidth = barWidth * 0.6;
            
            // 绘制柱子
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, actualBarWidth, barHeight);
            
            // 绘制数值标签（只在动画结束时显示）
            if (progress > 0.8) {
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px Orbitron';
                ctx.textAlign = 'center';
                ctx.fillText(value.toString(), x + actualBarWidth / 2, y - 5);
            }
            
            // 绘制日期标签
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '10px Orbitron';
            ctx.fillText(days[index], x + actualBarWidth / 2, height - padding + 15);
        });
        
        // 绘制Y轴标签
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px Orbitron';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 4; i++) {
            const value = Math.round((maxValue / 4) * (4 - i));
            const y = padding + (chartHeight / 4) * i + 5;
            ctx.fillText(value.toString(), padding - 10, y);
        }
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// 数字动画
function animateStatsNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(element => {
        const finalValue = element.textContent;
        const numericValue = parseInt(finalValue.replace(/,/g, '')) || 0;
        
        animateNumber(element, 0, numericValue, 2000, finalValue.includes(','));
    });
}

function animateNumber(element, start, end, duration, useCommas = false) {
    const startTime = Date.now();
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用easeOutCubic缓动函数
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(start + (end - start) * easeProgress);
        
        element.textContent = useCommas ? currentValue.toLocaleString() : currentValue.toString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
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
    // 可以在此处添加过滤器的初始化逻辑
    console.log('Filters initialized');
}

// 提交评论功能
function submitComment(event, button) {
    event.stopPropagation();
    
    const articleId = button.getAttribute('data-article-id');
    const inputContainer = button.parentElement;
    const textarea = inputContainer.querySelector('.new-comment-input');
    const commentText = textarea.value.trim();
    
    if (!commentText) {
        showNotification('请输入评论内容', 'error');
        textarea.focus();
        return;
    }
    
    // 禁用按钮防止重复提交
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // 模拟网络请求延迟
    setTimeout(() => {
        // 创建新评论元素
        const newComment = createCommentElement(commentText);
        
        // 找到评论列表并添加新评论
        const commentsList = textarea.closest('.comments-list');
        const newCommentSection = textarea.closest('.new-comment-section');
        
        // 在新评论输入区域之前插入新评论
        commentsList.insertBefore(newComment, newCommentSection);
        
        // 更新评论数量
        updateCommentCount(articleId);
        
        // 清空输入框
        textarea.value = '';
        
        // 恢复按钮状态
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-paper-plane"></i>';
        
        // 显示成功通知
        showNotification('评论发表成功！', 'success');
        
        // 添加发表成功动画
        newComment.style.opacity = '0';
        newComment.style.transform = 'translateY(-10px)';
        newComment.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            newComment.style.opacity = '1';
            newComment.style.transform = 'translateY(0)';
        }, 100);
        
        // 创建粒子特效
        createCommentParticles(button);
        
        // 触感反馈
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
    }, 500); // 模拟500ms网络延迟
}

// 创建评论元素
function createCommentElement(commentText) {
    const commentItem = document.createElement('div');
    commentItem.className = 'comment-item';
    
    const currentTime = new Date();
    const timeString = '刚刚';
    
    commentItem.innerHTML = `
        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face" alt="用户" class="comment-avatar">
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-author">当前用户</span>
                <span class="comment-time">${timeString}</span>
            </div>
            <p class="comment-text">${commentText}</p>
        </div>
    `;
    
    return commentItem;
}

// 更新评论数量
function updateCommentCount(articleId) {
    const article = document.querySelector(`[onclick="openArticle(${articleId})"]`);
    if (article) {
        const commentsHeader = article.querySelector('.comments-header h4');
        if (commentsHeader) {
            const currentText = commentsHeader.textContent;
            const currentCount = parseInt(currentText.match(/\d+/)[0]);
            const newCount = currentCount + 1;
            commentsHeader.textContent = `评论 (${newCount})`;
        }
    }
}

// 创建评论提交粒子特效
function createCommentParticles(button) {
    const rect = button.getBoundingClientRect();
    const particleCount = 3;
    const emojis = ['💬', '✨', '🎉'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = emojis[i % emojis.length];
        particle.style.position = 'fixed';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        particle.style.fontSize = '16px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10000';
        particle.style.transition = 'all 1s ease-out';
        
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
        }, 1000);
    }
}

// 监听输入框变化，动态启用/禁用提交按钮
document.addEventListener('DOMContentLoaded', function() {
    // 为所有新评论输入框添加事件监听
    document.querySelectorAll('.new-comment-input').forEach(textarea => {
        const submitBtn = textarea.parentElement.querySelector('.submit-comment-btn');
        
        // 初始状态
        updateSubmitButtonState(textarea, submitBtn);
        
        // 监听输入变化
        textarea.addEventListener('input', function() {
            updateSubmitButtonState(this, submitBtn);
        });
        
        // 监听键盘事件（Ctrl+Enter 或 Cmd+Enter 提交）
        textarea.addEventListener('keydown', function(event) {
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                if (!submitBtn.disabled) {
                    submitComment(event, submitBtn);
                }
            }
        });
    });
});

// 更新提交按钮状态
function updateSubmitButtonState(textarea, submitBtn) {
    const hasText = textarea.value.trim().length > 0;
    submitBtn.disabled = !hasText;
    
    if (hasText) {
        submitBtn.style.opacity = '1';
    } else {
        submitBtn.style.opacity = '0.5';
    }
}

console.log('🎮 CyberRead 脚本加载完成'); 