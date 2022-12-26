//메인페이지
export const itemimgEls = document.querySelectorAll(".itemlist-image > img");
export const itemTagsEls = document.querySelectorAll(".itemlist-tag");
export const itemTitleEls = document.querySelectorAll(".itemlist-title");
export const itemPriceEls = document.querySelectorAll(".itemlist-price");

export const userInfoEl = {
  userInfoName: document.getElementById("user-info-name"),
  nameChangeBtn: document.querySelector(".name-change-btn"),
  userInfoPw: document.getElementById("user-info-pwd"),
  userInfoNewPw: document.getElementById("user-info-new-pwd"),
  pwChangeBtn: document.querySelector(".pw-change-btn"),
  userModal: document.querySelector(".user-modal"),
  userModalBtn: document.querySelector(".user-modal-btn"),
  userModalContent: document.querySelector(".user-modal-content"),
  userInfoBtn: document.querySelector(".user-info-btn"),
};

// page elements
export const pageEl = {
  detailPageEl: document.querySelector(".detail-page"),
  mainPgEl: document.querySelector(".main-page"),
  adminPgEl: document.querySelector(".admin-page"),
  userPgEl: document.querySelector(".user-page"),
  categorypgEl: document.querySelector(".category-page"),
  purchasepgEl: document.querySelector(".purchase-page"),
  cartPgEl: document.querySelector(".cart-page"),
  qnaPgEl: document.querySelector(".qna-container-page"),
  receiptPgEl: document.querySelector(".receipt-page"),
};

// signup elements
export const signupEl = {
  submitEl: document.getElementById("frm"),
  emailInputEl: document.getElementById("signup-email"),
  passwordInputEl: document.getElementById("signup-pw"),
  passwordcheckEl: document.getElementById("signup-repw"),
  displayNameInputEl: document.getElementById("signup-name"),
  signupErrorBox: document.querySelector(".signup-error-box"),
  emailOverlapError: document.querySelector(".email-overlap-error"),
};

// login elements
export const loginEl = {
  loginErrorBox: document.querySelector(".login-error-box"),
  loginBtn: document.querySelector(".login-btn"),
  loginId: document.querySelector(".login-id"),
  loginPw: document.querySelector(".login-pw"),
  idboxEl: document.querySelector(".id-box"),
};

// signup, login modal elements
export const loginModalEl = {
  loginBtnEl: document.querySelector(".login"),
  backGround: document.querySelector(".back-ground"),
  loginModal: document.querySelector(".login-modal"),
  signupModal: document.querySelector(".signup-modal"),
};

// validation elements
export const validationEl = {
  emailErrorMsg: document.querySelector(".email-error-msg"),
  signupEmailBox: document.querySelector(".signup-email-box"),
  pwErrorMsg: document.querySelector(".pw-error-msg"),
  signupPwBox: document.querySelector(".signup-pw-box"),
  signupRepwBox: document.querySelector(".signup-repw-box"),
  pwLengthMsg: document.querySelector(".pw-length-msg"),
  idErrorMsg: document.querySelector(".id-error-msg"),
  exptext: /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/,
};

//상세페이지
export const detailContainer = document.querySelector(".detail-container");

// 검색기능
//search elements
export const searchForm = document.querySelector(".search-box");
export const searchInput = document.getElementById("search-main");

// 로딩 el
export const loadEl = document.querySelector(".loader");
