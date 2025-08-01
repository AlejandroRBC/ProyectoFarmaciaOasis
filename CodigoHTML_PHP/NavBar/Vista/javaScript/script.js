document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const overlayMenu = document.getElementById('overlayMenu');
    const closeMenu = document.getElementById('closeMenu');

    // Function to open the overlay menu
    function openNav() {
        overlayMenu.style.width = "250px"; // Set the width to open the menu
        // If you want it to truly occupy the "whole left border" (i.e., full screen width), use:
        // overlayMenu.style.width = "100%";
    }

    // Function to close the overlay menu
    function closeNav() {
        overlayMenu.style.width = "0"; // Set width back to 0 to close
    }

    // Event listeners
    if (menuToggle) {
        menuToggle.addEventListener('click', openNav);
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', closeNav);
    }
});