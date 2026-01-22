$(document).ready(function () {
    
    $('.navbar-nav .nav-link').on('click', function () {
        if ($(window).width() < 992) {
            $('.navbar-collapse').collapse('hide');
        }
    });


    var headerHeight = $('.navbar').outerHeight() || 0;

    // CLICK SMOOTH SCROLL
    $('.nav-link').on('click', function (e) {
        e.preventDefault();

        var target = $(this).attr('href');

        $('html, body').animate({
            scrollTop: $(target).offset().top - headerHeight
        }, 600);
    });

    // SCROLL ACTIVE CLASS
    $(window).on('scroll', function () {
        var scrollPos = $(window).scrollTop() + headerHeight + 10;

        $('.nav-link').each(function () {
            var currLink = $(this);
            var section = $(currLink.attr('href'));

            if (
                section.length &&
                section.offset().top <= scrollPos &&
                section.offset().top + section.outerHeight() > scrollPos
            ) {
                $('.nav-link').removeClass('active');
                currLink.addClass('active');
            }
        });
    });
});
