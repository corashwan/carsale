/* =============================================================================
 Ysells | Script
 ============================================================================= */

(function ($) {
    "use strict";
    // =====  =====  =====
    
    //---- --------prevent closing dropdown of location change when clicked ------------
    $(document).on('click', '.dropdown-menu.dropdown-location-change', function (e) {
        e.stopPropagation();
    });
    
    /* -------------------- Call the Revolution Slider -------------------- */
    jQuery(document).ready(function () {
        jQuery("#slider-country-selector").revolution({
            sliderType: "standard",
            sliderLayout: 'fullscreen',
            delay: 12000,
            spinner: 'off',
            dottedOverlay: 'threexthree',
            navigation: {
                onHoverStop: "off",
                arrows: {enable: false},
                bullets: {enable: false}
            },
            responsiveLevels: [4096, 1024, 778, 480],
            gridwidth: [1140, 950, 760, 480],
            gridheight: [700, 730, 900, 700]
        });
    });


    // ------------------- accordion footer --------------------
    $(".acc-title").click(function () {
        $(this).closest(".acc-wrap").find(".acc-detail").slideToggle();
        $(this).toggleClass("acc-title-plus acc-title-minus");
    });

    if ($(".media-detect").css("width") === "4px") {
        $('.acc-wrap').removeClass("acc-detail-open-default");
    }

    // ------------------- homepage rev slider -----------------------
    jQuery(document).ready(function () {
        jQuery("#slider-hdr-7").revolution({
            sliderType: "standard",
            sliderLayout: "auto",
            disableProgressBar: "on",
            delay: 5000,
            navigation: {
                onHoverStop: "off",
                arrows: {enable: false},
                bullets: {enable: false}
            },
            responsiveLevels: [1170, 800, 600, 480],
            gridwidth: [1120, 750, 500, 450],
            gridheight: [365, 365, 365, 365]
        });
    });
    
    // ------------------ sticky header ----------------------
    document.onscroll = function () {
        if ($(window).scrollTop() > $('#section-topbar').height()) {
            $('#header').removeClass('navbar-static-top').addClass('navbar-fixed-top');
        } else {
            $('#header').removeClass('navbar-fixed-top').addClass('navbar-static-top');
        }
        //-- on mobile ---
        if ($(window).scrollTop() > $('#section-topbar').height()) {
            $('#header-mobile').removeClass('navbar-static-top').addClass('navbar-fixed-top');
        } else {
            $('#header-mobile').removeClass('navbar-fixed-top').addClass('navbar-static-top');
        }
        //-- price sticky  ---
        if ($(window).scrollTop() > 600) {
            $('.price-sticky').removeClass('hidden');
        } else {
            $('.price-sticky').addClass('hidden');
        }
    };


    // ------------------- menu accordion --------------------
    $(".collapse-title").click(function () {
        $(this).closest(".collapse-wrap").find(".collapse-detail").slideToggle();
        $(this).toggleClass("collapse-title-plus collapse-title-minus");
    });
    //mobile trigger
    $(".cat-trigger").click(function () {
        $(this).closest(".sidebar").find(".cat-wrap").slideToggle();
    });
    
    // ----------------- listing page filter trigger on mobile ----------
    $(".filter-trigger").click(function () {
        $(this).siblings(".listing-filter").slideToggle();
    });

    // ------------- tooltip -----------------
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    });


    //------------------------ product detail slider ----------------------
    jQuery(document).ready(function () {
        jQuery("#slider-hdr-8").revolution({
            sliderType: "carousel",
            sliderLayout: "auto",
            disableProgressBar: "on",
            delay: 5000,
            stopLoop: 'on',
            stopAfterLoops: 0,
            stopAtSlide: 1,
            navigation: {
                onHoverStop: "off",
                arrows: {enable: true},
                bullets: {enable: false},
                thumbnails: {
                    style: "gyges",
                    enable: true,
                    width: 80,
                    height: 60,
                    min_width: 80,
                    wrapper_padding: 20,
                    wrapper_color: "#222222",
                    wrapper_opacity: "1",
                    tmp:'<span class="tp-thumb-img-wrap">  <span class="tp-thumb-image"></span></span>',
                    visibleAmount: 7,
                    hide_onmobile: true,
                    hide_under: 720,
                    hide_onleave: false,
                    direction: "vertical",
                    span: true,
                    position: "outer-left",
                    space: 10,
                    h_align: "left",
                    v_align: "top",
                    h_offset: 0,
                    v_offset: 0
                }
            },
            responsiveLevels: [1170, 800, 600, 480],
            gridwidth: [1120, 750, 500, 450],
            gridheight: [500, 500, 500, 500]
        });
    });




    // =====  =====  =====
})(jQuery);