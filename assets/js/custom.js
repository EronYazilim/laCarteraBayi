$(document).ready(function($) {
    "use strict"
    var $body = $("body")

    if( $body.hasClass("has-loading-screen") ){
        $body.append('<div class="loader"></div>')

        Pace.on("done", function() {
            $body.addClass("loading-done")
            setTimeout(function() {
                $body.addClass("hide-loading-screen")
            }, 500)
            $.each( $(".animate"), function (i) {
                var $this = $(this)
                setTimeout(function(){
                    $this.addClass("show-it")
                }, i * 100)
            })
        })
    }
})