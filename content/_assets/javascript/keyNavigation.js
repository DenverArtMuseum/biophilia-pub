/**
 * Move through pages
 */
var prevNextNavigation = function( event ) {
    if( $('.mfp-ready').length ) return false;
    //console.log(`${event.key} ${event.code} ${event.keyCode}`);
    
    if (event.key === "ArrowLeft") {
        var url = $('.quire-navbar-page-controls__item.quire-previous-page > a').attr('href');
    }
    if (event.key === "ArrowRight") {
        var url = $('.quire-navbar-page-controls__item.quire-next-page > a').attr('href');
    }
    // This conflicts with scrolling
    // if (event.key === "ArrowUp") {
    //     var url = $('.quire-navbar-page-controls__item.quire-home-page > a').attr('href');
    // }

    if( url ) {
        //console.log(`${event.key} -> ${url}`);
        location.href = url;
    }
};

/**
 * Init
 */
var init = function() {
    window.addEventListener( 'keydown', prevNextNavigation, true );
};

module.exports = {init,prevNextNavigation};