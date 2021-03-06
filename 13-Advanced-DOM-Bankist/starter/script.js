'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const section1 = document.querySelector('#section--1');
const sections = document.querySelectorAll('.section');

const header = document.querySelector('.header');
const h1 = document.querySelector('h1');
const nav = document.querySelector('.nav');
const navLogo = document.querySelector('.nav__logo');
const containerNavLinks = document.querySelector('.nav__links');
const navLinks = document.querySelectorAll('.nav__link');

const lazyImages = document.querySelectorAll('img[data-src]');

const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const containerDots = document.querySelector('.dots');

const containerTabs = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////////////////////
// nav menu fade animation
///////////////////////////////////////////////////////
//delegate events on the logo and links to the nav container
const handleHover = function (e, opacity) {
  const current = e.target;
  if (current.classList.contains('nav__link')) {
    const links = selectFadeLinks(current);
    fade(current, opacity, ...links);
  }
};
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});
nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1.0);
});

const selectFadeLinks = function (current) {
  const siblings = current.closest('.nav').querySelectorAll('.nav__link');
  const logo = current.closest('.nav').querySelector('img');
  return [logo, ...siblings];
};

const fade = function (current, opacity, ...elements) {
  elements.forEach(el => {
    // debugger;
    if (el !== current) el.style.opacity = opacity;
  });
};
///////////////////////////////////////////////////////
// sticky navigation
///////////////////////////////////////////////////////

//uneficient way: listening for scroll event
//the scroll event is fired too many times & low end machines this might have a negative impact on the page performance
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
// });

//more efficient way: using the intersection observer API
const handleStickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const toggleStickyNav = function () {};
const navHeight = nav.getBoundingClientRect().height;

const headerObserver = new IntersectionObserver(handleStickyNav, {
  root: null,
  threshold: 0.0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);
///////////////////////////////////////////////////////
// modal window
///////////////////////////////////////////////////////
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////////
// smooth scrolling "learn more" button
///////////////////////////////////////////////////////

btnScrollTo.addEventListener('click', e => {
  // const section1Coords = section1.getBoundingClientRect();
  // console.log(section1Coords);
  // e.target.style.backgroundColor = '#0f0';
  // console.log(e.target.getBoundingClientRect());
  // console.log(`current scroll: (${window.pageXOffset},${window.pageYOffset})`);
  // console.log(
  //   `viewport width, height: ${document.documentElement.clientWidth},${document.documentElement.clientHeight}`
  // );

  //old way of doing smooth scrolling
  // window.scrollTo({
  //   left: section1Coords.left + window.pageXOffset,
  //   top: section1Coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //new way of doing smooth scrolling
  section1.scrollIntoView({ behavior: 'smooth' });
});
///////////////////////////////////////////////////////
// page navigation using event delegation
///////////////////////////////////////////////////////
// // unefficient way: adding identical event handlers to elements

// navLinks.forEach(function (link) {
//   link.addEventListener('click', function (e) {
//     e.preventDefault();
//     const destElementID = this.getAttribute('href');
//     document
//       .querySelector(destElementID)
//       .scrollIntoView({ behavior: 'smooth' });
//   });
// });

// // efficient way, using event delegation
containerNavLinks.addEventListener('click', function (e) {
  e.preventDefault();
  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});
///////////////////////////////////////////////////////
// tabbed component
///////////////////////////////////////////////////////
containerTabs.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  //Guard clause
  if (!clicked) return;

  highlightTab(tabs, clicked);

  showTabContent(selectTabContent(clicked));
});

const highlightTab = function (tabs, clicked) {
  //reset all tabs active class before adding it
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
};

const selectTabContent = function (clicked) {
  return document.querySelector(`.operations__content--${clicked.dataset.tab}`);
};
const showTabContent = function (tabContent) {
  tabsContent.forEach(tc => tc.classList.remove('operations__content--active'));
  tabContent.classList.add('operations__content--active');
};
///////////////////////////////////////////////////////
// Reveal sections upon scrolling into them
///////////////////////////////////////////////////////
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
sections.forEach(s => {
  s.classList.add('section--hidden');
  sectionObserver.observe(s);
});
///////////////////////////////////////////////////////
// Lazy loading images
///////////////////////////////////////////////////////

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //Replace src with data-src
  const img = entry.target;
  img.src = entry.target.dataset.src;

  img.addEventListener('load', () => {
    img.classList.remove('lazy-img');
  });

  observer.unobserve(img);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.0,
  rootMargin: `200px`,
});

lazyImages.forEach(img => imgObserver.observe(img));

///////////////////////////////////////////////////////
// Slider component
///////////////////////////////////////////////////////

///////////////////////////////////////////////////////
// LECTURES
///////////////////////////////////////////////////////
// **********************************************
//selecting nodes
// **********************************************
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const sections = document.querySelectorAll('.section');
// console.log(sections);

// const buttons = document.getElementsByTagName('button');
// console.log(buttons);

// **********************************************
// creating & inserting nodes
// **********************************************
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent =
//   'We use cookies to provide improved functionality & analytics';
message.innerHTML =
  'We use cookies to provide improved functionality & analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
header.append(message);
// const [, , , openAcc1] = document.querySelectorAll('a');
// header.append(openAcc1);

// **********************************************
// Deleting nodes
// **********************************************
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', () => message.remove());

document.documentElement.style.setProperty('--color-primary', 'purple');

//**********************************************
// styles
// **********************************************
message.style.backgroundColor = '#37383d';
// console.log(message.style.height);
// console.log(getComputedStyle(message));
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

//**********************************************
// attributes
// **********************************************
// const logo = document.querySelector('.nav__logo');

// console.log(logo.alt);
// console.log(logo.className);

// console.log(logo.src);
// console.log(logo.getAttribute('src'));

// //data attributes
// console.log(logo.dataset.versionNumber);

//**********************************************
// implementing event listeners
// **********************************************
// const h1Alert = () => {
//   alert("You're reading the heading");
//   h1.removeEventListener('mouseenter', h1Alert);
// };
// h1.addEventListener('mouseenter', h1Alert);

//**********************************************
// event propagation
// **********************************************
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// // link1.addEventListener('click', e => {
// //   console.log(this);//the mistke here is that arrow functions dont get a this keyword
// //   this.style.backgroundColor = randomColor();
// // });

// //The click event is generated in the root of the DOM tree
// //event travels down the DOM tree to the target element
// navLinks.forEach(function (link) {
//   link.addEventListener('click', function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log(e.target, e.currentTarget);
//     e.stopPropagation();
//   });
// });
// //after its target phase, the event bubbles up to the root node, document.
// //if we attach an event listener for the same type of event on each of the
// //event target parent elements, the event will be handled by them as well as
// //it travels up through the DOM tree
// containerNavLinks.addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target, e.currentTarget);
// });
// nav.addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target, e.currentTarget);
// });
// document.body.addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target, e.currentTarget);
// });

//**********************************************
// DOM traversing
// **********************************************
// // DOWNWARDS TRAVERSING
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// //UPWARDS TRAVERSING
// console.log(h1.parentNode);
// console.log(h1.parentElement);
// h1.closest('header').style.background = 'var(--gradient-secondary)';

// //SIDEWAYS TRAVERSING
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// if (h1.previousElementSibling)
//   h1.previousElementSibling.style.background = 'var(--gradient-primary)';
// if (h1.nextElementSibling)
//   h1.nextElementSibling.style.background = 'var(--gradient-primary)';

// const link1 = navLinks[1];
// navLinks.forEach(function (l) {
//   if (l !== link1) l.style.color = 'white';
// });

// h1.firstElementChild.addEventListener('click', function () {
//   this.textContent = `${310 - 194}`;
// });

//**********************************************
// intersection observer API
// **********************************************
// section1.style.backgroundColor = 'lightblue';
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };
// const obsOptions = {
//   root: null,
//   threshold: [0.0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

// **********************************************
// generic slider component
// **********************************************

// slider.style.transform = 'scale(0.3)';
// slider.style.overflow = 'visible';

const buildSlider = function () {
  let currentSlide = 0;
  const slideN = slides.length;

  const init = function () {
    createDots();
    translateSlides(currentSlide, slides);
  };

  const createDots = function () {
    slides.forEach(function (_, i) {
      containerDots.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const highlightDot = function (currentSlide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });
    //select the dot whose data-slide matches the current slide
    //add the dots__dot--active class to it
    document
      .querySelector(`.dots__dot[data-slide="${currentSlide}"]`)
      .classList.add('dots__dot--active');
  };
  const translateSlides = function (currentSlide, slides) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
    });
    highlightDot(currentSlide);
  };

  const nextSlide = function () {
    if (currentSlide === slideN - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    translateSlides(currentSlide, slides);
  };
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = slideN - 1;
    } else {
      currentSlide--;
    }
    translateSlides(currentSlide, slides);
  };

  init();

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    else if (e.key === 'ArrowLeft') prevSlide();
  });
  //delegate slider dot events to the dots parent container
  containerDots.addEventListener('click', function (e) {
    //matching strategy to listen for click events on dots, but not on the
    //parent container
    if (e.target.classList.contains('dots__dot')) {
      currentSlide = Number(e.target.dataset.slide);
      translateSlides(currentSlide, slides);
    }
  });
};

buildSlider();

// **********************************************
// Lifecycle DOM events
// **********************************************
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!');
});
window.addEventListener('load', function (e) {
  console.log(e);
});
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
