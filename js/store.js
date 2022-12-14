//메인페이지
export const itemimgEls = document.querySelectorAll(".itemlist-image > img");
export const itemTagsEls = document.querySelectorAll(".itemlist-tag");
export const itemTitleEls = document.querySelectorAll(".itemlist-title");
export const itemPriceEls = document.querySelectorAll(".itemlist-price");

// signup elements
export const submitEl = document.getElementById("frm");
export const emailInputEl = document.getElementById("signup-email");
export const passwordInputEl = document.getElementById("signup-pw");
export const passwordcheckEl = document.getElementById("signup-repw");
export const displayNameInputEl = document.getElementById("signup-name");
export const signupErrorBox = document.querySelector(".signup-error-box");

// login elements
export const loginErrorBox = document.querySelector(".login-error-box");
export const loginBtn = document.querySelector(".login-btn");
export const loginId = document.querySelector(".login-id");
export const loginPw = document.querySelector(".login-pw");
export const idboxEl = document.querySelector(".id-box");
export const pwboxEl = document.querySelector(".pw-box");

// signup, login modal elements
export const loginBtnEl = document.querySelector(".login");
export const backGround = document.querySelector(".back-ground");
export const loginModal = document.querySelector(".login-modal");
export const signupModal = document.querySelector(".signup-modal");

// validation elements
export const emailErrorMsg = document.querySelector(".email-error-msg");
export const singupEmailBox = document.querySelector(".signup-email-box");
export const pwErrorMsg = document.querySelector(".pw-error-msg");
export const signupPwBox = document.querySelector(".signup-pw-box");
export const signupRepwBox = document.querySelector(".signup-repw-box");
export const pwLengthMsg = document.querySelector(".pw-length-msg");
export const idErrorMsg = document.querySelector(".id-error-msg");

export const exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

// user Info elements
export const userInfoName = document.getElementById("user-info-name");
export const nameChangeBtn = document.querySelector(".name-change-btn");
export const userInfoPw = document.getElementById("user-info-pwd");
export const userInfoNewPw = document.getElementById("user-info-new-pwd");
export const pwChangeBtn = document.querySelector(".pw-change-btn");
export const userModal = document.querySelector(".user-modal");
export const userModalBtn = document.querySelector(".user-modal-btn");
export const userModalContent = document.querySelector(".user-modal-content");
export const userInfoBtn = document.querySelector(".user-info-btn");

//관리자페이지
export const adminThumbnailFile = document.getElementById(
  "admin-info-thumbnail"
);
export const adminImgFile = document.getElementById("admin-info-img");
export const addItemBtn = document.querySelector(".submit-item");
export const adminItemsEl = document.querySelector(
  ".total-items > .item-container"
);

//상세페이지
export const detailContainer = document.querySelector(".detail-container");

// 검색기능
//search elements
export const searchForm = document.querySelector(".search-box");
export const searchInput = document.getElementById("search-main");

// 계좌 관련 elements
export const bankSubmitBtn = document.querySelector(".bank-add-btn");
export const bankSelectEl = document.querySelector(".bank-select");
export const accountListUl = document.querySelector(".account-lists");
export const removeSectionBtn = document.querySelector(".bank-remove-gnb");
export const addSectionBtn = document.querySelector(".bank-add-gnb");

// 장바구니
export const cartItems = document.querySelector(".cart-items");
