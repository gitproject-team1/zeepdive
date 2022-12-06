export const swiper = new Swiper(".mySwiper1", {
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  loop: 'ture',
  pagination: {
    el: ".swiper-pagination",
    type: "fraction",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
