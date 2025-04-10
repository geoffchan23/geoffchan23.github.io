document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbwd36X1gS5ved6EphPfKz3lXeC2DqDRxbCG8Xre77pVASri0nA_mfa8SL3lF7HeAoq1/exec';
    
    // Format date as YYYYMMDD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }
    
    // Format date for display (Month Day, Year)
    function formatDisplayDate(dateStr) {
        if (!dateStr) return '';
        
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    // Handle comics list page
    if (window.location.pathname.includes('all-comics')) {
        loadAllComics();
    } 
    // Handle single comic page
    else if (window.location.pathname.includes('comic')) {
        loadTodaysComic();
    }
    
    function loadTodaysComic() {
        const today = new Date();
        const dateParam = formatDate(today);
        const url = `${API_BASE_URL}?action=get-comic&date=${dateParam}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.imageLink) {
                    displayComic(data);
                    setupNavigation(data.date);
                } else {
                    showError();
                }
            })
            .catch(error => {
                console.error('Error fetching comic:', error);
                showError();
            });
    }
    
    function displayComic(comicData) {
        // Hide loading, show comic
        document.getElementById('comic-loading').style.display = 'none';
        document.getElementById('comic-display').style.display = 'block';
        
        // Set comic data
        document.getElementById('comic-title').textContent = comicData.title || 'Daily Comic';
        document.getElementById('comic-image').src = comicData.imageLink;
        document.getElementById('comic-image').alt = comicData.title || 'Daily Comic';
        
        // Set metadata
        document.getElementById('comic-article-date').textContent = `Article Date: ${formatDisplayDate(comicData.articleDate)}`;
        document.getElementById('comic-author').textContent = `Author: ${comicData.author || 'Unknown'}`;
        document.getElementById('comic-article-title').textContent = `Article Title: ${comicData.title || ''}`;
        
        // Set URL
        const urlElement = document.getElementById('comic-url');
        if (comicData.url) {
            urlElement.href = comicData.url;
        } else {
            urlElement.parentElement.style.display = 'none';
        }
        
        // Set summary
        const summaryElement = document.getElementById('comic-summary');
        if (comicData.summary) {
            summaryElement.textContent = comicData.summary;
        } else {
            summaryElement.style.display = 'none';
        }
        
        // Set categories
        const categoriesElement = document.getElementById('comic-categories');
        if (comicData.categories) {
            const categories = comicData.categories.split(',');
            categories.forEach(category => {
                const span = document.createElement('span');
                span.className = 'comic-category';
                span.textContent = category.trim();
                categoriesElement.appendChild(span);
            });
        } else {
            categoriesElement.parentElement.style.display = 'none';
        }
        
        // Update meta tags for SEO
        updateMetaTags(comicData);
    }
    
    function updateMetaTags(comicData) {
        // Update title
        document.title = `${comicData.title} | Daily Comic`;
        
        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = `${comicData.title} - A daily comic inspired by a New Yorker article: ${comicData.summary?.substring(0, 100)}...`;
        }
        
        // Update OG tags
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.content = `${comicData.title} | Daily Comic`;
        }
        
        let ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.content = `Comic inspired by The New Yorker article: ${comicData.title}`;
        }
        
        // Add image if not present
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (!ogImage && comicData.imageLink) {
            ogImage = document.createElement('meta');
            ogImage.setAttribute('property', 'og:image');
            ogImage.content = comicData.imageLink;
            document.head.appendChild(ogImage);
        } else if (ogImage && comicData.imageLink) {
            ogImage.content = comicData.imageLink;
        }
    }
    
    function setupNavigation(currentDate) {
        const prevButton = document.getElementById('prev-comic');
        const nextButton = document.getElementById('next-comic');
        
        // Fetch all comics to determine navigation
        fetch(`${API_BASE_URL}?action=get-all-comics`)
            .then(response => response.json())
            .then(allComics => {
                if (!Array.isArray(allComics) || allComics.length === 0) {
                    prevButton.disabled = true;
                    nextButton.disabled = true;
                    return;
                }
                
                // Sort comics by date
                allComics.sort((a, b) => a.date.localeCompare(b.date));
                
                // Find current index
                const currentIndex = allComics.findIndex(comic => comic.date === currentDate);
                
                // Setup prev button
                if (currentIndex <= 0) {
                    prevButton.disabled = true;
                } else {
                    prevButton.disabled = false;
                    prevButton.addEventListener('click', () => {
                        window.location.href = `?date=${allComics[currentIndex - 1].date}`;
                    });
                }
                
                // Setup next button
                if (currentIndex >= allComics.length - 1 || currentIndex === -1) {
                    nextButton.disabled = true;
                } else {
                    nextButton.disabled = false;
                    nextButton.addEventListener('click', () => {
                        window.location.href = `?date=${allComics[currentIndex + 1].date}`;
                    });
                }
            })
            .catch(error => {
                console.error('Error setting up navigation:', error);
                prevButton.disabled = true;
                nextButton.disabled = true;
            });
    }
    
    function loadAllComics() {
        fetch(`${API_BASE_URL}?action=get-all-comics`)
            .then(response => response.json())
            .then(allComics => {
                document.getElementById('comics-loading').style.display = 'none';
                
                if (!Array.isArray(allComics) || allComics.length === 0) {
                    showError('comics');
                    return;
                }
                
                // Sort comics by date (newest first)
                allComics.sort((a, b) => b.date.localeCompare(a.date));
                
                const comicsList = document.getElementById('comics-list');
                comicsList.style.display = 'block';
                
                allComics.forEach(comic => {
                    const li = document.createElement('li');
                    li.className = 'comic-list-item';
                    
                    const a = document.createElement('a');
                    a.href = `/comic.html?date=${comic.date}`;
                    
                    const title = document.createElement('span');
                    title.textContent = comic.title || 'Untitled Comic';
                    
                    const date = document.createElement('span');
                    date.className = 'comic-date';
                    date.textContent = formatDisplayDate(comic.date);
                    
                    a.appendChild(title);
                    a.appendChild(date);
                    li.appendChild(a);
                    comicsList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error fetching all comics:', error);
                showError('comics');
            });
    }
    
    function showError(type = 'comic') {
        if (type === 'comics') {
            document.getElementById('comics-loading').style.display = 'none';
            document.getElementById('comics-error').style.display = 'block';
        } else {
            document.getElementById('comic-loading').style.display = 'none';
            document.getElementById('comic-error').style.display = 'block';
        }
    }
    
    // Handle URL parameters for specific dates
    function handleUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const dateParam = urlParams.get('date');
        
        if (dateParam && dateParam.match(/^\d{8}$/)) {
            loadComicByDate(dateParam);
        }
    }
    
    function loadComicByDate(dateStr) {
        const url = `${API_BASE_URL}?action=get-comic&date=${dateStr}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.imageLink) {
                    displayComic(data);
                    setupNavigation(data.date);
                } else {
                    showError();
                }
            })
            .catch(error => {
                console.error('Error fetching comic by date:', error);
                showError();
            });
    }
    
    // Check for URL parameters if on comic page
    if (window.location.pathname.includes('comic.html')) {
        handleUrlParams();
    }
});