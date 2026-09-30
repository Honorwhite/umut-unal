(function ($) {
  "use strict";
/*=================================
    JS Index Here
==================================*/
/*
  01. On Load Function
  02. Preloader
  03. Mobile Menu Active
  04. Sticky fix
  05. Scroll To Top
  06. Set Background Image & Color
  07. Popup Sidemenu
  08. Search Box Popup
  09. Hero Slider Active
  10. Magnific Popup
  11. Blog Card Animation
  12. Count Down
  13. Section Position
  14. Member Details Toggle
  15. Tab Indicator
  16. Quantity Adder
  17. Woocommerce Toggle
  18. Shop Big Image Src Set
  19. Filter Menu
  20. Date & Time Picker
  21. Parallax Effect
  22. WOW Js
  23. Woocommerce Toggle
  24. Service Circle Toggle
  25. Service Slider Active
*/
/*=================================
    JS Index End
==================================*/
/*

  /*---------- 01. On Load Function ----------*/
  $(window).on('load', function () {
    $('.preloader').fadeOut();
  });



  /*---------- 02. Preloader ----------*/
  if ($('.preloader').length > 0) {
    $('.preloaderCls').each(function () {
      $(this).on('click', function (e) {
        e.preventDefault();
        $('.preloader').css('display', 'none');
      })
    });
  };



  /*---------- 03. Mobile Menu Active ----------*/
  $.fn.vsmobilemenu = function (options) {
    var opt = $.extend({
      menuToggleBtn: '.vs-menu-toggle',
      bodyToggleClass: 'vs-body-visible',
      subMenuClass: 'vs-submenu',
      subMenuParent: 'vs-item-has-children',
      subMenuParentToggle: 'vs-active',
      meanExpandClass: 'vs-mean-expand',
      subMenuToggleClass: 'vs-open',
      toggleSpeed: 400,
    }, options);

    return this.each(function () {
      var menu = $(this); // Select menu

      // Menu Show & Hide
      function menuToggle() {
        menu.toggleClass(opt.bodyToggleClass);

        // collapse submenu on menu hide or show
        var subMenu = '.' + opt.subMenuClass;
        $(subMenu).each(function () {
          if ($(this).hasClass(opt.subMenuToggleClass)) {
            $(this).removeClass(opt.subMenuToggleClass);
            $(this).css('display', 'none')
            $(this).parent().removeClass(opt.subMenuParentToggle);
          };
        });
      };

      // Class Set Up for every submenu
      menu.find('li').each(function () {
        var submenu = $(this).find('ul');
        submenu.addClass(opt.subMenuClass);
        submenu.css('display', 'none');
        submenu.parent().addClass(opt.subMenuParent);
        submenu.prev('a').addClass(opt.meanExpandClass);
        submenu.next('a').addClass(opt.meanExpandClass);
      });

      // Toggle Submenu 
      function toggleDropDown($element) {
        if ($($element).next('ul').length > 0) {
          $($element).parent().toggleClass(opt.subMenuParentToggle);
          $($element).next('ul').slideToggle(opt.toggleSpeed);
          $($element).next('ul').toggleClass(opt.subMenuToggleClass);
        } else if ($($element).prev('ul').length > 0) {
          $($element).parent().toggleClass(opt.subMenuParentToggle);
          $($element).prev('ul').slideToggle(opt.toggleSpeed);
          $($element).prev('ul').toggleClass(opt.subMenuToggleClass);
        };
      };

      // Submenu toggle Button
      var expandToggler = '.' + opt.meanExpandClass;
      $(expandToggler).each(function () {
        $(this).on('click', function (e) {
          e.preventDefault();
          toggleDropDown(this);
        });
      });

      // Menu Show & Hide On Toggle Btn click
      $(opt.menuToggleBtn).each(function () {
        $(this).on('click', function () {
          menuToggle();
        })
      })

      // Hide Menu On out side click
      menu.on('click', function (e) {
        e.stopPropagation();
        menuToggle()
      })

      // Stop Hide full menu on menu click
      menu.find('div').on('click', function (e) {
        e.stopPropagation();
      });

    });
  };

  $('.vs-menu-wrapper').vsmobilemenu();





  /*---------- 04. Sticky fix ----------*/
  var lastScrollTop = '';
  var scrollToTopBtn = '.scrollToTop'

  function stickyMenu($targetMenu, $toggleClass, $parentClass) {
    var st = $(window).scrollTop();
    var height = $targetMenu.css('height');
    $targetMenu.parent().css('min-height', height);
    if ($(window).scrollTop() > 800) {
      $targetMenu.parent().addClass($parentClass);

      if (st > lastScrollTop) {
        $targetMenu.removeClass($toggleClass);
      } else {
        $targetMenu.addClass($toggleClass);
      };
    } else {
      $targetMenu.parent().css('min-height', '').removeClass($parentClass);
      $targetMenu.removeClass($toggleClass);
    };
    lastScrollTop = st;
  };
  $(window).on("scroll", function () {
    stickyMenu($('.sticky-active'), "active", "will-sticky");
    if ($(this).scrollTop() > 500) {
      $(scrollToTopBtn).addClass('show');
    } else {
      $(scrollToTopBtn).removeClass('show');
    }
  });



  /*---------- 05. Scroll To Top ----------*/
  $(scrollToTopBtn).each(function () {
    $(this).on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: 0
      }, lastScrollTop / 3);
      return false;
    });
  })




  /*---------- 06.Set Background Image & Color ----------*/
  if ($('[data-bg-src]').length > 0) {
    $('[data-bg-src]').each(function () {
      var src = $(this).attr('data-bg-src');
      $(this).css('background-image', 'url(' + src + ')');
    });
  };

  if ($('[data-bg-color]').length > 0) {
    $('[data-bg-color]').each(function () {
      var color = $(this).attr('data-bg-color');
      $(this).css('background-color', color);
    });
  };





  /*---------- 07. Popup Sidemenu ----------*/
  function popupSideMenu($sideMenu, $sideMunuOpen, $sideMenuCls, $toggleCls) {
    // Sidebar Popup
    $($sideMunuOpen).on('click', function (e) {
      e.preventDefault();
      $($sideMenu).addClass($toggleCls);
    });
    $($sideMenu).on('click', function (e) {
      e.stopPropagation();
      $($sideMenu).removeClass($toggleCls)
    });
    var sideMenuChild = $sideMenu + ' > div';
    $(sideMenuChild).on('click', function (e) {
      e.stopPropagation();
      $($sideMenu).addClass($toggleCls)
    });
    $($sideMenuCls).on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $($sideMenu).removeClass($toggleCls);
    });
  };
  popupSideMenu('.sidemenu-wrapper', '.sideMenuToggler', '.sideMenuCls', 'show');





  /*---------- 08. Search Box Popup ----------*/
  function popupSarchBox($searchBox, $searchOpen, $searchCls, $toggleCls) {
    $($searchOpen).on('click', function (e) {
      e.preventDefault();
      $($searchBox).addClass($toggleCls);
    });
    $($searchBox).on('click', function (e) {
      e.stopPropagation();
      $($searchBox).removeClass($toggleCls);
    });
    $($searchBox).find('form').on('click', function (e) {
      e.stopPropagation();
      $($searchBox).addClass($toggleCls);
    });
    $($searchCls).on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $($searchBox).removeClass($toggleCls);
    });
  };
  popupSarchBox('.popup-search-box', '.searchBoxTggler', '.searchClose', 'show');




 /*---------- 08. counter-box ----------*/

 $(".circle_percent").each(function() {
  var $this = $(this),
  $dataV = $this.data("percent"),
  $dataDeg = $dataV * 3.6,
  $round = $this.find(".round_per");
$round.css("transform", "rotate(" + parseInt($dataDeg + 180) + "deg)");	
$this.append('<div class="circle_inbox"><span class="percent_text"></span></div>');
$this.prop('Counter', 0).animate({Counter: $dataV},
{
  duration: 2000, 
  easing: 'swing', 
  step: function (now) {
          $this.find(".percent_text").text(Math.ceil(now)+"%");
      }
  });
if($dataV >= 51){
  $round.css("transform", "rotate(" + 360 + "deg)");
  setTimeout(function(){
    $this.addClass("percent_more");
  },1000);
  setTimeout(function(){
    $round.css("transform", "rotate(" + parseInt($dataDeg + 180) + "deg)");
  },1000);
} 
});



  /*----------- 09. Hero Slider Active ----------*/
  $('.vs-hero-carousel').each(function () {
    var vsHslide = $(this);

    // Get Data From Dom
    function d(data) {
      return vsHslide.data(data)
    }

    // Custom Style Set    
    vsHslide.on('sliderWillLoad', function (event, slider) {

      // Define Variable
      var respLayer = jQuery(this).find('.ls-responsive'),
        lsDesktop = 'ls-desktop',
        lsMobile = 'ls-mobile',
        lsTablet = 'ls-tablet',
        lsLaptop = 'ls-laptop',
        windowWid = jQuery(window).width(),
        lgDevice = 1025,
        mdDevice = 993,
        smDevice = 768;

      // Set Style on each Layer
      respLayer.each(function () {
        var layer = jQuery(this);

        function lsd(data) {
          return (layer.data(data) === '') ? layer.data(null) : layer.data(data);
        }
        // var respStyle = (windowWid < smDevice) ? ((lsd(lsMobile)) ? lsd(lsMobile) : lsd(lsTablet)) : ((windowWid < mdDevice) ? ((lsd(lsTablet)) ? lsd(lsTablet) : lsd(lsDesktop)) : lsd(lsDesktop)),
        var respStyle = (windowWid < smDevice) ? lsd(lsMobile) : ((windowWid < mdDevice ? lsd(lsTablet) : ((windowWid < lgDevice) ? lsd(lsLaptop) : lsd(lsDesktop)))),
        mainStyle = (layer.attr('style') !== undefined) ? layer.attr('style') : ' ';
        layer.attr('style', mainStyle + respStyle);
      });

    }).on('sliderDidLoad', function(event, slider) {

      setTimeout(() => {
        /* Custom Thumb Navigation Select */
        var navDom = 'data-slide-go';
        var customNav = '.ls-custom-dot';
    
        var currentSlide = slider.slides.current.index; // current Slide index 
        var i = 1;
      
        // Set Attribute 
        vsHslide.find(customNav).each(function () {
          $(this).attr(navDom, i)
          i++
        // On Click Thumb, Change slide
          $(this).on('click', function (e) {
            e.preventDefault();       
            var sliderdsf = $(this).closest('.ls-container');
            var target = $(this).attr(navDom);
            sliderdsf.layerSlider(parseFloat(target));
          })
        });     
      
        // custom arrow js      
        vsHslide.find(".ls-custom-arrow").each(function () {
          $(this).on("click", function (e) {
            e.preventDefault();
            var gotarget = $(this).attr("data-change-slide");
            $(this).closest('.ls-container').layerSlider(gotarget);
          });
        });

        // Add class To current Thumb
        var currentNav = customNav + '[' + navDom + '="' + currentSlide + '"';
        $(currentNav).addClass('active');

      }, 1000);     
      
    }).on('slideChangeDidComplete', function( event, slider ) {
			var currentActive = slider.slides.current.index; // After change Current Index
      var currentNav = '.ls-custom-dot[data-slide-go="' + currentActive + '"';
      $(currentNav).addClass('active')
      .siblings().removeClass('active');			
    });

    // Custom Arrow 
    vsHslide.find('[data-ls-go]').each(function () {
      $(this).on('click', function (e) {
        e.preventDefault();
        var target = $(this).data('ls-go');
        vsHslide.layerSlider(target)
      });
    });

    vsHslide.layerSlider({
      allowRestartOnResize: true,
      maxRatio: (d('maxratio') ? d('maxratio') : 1),
      type: (d('slidertype') ? d('slidertype') : 'responsive'),
      pauseOnHover: (d('pauseonhover') ? true : false),
      navPrevNext: (d('navprevnext') ? true : false),
      hoverPrevNext: (d('hoverprevnext') ? true : false),
      hoverBottomNav: (d('hoverbottomnav') ? true : false),
      navStartStop: (d('navstartstop') ? true : false),
      navButtons: (d('navbuttons') ? true : false),
      loop: ((d('loop') === false) ? false : true),
      autostart: (d('autostart') ? true : false),
      height: (d('height') ? d('height') : 1080),
      responsiveUnder: (d('responsiveunder') ? d('responsiveunder') : 1220),
      layersContainer: (d('container') ? d('container') : 1220),
      showCircleTimer: (d('showcircletimer') ? true : false),
      skinsPath: 'layerslider/skins/',
      thumbnailNavigation: ((d('thumbnailnavigation') === false) ? false : true),
      globalBGImage: (d('globalbgimage') ? d('globalbgimage') : false),
      globalBGSize: (d('globalbgsize') ? d('globalbgsize') : false),
    });
  });




  /*----------- 10. Magnific Popup ----------*/
  /* magnificPopup img view */
  $('.popup-image').magnificPopup({
    type: 'image',
    gallery: {
      enabled: true
    }
  });

  /* magnificPopup video view */
  $('.popup-video').magnificPopup({
    type: 'iframe'
  });



  /*----------- 11. Blog Card Animation  ----------*/
  // $.fn.cardHoverAni = function (box) {
  //   $(this).each(function () {
  //     var $card = $(this), // Select Card
  //       textBox = $card.find(box); // Find Box under the card

  //     setTimeout(function(){
  //       textBox.css('display', 'none'); // HIde Box Default   
  //       $card.css('height', $card.height()); // Set A height of each Box
  //     }, 500)

  //     setTimeout(function () {
  //       // Put content bottom
  //       textBox.parent().css({
  //         'position': 'absolute',
  //         'left': '0',
  //         'right': '0',
  //         'bottom': '0'
  //       });
  //     }, 1000);

  //     // Event Call On Hover
  //     $card.on('mouseover', function () {
  //       textBox.slideDown(500);
  //     }).on('mouseleave', function () {
  //       textBox.slideUp(500);
  //     });
  //   });
  // };

  // if ($('.blog-card.card-animate').length) {
  //   $('.blog-card.card-animate').cardHoverAni('.text-box');
  // }



  /*---------- 12. Count Down ----------*/
  $.fn.countdown = function () {
    $(this).each(function () {
      var $counter = $(this),
        countDownDate = new Date($counter.data('offer-date')).getTime(), // Set the date we're counting down toz
        exprireCls = 'expired';

      // Finding Function
      function s$(element) {
        return $counter.find(element);
      }

      // Update the count down every 1 second
      var counter = setInterval(function () {
        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // If the count down is over, write some text 
        if (distance < 0) {
          clearInterval(counter);
          $counter.addClass(exprireCls);
          $counter.find('.message').css('display', 'block');
        } else {
          // Output the result in elements
          s$('.day').html(days + ' ')
          s$('.hour').html(hours + ' ')
          s$('.minute').html(minutes + ' ')
          s$('.seconds').html(seconds + ' ')
        }
      }, 1000);
    })
  }

  if ($('.offer-counter').length) {
    $('.offer-counter').countdown();
  }



  /*----------- 13. Section Position   ----------*/
  // Interger Converter
  function convertInteger(str) {
    return parseInt(str, 10)
  }
  
  $.fn.sectionPosition = function (mainAttr, posAttr) {   
    $(this).each(function () {
      var section = $(this);
      
      function setPosition (){
        var sectionHeight = Math.floor(section.height() / 2), // Main Height of section
        posData = section.attr(mainAttr), // where to position
        posFor  = section.attr(posAttr), // On Which section is for positioning  
        topMark = 'top-half', // Pos top
        bottomMark = 'bottom-half', // Pos Bottom
        parentPT = convertInteger($(posFor).css('padding-top')), // Default Padding of  parent
        parentPB = convertInteger($(posFor).css('padding-bottom')); // Default Padding of  parent

        if (posData === topMark) {
          $(posFor).css('padding-bottom', parentPB + sectionHeight + 'px');
          section.css('margin-top', "-" + sectionHeight + 'px');
        } else if (posData === bottomMark) {
          $(posFor).css('padding-top', parentPT + sectionHeight + 'px');
          section.css('margin-bottom', "-" + sectionHeight + 'px');
        }
      }
      setPosition(); // Set Padding On Load
    })
  }


  if ($('[data-sec-pos]').length) {
    $('[data-sec-pos]').sectionPosition('data-sec-pos', 'data-pos-for');
  }

  




  /*----------- 14. Member Details Toggle   ----------*/
  $('.member-angle-links .middle-icon').each(function(){
    $(this).on('click', function(e){
      e.preventDefault();
      $(this).toggleClass('active');
      $(this).parent().toggleClass('show');
    })
  })



  /*----------- 15. Tab Indicator ----------*/
  $.fn.indicator = function () {
    var $menu = $(this),
      $linkBtn = $menu.find('a'),
      $btn = $menu.find('button');
    // Append indicator
    $menu.append('<span class="indicator"></span>');
    var $line = $menu.find('.indicator');
    // Check which type button is Available
    if ($linkBtn.length) {
      var $currentBtn = $linkBtn;
    } else if ($btn.length) {
      var $currentBtn = $btn
    }
    // On Click Button Class Remove
    $currentBtn.on('click', function (e) {
      e.preventDefault();
      $(this).addClass('active');
      $(this).siblings('.active').removeClass('active');
      linePos()
    })
    // Indicator Position
    function linePos() {
      var $btnActive = $menu.find('.active'),
        $height = $btnActive.css('height'),
        $width = $btnActive.css('width'),
        $top = $btnActive.position().top + 'px',
        $left = $btnActive.position().left + 'px';
      $line.css({
        top: $top,
        left: $left,
        width: $width,
        height: $height,
      })
    }

    // if ($menu.hasClass('vs-slider-tab')) {
    //   var linkslide = $menu.data('asnavfor');
    //   $(linkslide).on('afterChange', function (event, slick, currentSlide, nextSlide) {
    //     setTimeout(linePos, 10)
    //   });
    // }
    linePos()
  }

  if ($('.product-tab').length) {
    $('.product-tab').indicator();
  }




  /*---------- 16. Quantity Adder ----------*/
  $('.quantity-plus').each(function () {
    $(this).on('click', function (e) {
      e.preventDefault();
      var $qty = $(this).siblings(".qty-input");
      var currentVal = convertInteger($qty.val());
      if (!isNaN(currentVal)) {
        $qty.val(currentVal + 1);
      }
    })
  });

  $('.quantity-minus').each(function () {
    $(this).on('click', function (e) {
      e.preventDefault();
      var $qty = $(this).siblings(".qty-input");
      var currentVal = convertInteger($qty.val());
      if (!isNaN(currentVal) && currentVal > 0) {
        $qty.val(currentVal - 1);
      }
    });
  })



  /*----------- 17. Woocommerce Toggle ----------*/
  // Woocommerce Rating Toggle
  $('.rating-select .stars a').each(function () {
    $(this).on('click', function (e) {
      e.preventDefault();
      $(this).siblings().removeClass('active');
      $(this).parent().parent().addClass('selected');
      $(this).addClass('active');
    });
  })



  /*----------- 18. Shop Big Image Src Set ----------*/
  if ($('.product-thumb').length) {
    $('.product-thumb').each(function () {
      $(this).on('click', function () {
        var src = $(this).find('img').data('big-img');
        $('.img-fullsize img').attr('src', src);
        $('.img-fullsize .popup-image').attr('href', src);
      })
    })
  }


   /*----------- 19. Filter Menu ----------*/
  $('.filter-active').imagesLoaded(function () {
    var $filter = '.filter-active',
      $filterItem = '.filter-item',
      $filterMenu = '.filter-menu-active';

    if ($($filter).length > 0) {
      var $grid = $($filter).isotope({
        itemSelector: $filterItem,
        filter: '*',
        masonry: {
          // use outer width of grid-sizer for columnWidth
          columnWidth: $filterItem
        }
      });

      // filter items on button click
      $($filterMenu).on('click', 'button', function () {
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({
          filter: filterValue
        });
      });

      // Menu Active Class 
      $($filterMenu).on('click', 'button', function (event) {
        event.preventDefault();
        $(this).addClass('active');
        $(this).siblings('.active').removeClass('active');
      });
    };
  });




   /*---------- 20. Date & Time Picker ----------*/
   // Time And Date Picker
   $('.dateTime-pick').datetimepicker({
     timepicker: true,
     datepicker: true,
     format: 'y-m-d H:i',
     hours12: false,
     step: 30
    });
    
    // Only Date Picker
    $('.date-pick').datetimepicker({
      timepicker: false,
      datepicker: true,
      format: 'm-d-y',
      step: 10
    });
    
    // Only Time Picker
    $('.time-pick').datetimepicker({
      datepicker: false,
      timepicker: true,
      format: 'H:i',
      hours12: false,
      step: 10
    });
    
    
    /*---------- 21. Parallax Effect ----------*/
    new universalParallax().init();

    
    /*---------- 22. WOW Js ----------*/
    var wow = new WOW({
      boxClass: 'wow',      // default
      animateClass: 'animated', // default
      offset: 0,          // default
      mobile: true,       // default
      live: true,        // default
      resetAnimation: false
    });
    wow.init();
 



  /*----------- 23. Woocommerce Toggle ----------*/
  // Ship To Different Address
  $('#ship-to-different-address-checkbox').on('change', function () {
    if ($(this).is(':checked')) {
      $('#ship-to-different-address').next('.shipping_address').slideDown();
    } else {
      $('#ship-to-different-address').next('.shipping_address').slideUp();
    }
  });

  // Login Toggle
  $('.woocommerce-form-login-toggle a').on('click', function (e) {
    e.preventDefault();
    $('.woocommerce-form-login').slideToggle();
  })

  // Coupon Toggle
  $('.woocommerce-form-coupon-toggle a').on('click', function (e) {
    e.preventDefault();
    $('.woocommerce-form-coupon').slideToggle();
  })

  // Woocommerce Shipping Method
  $('.shipping-calculator-button').on('click', function (e) {
    e.preventDefault();
    $(this).next('.shipping-calculator-form').slideToggle();
  })

  // Woocommerce Payment Toggle
  $('.wc_payment_methods input[type="radio"]:checked').siblings('.payment_box').show();
  $('.wc_payment_methods input[type="radio"]').each(function () {
    $(this).on('change', function () {
      $('.payment_box').slideUp();
      $(this).siblings('.payment_box').slideDown();
    })
  })

  // Woocommerce Rating Toggle
  $('.rating-select .stars a').each(function () {
    $(this).on('click', function (e) {
      e.preventDefault();
      $(this).siblings().removeClass('active');
      $(this).parent().parent().addClass('selected');
      $(this).addClass('active');
    });
  });



  /*----------- 24. Service Circle Toggle ----------*/
  
  if ($('.service-circle__item').length) {
    $('.service-circle__item').each(function(index){
      $(this).attr('data-tab-no', index)
    });
  
    $('.service-circle__menu li a').each(function (index) {
      let tabLink = $(this);
      tabLink.attr('data-tab-link', index);
  
      tabLink.on('click', function(e){
        e.preventDefault();
        let Tabcurrent = $(this).data('tab-link');
        $(this).parent().addClass('active').siblings().removeClass('active');
        $(`.service-circle__item[data-tab-no="${Tabcurrent}"]`).addClass('active')
        .siblings().removeClass('active');
      })
    });
  };



  /*----------- 25. Service Slider Active ----------*/
  $('.service-slider1').slick({
    dots: true,
    arrows: true,
    infinite: true,
    autoplay: false,
    fade: false,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: '<button type="button" class="slick-prev"><i class="far fa-long-arrow-left"></i></button>',
    nextArrow: '<button type="button" class="slick-next"><i class="far fa-long-arrow-right"></i></button>',
    appendArrows: $('#slidenav1'),
    appendDots: $('#slidenav1'),
    responsive: [{
      breakpoint: 1600,
      settings: {
          slidesToShow: 4,
        }
      }, {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
        }
      }, {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        }
      }, {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        }
      }, {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }, {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });

  $('.service-slider-7').slick({
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: false,
    fade: false,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [{
      breakpoint: 1600,
      settings: {
          slidesToShow: 2,
        }
      }, {
        breakpoint: 1400,
        settings: {
          slidesToShow: 2,
        }
      }, {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        }
      }, {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
        }
      }, {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }, {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });


  $('.specialist-slider').slick({
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [{
      breakpoint: 1600,
      settings: {
          slidesToShow: 4,
        }
      }, {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
        }
      }, {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        }
      }, {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        }
      }, {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }, {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });

  $('.banner-slider-v7').slick({
    autoplay: false,
    slidesToScroll: 1,
    slidesToShow: 1,
    arrows: false,
    draggable:true,
    dots: false
    }).slickAnimation();

  $('.banner-slide-eight').slick({
    autoplay: false,
    slidesToScroll: 1,
    slidesToShow: 1,
    arrows: false,
    draggable:true,
    dots: true,
    appendDots: $('#slidenav3')
    }).slickAnimation();

  $('.testi-slider').slick({
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: false,
    slidesToShow: 1,
    slidesToScroll: 1
  });

  $('.testi-slider-eight').slick({
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: false,
    slidesToShow: 1,
    appendDots: $('#slidenav4'),
    slidesToScroll: 1
  });




  /*----------- 00. Right Click Disable ----------*/
  // window.addEventListener('contextmenu', function (e) {
  //   // do something here... 
  //   e.preventDefault();
  // }, false);


  /*----------- 00. Inspect Element Disable ----------*/
  // document.onkeydown = function (e) {
  //   if (event.keyCode == 123) {
  //     return false;
  //   }
  //   if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
  //     return false;
  //   }
  //   if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
  //     return false;
  //   }
  //   if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
  //     return false;
  //   }
  //   if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
  //     return false;
  //   }
  // }


})(jQuery);