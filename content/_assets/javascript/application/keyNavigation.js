/**
 * Navigate through pages using right and left arrow keys
 */
var KeyNavigation = {

    prevNextNavigation: function( event ) {
        // const modal = document.getElementsByTagName('q-model');
        // console.log(modal.length)
        //console.log(modal[0].dataset.modalActive);
        // if( modal && modal.dataset.modalActive ) {
        //     console.log(modal.dataset.modalActive);
        //     return;
        // }

        //if( $('.mfp-ready').length ) return false;
        //console.log(`jQuery{event.key} jQuery{event.code} jQuery{event.keyCode}`);
        //console.log(event)

        if (event.key === "ArrowLeft") {
            var leftarrow = document.querySelector('.quire-navbar-page-controls__item.quire-previous-page > a');
            if( leftarrow ) var url = leftarrow.getAttribute('href');
        }
        if (event.key === "ArrowRight") {
            var rightarrow = document.querySelector('.quire-navbar-page-controls__item.quire-next-page > a');
            if( rightarrow ) {
                var url = rightarrow.getAttribute('href');
            } else {
                var homearrow = document.querySelector('.quire-navbar-page-controls__item.quire-home-page > a');
                if( homearrow ) {
                    var url = homearrow.getAttribute('href');
                }
            }
        }

        // This conflicts with scrolling
        // if (event.key === "ArrowUp") {
        //     var url = $('.quire-navbar-page-controls__item.quire-home-page > a').attr('href');
        // }

        if( url ) {
            //console.log(`${event.key} -> ${url}`);
            location.href = url;
        }
    },
    init: function() {
        window.addEventListener( 'keydown', this.prevNextNavigation, true );
        //console.log('loaded event listeners');
    }

};

export { KeyNavigation }