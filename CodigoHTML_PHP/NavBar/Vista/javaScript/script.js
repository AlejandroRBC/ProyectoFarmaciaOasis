document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const overlayMenu = document.getElementById('overlayMenu');
    const closeMenu = document.getElementById('closeMenu');

    function openNav() {
        overlayMenu.style.width = "250px"; 
    }
    function closeNav() {
        overlayMenu.style.width = "0";
    }
    
    if (menuToggle) {
        menuToggle.addEventListener('click', openNav);
    }
    if (closeMenu) {
        closeMenu.addEventListener('click', closeNav);
    }
});