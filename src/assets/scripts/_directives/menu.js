'use strict';
;function check() {
    if( $( "html" ).attr("dir") === "rtl" ) {
        return "true";
    } else {
        return false;
    }
};



angular.module('app')
    .directive('revolutionslider', function($document, $rootScope, LANGUAGE) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                angular.element(document).ready(function () {
            if (jQuery('#rev_slider_container').revolution === undefined) {
                revslider_showDoubleJqueryError('#rev_slider_container');
            } else {
                jQuery('#rev_slider_container').show().revolution({
                    sliderType: 'standard',
                    jsFileLocation: "js/slider-revolution/js/",
                    dottedOverlay: 'none',
                    delay: 9000,
                    navigation: {
                        keyboardNavigation: 'on',
                        keyboard_direction: 'horizontal',
                        mouseScrollNavigation: 'off',
                        mouseScrollReverse: 'default',
                        onHoverStop: 'on',
                        touch: {
                            touchenabled: 'on',
                            swipe_threshold: 75,
                            swipe_min_touches: 1,
                            swipe_direction: 'horizontal',
                            drag_block_vertical: false
                        },
                        arrows: {
                            style: 'hades',
                            enable: true,
                            hide_onmobile: true,
                            hide_under: 600,
                            hide_onleave: true,
                            hide_delay: 200,
                            hide_delay_mobile: 1200,
                            tmp: '<div class="tp-arr-allwrapper"><div class="tp-arr-imgholder"></div></div>',
                            left: {
                                h_align: 'left',
                                v_align: 'center',
                                h_offset: 0,
                                v_offset: 0
                            },
                            right: {
                                h_align: 'right',
                                v_align: 'center',
                                h_offset: 0,
                                v_offset: 0
                            }
                        },
                        bullets: {
                            enable: true,
                            hide_onmobile: true,
                            hide_under: 600,
                            style: 'uranus',
                            hide_onleave: false,
                            direction: 'horizontal',
                            h_align: 'center',
                            v_align: 'bottom',
                            h_offset: 0,
                            v_offset: 30,
                            space: 10,
                            tmp: '<span class="tp-bullet-inner"></span>'
                        }
                    },
                    viewPort: {
                        enable: true,
                        outof: 'pause',
                        visible_area: '80%',
                        presize: false
                    },
                    gridwidth: 1170,
                    gridheight: [800, 600, 'auto', 'auto'],
                    responsiveLevels: [1920, 1441, 0, 0],
                    lazyType: 'none',
                    parallax: {
                        type: 'mouse+scroll',
                        origo: 'slidercenter',
                        speed: 2000,
                        levels: [2, 3, 4, 5, 6, 7, 12, 16, 10, 50, 46, 47, 48, 49, 50, 55],
                        disable_onmobile: 'on'
                    },
                    shadow: 0,
                    spinner: 'spinner0',
                    autoHeight: 'off',
                    shuffle: 'off',
                    disableProgressBar: 'off',
                    hideThumbsOnMobile: 'on',
                    hideSliderAtLimit: 0,
                    hideCaptionAtLimit: 0,
                    hideAllCaptionAtLilmit: 0,
                    debugMode: false,
                    fallbacks: {
                        simplifyAll: 'off',
                        nextSlideOnWindowFocus: 'off',
                        disableFocusListener: false
                    }

                });
            }
                })
            }
        }
    })
    .directive('footeraccordion', function($document, $rootScope, LANGUAGE, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                angular.element(document).ready(function () {

                        $(".acc-title").click(function () {
                            $(this).closest(".acc-wrap").find(".acc-detail").slideToggle();
                            $(this).toggleClass("acc-title-plus acc-title-minus");
                        });

                        if ($(".media-detect").css("width") === "4px") {
                            $('.acc-wrap').removeClass("acc-detail-open-default");
                        }


                })

            $(".collapse-title").click(function () {
                $(this).closest(".collapse-wrap").find(".collapse-detail").slideToggle();
                $(this).toggleClass("collapse-title-plus collapse-title-minus");
            });
            //mobile trigger
            $("body").delegate(".cat-trigger", 'click', function () {
                $(this).closest(".sidebar").find(".cat-wrap").slideToggle();
            });
            
            // ----------------- listing page filter trigger on mobile ----------
            $("body").delegate(".filter-trigger", 'click', function () {
                $(this).siblings(".listing-filter").slideToggle();
            });

    $(document).on('click', '.dropdown-menu.dropdown-location-change', function (e) {
        e.stopPropagation();
    });
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

 
            }
        }
    })
    .directive('homeslider', function($document, $rootScope, LANGUAGE, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                angular.element(document).ready(function () {

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



                })

 
            }
        }
    })
    .directive('homeslider', function($document, $rootScope, LANGUAGE, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                angular.element(document).ready(function () {



                        $("body").delegate(".collapse-title", 'click', function () {
                          
                            $(this).closest(".collapse-wrap").find(".collapse-detail").slideToggle();
                            $(this).toggleClass("collapse-title-plus collapse-title-minus");
                        });
                })

 
            }
        }
    })
    .directive('collapsetoggle', function($document, $rootScope, LANGUAGE, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                angular.element(document).ready(function () {



                        $(element).click(function () {
                        
                            $(element).closest(".collapse-wrap").find(".collapse-detail").slideToggle();
                            $(element).toggleClass("collapse-title-plus collapse-title-minus");
                        });
                })

 
            }
        }
    })



