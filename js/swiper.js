export const swiper = new Swiper(".mySwiper1", {
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  loop: "true",
  pagination: {
    el: ".swiper-pagination",
    type: "fraction",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

export const accountSwiper = new Swiper(".account-swiper", {
  loop: "true",
  pagination: {
    el: ".account-swiper .swiper-pagination",
    type: "fraction",
  },
  navigation: {
    nextEl: ".account-swiper .swiper-button-next",
    prevEl: ".account-swiper .swiper-button-prev",
  },
  slidesPerView: 3,
});
