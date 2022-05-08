var slider = function (sliderElement) {

    var pages = [];
    var currentSlide = 1;
    var isChanging = false;
    var keyUp = { 38: 1, 33: 1 };
    var keyDown = { 40: 1, 34: 1 };

    var init = function () {

        document.body.classList.add('slider__body');

        // control scrolling
        var whatWheel = 'onwheel' in document.createElement('div') ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
        window.addEventListener(whatWheel, function (e) {
            var direction = e.wheelDelta || e.deltaY;
            if (direction > 0) {
                changeSlide(-1);
            } else {
                changeSlide(1);
            }
        });

        // allow keyboard input
        window.addEventListener('keydown', function (e) {
            if (keyUp[e.keyCode]) {
                changeSlide(-1);
            } else if (keyDown[e.keyCode]) {
                changeSlide(1);
            }
        });

        // page change animation
        detectChangeEnd() && document.querySelector(sliderElement).addEventListener(detectChangeEnd(), function () {
            if (isChanging) {
                setTimeout(function () {
                    isChanging = false;
                    window.location.hash = document.querySelector('[data-slider-index="' + currentSlide + '"]').id;
                }, 400);
            }
        });

        // set up page and build visual indicators
    document.querySelector(sliderElement).classList.add('slider__container');
    var indicatorContainer = document.createElement('div');
    indicatorContainer.classList.add('slider__indicators');

    var index = 1;
    [].forEach.call(document.querySelectorAll(sliderElement + ' > *'), function (section) {

      var indicator = document.createElement('a');
      indicator.classList.add('slider__indicator')
      indicator.setAttribute('data-slider-target-index', index);
      indicatorContainer.appendChild(indicator);

      section.classList.add('slider__page');
      pages.push(section);
      section.setAttribute('data-slider-index', index++);
    });



        document.body.appendChild(indicatorContainer);
        document.querySelector('a[data-slider-target-index = "' + currentSlide + '"]').classList.add('slider__indicator--active');


        // stuff for touch devices
        var touchStartPos = 0;
        var touchStopPos = 0;
        var touchMinLength = 90;
        document.addEventListener('touchstart', function (e) {
            if (e.target.nodeName !== "BUTTON" && e.target.nodeName !== "A" && e.target.nodeName !== "IMG") {
                e.preventDefault();
            }
            if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
                var touch = e.touches[0] || e.changedTouches[0];
                touchStartPos = touch.pageY;
            }
        });
        document.addEventListener('touchend', function (e) {
            if (e.target.nodeName !== "BUTTON" && e.target.nodeName !== "A" && e.target.nodeName !== "IMG") {
                e.preventDefault();
            }
            if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
                var touch = e.touches[0] || e.changedTouches[0];
                touchStopPos = touch.pageY;
            }
            if (touchStartPos + touchMinLength < touchStopPos) {
                changeSlide(-1);
            } else if (touchStartPos > touchStopPos + touchMinLength) {
                changeSlide(1);
            }
        });
    };


    // prevent double scrolling
    var detectChangeEnd = function () {
        var transition;
        var e = document.createElement('foobar');
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        };

        for (transition in transitions) {
            if (e.style[transition] !== undefined) {
                return transitions[transition];
            }
        }
        return true;
    };


    // handle css change
    var changeCss = function (obj, styles) {
        for (var _style in styles) {
            if (obj.style[_style] !== undefined) {
                obj.style[_style] = styles[_style];
            }
        }
    };

    // handle page/section change
    var changeSlide = function (direction) {

        if (isChanging || (direction == 1 && currentSlide == pages.length) || (direction == -1 && currentSlide == 1)) {
            return;
        }

        // change page
        currentSlide += direction;
        isChanging = true;
        changeCss(document.querySelector(sliderElement), {
            transform: 'translate3d(0, ' + -(currentSlide - 1) * 100 + '%, 0)'
        });

        // change dots
        document.querySelector('a.slider__indicator--active').classList.remove('slider__indicator--active');
        document.querySelector('a[data-slider-target-index="' + currentSlide + '"]').classList.add('slider__indicator--active');
    };

    // go to spesific slide
    var gotoSlide = function (where) {
        var target = document.querySelector(where).getAttribute('data-slider-index');
        if (target != currentSlide && document.querySelector(where)) {
            changeSlide(target - currentSlide);
        }
    };

    // if page is loaded with hash, go to slide
    if (location.hash) {
        setTimeout(function () {
            window.scrollTo(0, 0);
            gotoSlide(location.hash);
        }, 1);
    };

    // we have lift off
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('onload', init(), false);
    }

    // expose gotoSlide function
    return {
        gotoSlide: gotoSlide
    }
};
slider('.slides');

// global variables
const navMenu = document.querySelector('.nav-menu')
const nav = document.querySelector('nav')
const hamburger = document.querySelector('#hamburger')
const navLinks = document.querySelectorAll('.nav-link')
const flip_card_buttons = document.querySelectorAll('.services-btn')
const contact_buttons = document.querySelectorAll('.contact-button')
const gallery_buttons = document.querySelectorAll('.gallery-btn')

// change hamburger menu
const navAction = () => {
    navMenu.classList.toggle('active')
    nav.classList.toggle('active')
    hamburger.classList.toggle('active')
    setTimeout(() => {
        hamburger.classList.toggle('closing')
    }, 200);
}

hamburger.addEventListener('click', () => navAction())

navLinks.forEach(link => link.addEventListener('click', () => navAction()));

// mouse or touch
const is_touch_enabled = () => {
    return ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0);
}

// add classes for styling touch devices
if (is_touch_enabled()) {
    flip_card_buttons.forEach(btn => btn.classList.remove('hide'));
    gallery_buttons.forEach(btn => btn.classList.remove('hover'));
} else {
    flip_card_buttons.forEach(btn => btn.classList.add('hide'));
    gallery_buttons.forEach(btn => btn.classList.add('hover'));
}

// add random colors to contact buttons
// const random = (items) => items[Math.floor(Math.random() * items.length)];
// const colors = ['#CD32CD', '#6d00ff', 'violet', 'orangered', 'aqua', 'teal', 'rgb(41, 180, 221)', 'rgb(221, 82, 41)', '#4592ba', '#45BAA7', '#BA4592', 'green', 'rgb(111, 218, 68)', 'rgb(1, 101, 225)', 'rgb(23, 169, 253)', 'rgb(50,205,50)'];

// contact_buttons.forEach(button => {
//     button.style.setProperty('background-color', random(colors));
// });