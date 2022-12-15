import { getAccounts } from "./requests.js";
import { availableIndex } from "./render.js";

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

// export const accountSwiper = new Swiper(".account-swiper", {
//   navigation: {
//     nextEl: ".account-swiper .swiper-button-next",
//     prevEl: ".account-swiper .swiper-button-prev",
//   },
//   slidesPerView: 3,
//   centeredSlides: true,
//   spaceBetween: 30,
//   on: {
//     slideChange: function () {
//       console.log(availableIndex);
//       const currentPayment = document.querySelector(".payment-selected");
//       const available = availableIndex.includes(this.realIndex)
//         ? "가능"
//         : "불가능";
//       currentPayment.textContent = `선택된 계좌: ${
//         bankMatch[this.realIndex]
//       } (${available})`;
//     },
//   },
// });
