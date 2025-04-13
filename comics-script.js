document.addEventListener('DOMContentLoaded', function() {
    // Simple navigation helper for comics
    // No API calls needed as each page is now statically generated
    
    // Highlight the active navigation link
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.classList.remove('selected');
        if (currentPath.includes('/comics/') && link.href.includes('/comics/')) {
            link.classList.add('selected');
        } else if (link.getAttribute('href') === currentPath) {
            link.classList.add('selected');
        }
    });
});