'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

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

/* ~~Implementing smooth scrolling~~~
 */

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect(); //returns rect cordinates of "learn more"
  console.log(s1coords);
  //the distance between current top site to "learn more"
  console.log(e.target.getBoundingClientRect());
  //the distance from the top edge to the "learn more "
  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport(web resolution)',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // //Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  //adding smooth animation (but its old school)
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //but we can use this scrollintoview (only for new web browsers!)
  section1.scrollIntoView({ behavior: 'smooth' });
});
///////////////////////////////////////////////////

//Page navigation

//it works but the eventhandler deals with each of element so it wont be
//efficent if we will use it on 1000 elements (working but not effiecent):
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     //href in html already has the links to where we need to scroll
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//so we will do event delegation!
//1.Add event listener to common parent elemnt
//2.Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //Matching startegy
  if (e.target.classList.contains('nav__link')) {
    //href in html already has the links to where we need to scroll
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed componant:

tabsContainer.addEventListener('click', function (e) {
  //were doing the closest func bcuz if we click the elemtns in the button we wont get
  //what we want and we want the data of the button itself so closest allways gives up
  //the operation tab
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return; //avoid nulls (Guard clause) (null happens if we click the container and not the buttons)

  //Remove active Classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Activate tab
  clicked.classList.add('operations__tab--active');

  //Activate Content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu fade animation
//~~~~~~~~~~~~~~~~~~~
const handleHover = function (e) {
  //checking if the element under nav is a nav_link
  if (e.target.classList.contains('nav__link')) {
    const link = e.target; //the link we looked on
    const siblings = link.closest('.nav').querySelectorAll('.nav__link'); //we go up to the closest parent to nav to choose the link's siblings
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el != link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//Passing arguments to eventHandler (notice that the opacity in the func is "This")
//we can even pass an array to "This " and than use it..

nav.addEventListener('mouseover', handleHover.bind(0.5));
//mouseout the opposite of mouseover
nav.addEventListener('mouseout', handleHover.bind(1));
//~~~~~~~~~~~~~~~~~~~~~~~~~

//Sticky navigation
//~~~~~~~~~~~~~~~~~~~~~~~~~

//NOT a good way cuz ScrollY spamms:

// const intialCoords = section1.getBoundingClientRect(); //the coards of section1

// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);
//   if (window.scrollY > intialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
//

//So this is the Good way : Intersection Observer API

//Exmaple :
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// }; //entries contains the threshold value (can be array)

// const obsOpstions = {
//   root: null, //root - the element that the target intersecting
//   threshold: [0, 0.2], //this value decides when the observer function happens (if we get in the target by its percentage =isIntercenting=true, else false )
// };
// const observer = new IntersectionObserver(obsCallback, obsOpstions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries; //like entries[0]
  if (!entry.isIntersecting) nav.classList.add('sticky');
  //using isIntersecting
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, //for marging when scrolling the exactly height of nav
});
headerObserver.observe(header);
//~~~~~~~~~~~~~~~~~~~~

//Reveal Sections (using intersect API )

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); //stop observing after doing what the observer needed
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});
//~~~~~~~~~~~~~~~~~~~~~~

//Optimizing imgs - Lazy loading images technique
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// so this technique  basically goes like this :
// we take the pic in small resulution and place it with blur 20px (lazy pic class)
//and than we replace it with the actual big img when the observer gets it
// we place the "lazy pics" in data attribute (data-src )
const imgTargets = document.querySelectorAll('img[data-src]'); //selecting all the elemnets with img with data-src (the lazy)
console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  //if we do it than it will show the pic after finish loading!(will stay lazy(blurred) until loaded )
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(img => {
  imgObserver.observe(img);
});
//~~~~~~~~~~~~~~~~~~~

//Building Slider Component!
//~~~~~~~~~~~~~~~~~~~~~~~~~~

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let curSlide = 0;
const maxSlide = slides.length;
const dotContainer = document.querySelector('.dots');

//those are only to help see visualy what i do
// const slider = document.querySelector('.slider');
// slider.style.transform = ` scale(0.2) translateX(-1200px)`;
// slider.style.overflow = ` visible`;

//creating dots
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class ="dots__dot" data-slide="${i}"></button>`
    );
  });
};

//Active dot mark
const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
//the pictures sit above each other.. so we set each of them transform= translateX (0%,100%,200%)..
const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};
//initialize pictures one next to other
createDots();
goToSlide(0);
activateDot(0);

//Setting buttons
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  else if (e.key === 'ArrowRight') nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    //distructoring : slide= e.target.dataset.slide (same)
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/* ~~Selecting, Creating, and Deleting elements~~~
 

console.log(document.documentElement); //showing the html code (Dom tree)
console.log(document.head);
console.log(document.body);

//selecting element with document by class (we learnd )
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

//getting elemnt by id
document.getElementById('section--1');
//using getelementsbytagname gives html collection - very important
// because if we want to delete or change it will update in the collection
//not like query selector who gives nodelist (not changing)
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

//also gives htmlCollection
console.log(document.getElementsByClassName('btn'));

//  ~~~~Creating and inserting elements

// we learned how to create element using insertAdjacentHTML:
/*
const html = `
<div class="movements__row">
  <div class="movements__type movements__type--${type}">${
i + 1
} ${type}</div>
<div class="movements__date">${displayDate}</div>
  <div class="movements__value">${formattedMov}</div>
</div>
`;

containerMovements.insertAdjacentHTML('afterbegin', html);


//using CreateElemnt
const message = document.createElement('div');
message.classList.add('cookie-message');
message.textContent =
  'We use cookies for improved functionality and analytics.';
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class ="btn btn--close-cookie">Got it!</button>';
//header.prepend(message); //inserting as the first child
header.append(message); //inserting as last child - we can see that after prepend it didnt make new one only one can be(message) so it just moved
//header.append(message.cloneNode(true)); //cloning the element and put in the end

//inserting the message element before header
//header.before(message);

//inserting the message elemnt after header
//header.after(message);

//Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

/* ~~Styles,Attributs, and Classes~~~
 

//Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

//we can see only inline styles we setted if we choose style.
console.log(message.style.color); //cant
console.log(message.style.backgroundColor); // we can

//so we can do this:
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

//set css properties (we want to change properties that are in document (root class))
document.documentElement.style.setProperty('--color-primary', 'orangered');

//Attributs (src,alt,class, id...) in html

const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';
//Non-standart attribute
console.log(logo.designer); // cant read cuz its not standart property
console.log(logo.getAttribute('designer')); //we can get attribute like this!
//and we can set attribute like this
logo.setAttribute('company', 'Bankist');

//the difference with src/link
console.log(logo.src); //here we get the absolute src
console.log(logo.getAttribute('src')); //here the relative src
const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

//Data attributes --data is special we can read like this!
console.log(logo.dataset.versionNumber);

//Classes
logo.classlist.add('c', 'j');
logo.classlist.remove('c', 'j');
logo.classlist.toggle('c'); //if exists remove and retur flase if not exist adds and reutrns true
logo.classlist.contains('c');



/* ~~Types of events and event handlers ~~~
 
const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great!  You are reading the heading!:D');
};

//mouseenter - fires whenever a mouse enters a certain element

h1.addEventListener('mouseenter', alertH1);

//removing the handler after 3 sec
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

//we can do it also like this(for all the other events either):
//notice: its OLD WAY - now we use addeventlistener
// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great!  You are reading the heading!:D');
// };

//addEvenetlistener vs element.'Event
//so AddEventListener is better bcuz of 2 things:
//1.u can put multiply events in the same handler
//2.u can stop the handler when u need
*/

/* ~~Event propagation and bubbling  ~~~

the thing is that when we have an event it goes throuh the 
dom structure to the target (through all the parents of the targer)(caputring phase)
and when it reaches (target phase) it goes all the way back through its parents to the document node (root)
(Bubbling event)

the thing that we understand is that when we make an event on an elemnt 
we can manipulate its parents on the way either!
the propagation happens in addeventlistener in the bubbling phase BUT we can set third paramete "TRUE" and it will turn to capturing phase
~~
~~

//exmaple for propagation

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)}) `;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);

  //we can stop Propagation
  //e.stopPropagation();
});
//parent of nav__link
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});
//parent of nav__links
document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});

/* ~~DOM Traversing - traveling thorugh the DOM  ~~~


const h1 = document.querySelector('h1');

//Going downwards :child

console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes); //gives all child nodes (even comments,text)
console.log(h1.children); //htmlCollection of all the child elements! (live collection)
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

//Going upwards: Parents
console.log(h1.parentNode);
console.log(h1.parentElement);

//Selecting the closest header to our h1 (very good for event delegation!)
h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

//Going sideways:siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/

/* ~~~~~~ usefull LifeCycle DOM events ~~~~~~
 

//shows when the dom tree finished to build
//usually we would think that all of our code need to be in this eventlistener
//but no need!! because our Script tag in the HTML is in the end of the code
//so the dom Tree build itslef and right after the js code runs.
document.addEventListener('DOMcontentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

//shows when the page finished loading ( we used it on the pics! )
window.addEventListener('load', function (e) {
  console.log('page fully loaded', e);
});

//shows when the user wants to leave the page
//example for using : asking the user if he's sure he wants to get out
//of the webpage
window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});
*/
