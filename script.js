"use strict";

///////////////////////////////////////
// Modal window
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

const openModal = function (e) {
  e.preventdefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
// ----------- features --------------
// Button scrolling --> for scrolling to next section we need co-ordinate of next section getBoundingClientRect() gives cordinate of next section
btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords); // cordinates ha section 1 ke aur cordinates relative hote hai view port ke hisab se codinate change ho jage hai
  // console.log(e.target);
  console.log(e.target.getBoundingClientRect()); // another way of geeting cordiante

  console.log("Current scroll (X/Y)", window.pageXOffset, window.pageYOffset);
  console.log("Current scroll (X/y)", window.scrollX, window.scrollY); // same thing as above

  console.log(
    // viewPort jo dikh raha ha uski height and width kya ha
    "height/width viewport",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: "smooth" });
});

//  ------------ Page navigation ----------------
// this is  EVENT DELIGATION
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// TWO STEPS OF EVENT DELIGATION
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  console.log(e.target);
  // e.target is the actual point in .nav__links where the click happens
  // Matching strategy => ham chahe te hai ki tabhi scrolling ho jab nav__link pe clicj ho na ki nav__links pe yahi match karrna ha ki click nav__link pe hona chaiye
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//  ----------------- Tabbed component --------------------
// tabs.forEach(t => t.addEventListener('click', () => console.log("tab"))); aise bhi tab ko use kar sakte hai not efficient

// event deligaiton ki tarah karte hai
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");
  console.log(clicked);
  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  // Activate tab
  clicked.classList.add("operations__tab--active");

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// ---------- Menu fade animation ---------
const handleHover = function (e) {
  console.log(this, e.target); // this keyword is pointing at the argument we passed throgh bind but e.target will be attached to .nav where we attached the eventHandler
  // mathching the target
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// Passing "argument" into handler
//.bind, binds this keyword to the argument we are passing on for ex at 0.5 or at 1
nav.addEventListener("mouseover", handleHover.bind(0.5)); // mouseover will make nav bubbel up
nav.addEventListener("mouseout", handleHover.bind(1)); // mouseout is opposite of mouseover

// nav.addEventListener('mouseover', function(e) {
//   handleHover(e,0.5);
// });
// nav.addEventListener('mouseover', function(e) {
//   handleHover(e,1);
// });

// ------------ Sticky navigation ------------
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// -------- sticky navigation a better way -------------

// Sticky navigation: Intersection Observer API

// INTERSECTION OBSERVER OF API
// const obsCallBack = function(entries, observer)// jaise hi obsOption true hoga means ki section1 viewport pe 10% se jayada dikhega to ye kaam karna ha
// {
//  entries.forEach(entry => {
//   console.log(entry);
//  })
// }
// const obsOption = {
//   root : null, // VIEW port ko dekh ke batana ha ki intersection kitna ha section 1 ka viewPort se
//   threshold : 0.1,// 0.1 is ki 10% area of section 1 jab viewport pe aaye to interSection Observer console mein dikhe
// };

// const observer = new IntersectionObserver(obsCallBack, obsOption); // intersection observer call
// observer.observe(section1);//observer is observing section 1

// concept ends now implemwnting the logic

// jab header 0% ho view port par tab muche nav bar ka sticky nature chaiye
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height; // checking the height of nav bar

const stickyNav = function (entries) {
  // console.log(entries);
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // header ki kitni height bachi to tab nav baar sticky ho
});
headerObserver.observe(header);

// ----------------- Reveal sections -----------------------
// All section has a class section--hidden my aim to remove these class
const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//------------------ Lazy loading images -------------------------
const imgTargets = document.querySelectorAll("img[data-src]"); // vo sari img imgTarget mein store kar di jiske pass dataset data-src ha mtlb ki vo images jo ki lazy loaded ha use ep loadImg function call hoga

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img"); // isi class ek karan images blur dikh rahi ha
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

//--------- Slider --------------
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  // const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  // const createDots = function () {
  //   slides.forEach(function (_, i) {
  //     dotContainer.insertAdjacentHTML(
  //       "beforeend",
  //       `<button class="dots__dot" data-slide="${i}"></button>`
  //     );
  //   });
  // };

  // const activateDot = function (slide) {
  //   document
  //     .querySelectorAll(".dots__dot")
  //     .forEach((dot) => dot.classList.remove("dots__dot--active"));

  //   document
  //     .querySelector(`.dots__dot[data-slide="${slide}"]`)
  //     .classList.add("dots__dot--active");
  // };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

// Next slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
  // activateDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  // activateDot(curSlide);
};

const init = function () {
  goToSlide(0);
  // createDots();

  // activateDot(0);
};
init();

btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") prevSlide();
  e.key === "ArrowRight" && nextSlide();
});

// dotContainer.addEventListener('click', function (e) {
//   if (e.target.classList.contains('dots__dot')) {
//     // BUG in v2: This way, we're not keeping track of the current slide when clicking on a slide
//     // const { slide } = e.target.dataset;

//     curSlide = Number(e.target.dataset.slide);
//     goToSlide(curSlide);
//     activateDot(curSlide);
//   }
// });
};
slider();

// ------------- LEARNING ------------------------
//---------------- Selecting, Creating, and Deleting Element -------------
// Selecting elements
// console.log(document.documentElement); //will select whole html
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section'); // this makes a nodelist which is update nahi hoti
// console.log(allSections);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn')); // this makes a html collection jo ki auto update hoti ha

// // ------------------- Creating and inserting elements ---------------
// const message = document.createElement('div'); // this will create a div tag for html
// message.classList.add('cookie-message');
// message.textContent = 'We use cookied for improved functionality and analytics.';
// message.innerHTML =
// 'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message);
// header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// Delete elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     // message.remove();
//     message.parentElement.removeChild(message);
//   });

// ------------ styles Attribute and Classes ---------------------------------
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%'; // these are inline styles

// console.log(message.style.color); // will not show anything only inline style can be shown by this way
// console.log(message.style.backgroundColor); // inline style ha isiliye show ho rahaa ha

// console.log(getComputedStyle(message).color); // .coloR nahi likhenge to sari property show hogi meassage div ki
// console.log(getComputedStyle(message).height); // hamne height nahi di ha par browser ne di ha to ye show hoga console mein because it is computed style

// setting height of message div
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// // Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.className);

// logo.alt = 'Beautiful minimalist logo';// changing img attribute from js

// // Non-standard
// console.log(logo.designer); // this is not standard HTML attribute so can't acces this way
// console.log(logo.getAttribute('designer')); // accessing a non standard attribute from js
// logo.setAttribute('company', 'Bankist');

// console.log(logo.src);
// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// // Data attributes
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add('c', 'j');
// logo.classList.remove('c', 'j');
// logo.classList.toggle('c');
// logo.classList.contains('c'); // not includes

// // Don't use
// logo.clasName = 'jonas';

// ---------------Types of Events and Event Handlers------------------------
// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('addEventListener: Great! You are reading the heading :D');
//   // h1.removeEventListener('mouseenter',alertH1); // REMOVING A EVENT LISTNER
// };

// h1.addEventListener('mouseenter', alertH1); // mouseenter is a hover just like in css jaise hi mouse h1 pe jaiga alert aa jaiga

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great! You are reading the heading :D');
// };

// //  ----------- Event Propagation in Practice --------------
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor(); // apply random color to this keyword -> this keyword with Event listner is attached on .nav__link
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);  //e.currentTarget is same as this keyword

//   // Stop propagation
//   // e.stopPropagation(); // not a good to stop like this
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget); // e is same as above as event bubbling
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);// e is same as above as event bubbling
// });

// //  --------------- DOM Traversing -------------
// const h1 = document.querySelector('h1');

// // Going downwards: means getting the child nodes
// // querySelector can be used with elements not only documents
// console.log(h1.querySelectorAll('.highlight')); // seclect all the chid the child nodes of h1
// console.log(h1.childNodes);// seclect only the direct child of h1
// console.log(h1.children); // seclect the tags of h1 , h1 ke direct children
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// // Going upwards: Selecting Parents
// console.log(h1.parentNode); // direct parent
// console.log(h1.parentElement);

// // closest find the parent not the direct parent, no matter how far up closest has to go
// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// h1.closest('h1').style.background = 'var(--gradient-primary)';

// // Going sideways: Selecting  siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

///////////////////////////////////////
//-------  Lifecycle DOM Events ----------
// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed and DOM tree built!', e);
// });

// window.addEventListener('load', function (e) {
//   console.log('Page fully loaded', e);
// });

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });

// slider for my revision => not working poperely just for understanding
// const slides = document.querySelectorAll(".slide");
//   const btnLeft = document.querySelector(".slider__btn--left");
//   const btnRight = document.querySelector(".slider__btn--right");

// let curSlide = 0;
// const maxSlide = slides.length;
// const slider = document.querySelector(".slider");
// slider.style.transfrom = "scale(0.4) translateX(-800px)";
// slider.style.overflow = "visible";

// const goToSlide = function (slide) {
//       slides.forEach(
//         (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
//       );
//     };
// goToSlide(0);
//   // Next slide
//   const nextSlide = function () {
//     if (curSlide === maxSlide - 1) {
//       curSlide = 0;
//     } else {
//       curSlide++;
//     }

//     goToSlide(curSlide);
//   };

//   const prevSlide = function () {
//     if (curSlide === 0) {
//       curSlide = maxSlide - 1;
//     } else {
//       curSlide--;
//     }
//     goToSlide(curSlide);
//   };
// btnLeft.addEventListener("click", prevSlide);
// btnRight.addEventListener("click",nextSlide);
