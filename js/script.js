$(function() {

    //main-block padding

    function wPadding() {
        $('.main-block').eq(0).css({
            'background-position-y': -$('.top-line').outerHeight() + 'px'
        });
    }
    wPadding();



    $('a').click(function() {
        if ($(this).attr('href').charAt(0) == "#") {
            var el = $(this).attr('href');
            $('html, body').animate({
                scrollTop: $(el).offset().top - $('.top-line').outerHeight()
            }, 500);
            return false;
        }
    });

    //mobButton
    $('.mob-button').on('click', function() {
        $('.mob-button').toggleClass('active');
    });

    $('.nav a').on('click', function() {
        if ($('.mob-button').hasClass('active')) {
            $('.mob-button').removeClass('active');
        }
    });

    $('.popup__wrapper').on('click', function(e) {
        if ($(e.target).closest('.popup__block').length) return;
        $(this).hide();
    });







    //timers
    $(".timer").eq(0).FlipClock(10300, {
        countdown: true,
        language: "ru"
    });
    $(".timer").eq(1).FlipClock(10300, {
        countdown: true,
        language: "ru"
    });
    $(".timer").eq(2).FlipClock(10300, {
        countdown: true,
        language: "ru"
    });
    $(".timer").eq(3).FlipClock(10300, {
        countdown: true,
        language: "ru"
    });
    $(".timer").eq(4).FlipClock(10300, {
        countdown: true,
        language: "ru"
    });
    $(".timer").eq(5).FlipClock(10300, {
        countdown: true,
        language: "ru"
    });


    $('select').on('focus', function() {
        $(this).addClass('active')
    })
    $('select').on('change blur', function() {
        $(this).removeClass('active')
    })





    //input placeholder toggle
    var curPlaceHolder;
    $("input").on("click", function() {
        curPlaceHolder = $(this).attr("placeholder");
        $(this).attr("placeholder", "");
    });
    $("input").on("blur", function() {
        if ($(this).val() == "") {
            $(this).attr("placeholder", curPlaceHolder);
        }
    });

    $(".sostav__slider").owlCarousel({
        nav: true,
        dots: false,
        navText: "",
        loop: true,
        responsive: {
            992: {
                items: 2,
            },
            640: {
                dots: true,
                items: 1,
                autoHeight: true,
            },
            0: {
                autoHeight: true,
                items: 1
            }
        }
    });

    $(".reviews__slider").owlCarousel({
        nav: false,
        dots: true,
        navText: "",
        loop: true,
        dotsEach: true,
        responsive: {
            768: {
                items: 3,
            },
            640: {
                items: 1,
                autoHeight: true,
            },
            0: {
                autoHeight: true,
                items: 1
            }
        }
    });

    if ($(window).outerWidth() <= 768) {

        $(".topSix__itemG.owl-carousel").owlCarousel({
            nav: true,
            dots: false,
            navText: "",
            loop: true,
            autoHeight: true,
            dotsEach: true,
            items: 1
        });
        $(".numberTwo__item-cubes.owl-carousel").owlCarousel({
            nav: true,
            dots: false,
            navText: "",
            loop: true,
            autoHeight: true,
            dotsEach: true,
            items: 1
        });

    }

    // генерация купленных продуктов

    var randomInteger = function() {
        var min = 1000;
        var max = 4000;
        var rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    }
    var randomIntegerMin = function() {
        var min = 1;
        var max = 20;
        var rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    }
    var randomIntegerTime = function() {
        var min = 1000;
        var max = 30000;
        var rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    }
    $('.packCount').text(randomInteger());

    var inVal = setInterval(function() {
        $('.packCount').text(parseInt($('.packCount').eq(0).text()) + randomIntegerMin());
    }, 15000);

    // генерация купленных продуктов //


    function checkPriceLength() {
        var price = $('.price-block .price-block__price');
        var oldPrice = $('.price-block .price-block__oldPrice');
        if (price.eq(0).text().length > 5) {
            price.addClass('small');
            oldPrice.addClass('small');
            price.removeClass('medium');
            oldPrice.removeClass('medium');
        } else if (price.eq(0).text().length == 5) {
            price.addClass('medium');
            oldPrice.addClass('medium');
            oldPrice.removeClass('small');
            price.removeClass('small');
        } else {
            price.removeClass('small');
            price.removeClass('medium');
            oldPrice.removeClass('small');
            oldPrice.removeClass('medium');
        }
    }
    checkPriceLength();

    $(document).on('change', 'select', function() {
        checkPriceLength();
    })



}); 