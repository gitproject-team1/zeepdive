import { swiper } from "./swiper.js";
import {
  createSubmitEvent,
  createLoginEvent,
  getItemWithExpireTime,
  loginModal,
  validationStyle,
} from "./signup.js";
import { authLogin, editUser } from "./requests.js";
import { renderAdminItems } from "./admin.js";
import { getItem } from "./requests.js";
import { renderMainItems, renderCategoryPages } from "./render.js";
import { render, sassFalse } from "sass";
import {
  submitEl,
  emailInputEl,
  passwordcheckEl,
  passwordInputEl,
  loginBtn,
  loginId,
  loginBtnEl,
  backGround,
  idboxEl,
  emailErrorMsg,
  singupEmailBox,
  pwErrorMsg,
  signupPwBox,
  signupRepwBox,
  pwLengthMsg,
  idErrorMsg,
  exptext,
  userInfoName,
  nameChangeBtn,
  userInfoPw,
  userInfoNewPw,
  pwChangeBtn,
  userModal,
  userModalBtn,
  userModalContent,
} from "./store.js";

// 관리자 이메일 -> 추후 .env넣어야함.
const ADMIN_EMAIL = `hyochofriend@naver.com`;

const firstNav = document.querySelector("ul.nav-1depth > li:first-child");
export const mainPgEl = document.querySelector(".main-page");
const userPgEl = document.querySelector(".user-page");
const adminPgEl = document.querySelector(".admin-page");
const footerEl = document.querySelector("footer");
const categorypgEl = document.querySelector(".category-page");

//search elements
const searchForm = document.querySelector(".search-box");
const searchInput = document.getElementById("search-main");

// 검색창
searchForm.addEventListener("submit", (event) => {
  window.location.href = `#/furniture/all/${searchInput.value}`;
});

//상세페이지
const detailPageEl = document.querySelector(".detail-container");

firstNav.addEventListener("mouseover", () => {
  backGround.style.visibility = "visible";
});
firstNav.addEventListener("mouseout", () => {
  backGround.style.visibility = "hidden";
});

// ============ 인증 관련 ============
// 로그인/회원가입 모달 visibility 조정
loginBtnEl.addEventListener("click", loginModal);
// 회원가입 전송
submitEl.addEventListener("submit", createSubmitEvent);
// 로그인
loginBtn.addEventListener("click", createLoginEvent);

// 로그인 시 유효성 검사
loginId.addEventListener("focusout", () => {
  if (loginId.value && !exptext.test(loginId.value)) {
    validationStyle(idErrorMsg, "add", idboxEl, "#ed234b");
  }
});
loginId.addEventListener("focusin", () => {
  validationStyle(idErrorMsg, "remove", idboxEl, "#999");
});

// 회원가입 유효성 검사
// 이메일
emailInputEl.addEventListener("focusout", () => {
  if (emailInputEl.value && !exptext.test(emailInputEl.value)) {
    validationStyle(emailErrorMsg, "add", singupEmailBox, "#ed234b");
  }
});
emailInputEl.addEventListener("focusin", () => {
  validationStyle(emailErrorMsg, "remove", singupEmailBox, "#333");
});
// 비밀번호 8자리 이상
passwordInputEl.addEventListener("focusout", () => {
  if (passwordInputEl.value && passwordInputEl.value.length < 8) {
    validationStyle(pwLengthMsg, "add", signupPwBox, "#ed234b");
  }
});
passwordInputEl.addEventListener("focusin", () => {
  validationStyle(pwLengthMsg, "remove", signupPwBox, "#333");
});
// 비밀번호 확인
passwordcheckEl.addEventListener("focusout", () => {
  if (passwordInputEl && passwordInputEl.value !== passwordcheckEl.value) {
    validationStyle(pwErrorMsg, "add", signupRepwBox, "#ed234b");
  }
});
passwordcheckEl.addEventListener("focusin", () => {
  validationStyle(pwErrorMsg, "remove", signupRepwBox, "#333");
});

// ============ 인증 관련 : 회원정보 페이지 ============
// 이름 옆에 변경 버튼 누르면 이름 변경되도록 만들기
nameChangeBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  if (userInfoName.value) await editUser("이름", userInfoName.value);
});
// 변경 됐다는 모달창에 있는 확인 버튼
userModalBtn.addEventListener("click", () => {
  userModal.classList.remove("show");
});
// 비밀번호 변경 버튼 누르면 비밀번호 변경되도록 만들기
pwChangeBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  if (userInfoPw.value && userInfoNewPw.value)
    await editUser(
      "비밀번호",
      userInfoName.value,
      userInfoPw.value,
      userInfoNewPw.value
    );
});

// 로컬에 로그인 데이터 있는지 확인.
(async () => {
  const token = localStorage.getItem("token");
  if (token) {
    loginBtnEl.textContent = "로그아웃";
    await authLogin();
  } else {
    loginBtnEl.textContent = "로그인/가입";
  }
  // 만료시간 체크는 계속
  getItemWithExpireTime("token");
})();

// 초기화면(새로고침, 화면진입) 렌더
router();

// 이후로는 hashchange(페이지이동)때 렌더
window.addEventListener("hashchange", router);

// 라우팅
async function router() {
  const routePath = location.hash;
  // 초기화면
  if (routePath === "") {
    detailPageEl.style.display = "none";
    mainPgEl.style.display = "none";
    userPgEl.style.display = "none";
    adminPgEl.style.display = "none";
    footerEl.style.display = "none";
    categorypgEl.style.display = "none";
    await renderMainItems();
    mainPgEl.style.display = "block";
    footerEl.style.display = "block";
    //회원정보 페이지
  } else if (routePath.includes("#/user")) {
    mainPgEl.style.display = "none";
    userPgEl.style.display = "block";
    adminPgEl.style.display = "none";
    detailPageEl.style.display = "none";
    categorypgEl.style.display = "none";
    //제품 상세정보 페이지
  } else if (routePath.includes("#/detail")) {
    mainPgEl.style.display = "none";
    userPgEl.style.display = "none";
    adminPgEl.style.display = "none";
    detailPageEl.style.display = "block";
    categorypgEl.style.display = "none";
    //관리자 페이지
  } else if (routePath.includes("#/admin")) {
    // 관리자인지 확인
    const email = await authLogin();
    detailPageEl.style.display = "none";
    categorypgEl.style.display = "none";
    //만약 관리자라면,
    if (email === ADMIN_EMAIL) {
      mainPgEl.style.display = "none";
      userPgEl.style.display = "none";
      adminPgEl.style.display = "block";
      renderAdminItems();
    } else {
      // 허가되지 않은 사용자면 -> alert띄운다
      alert("허용되지 않은 접근입니다.");
    }
    //category 분류 페이지
  } else if (routePath.includes("#/furniture")) {
    detailPageEl.style.display = "none";
    mainPgEl.style.display = "none";
    userPgEl.style.display = "none";
    adminPgEl.style.display = "none";
    categorypgEl.style.display = "block";
    // category url에서 파싱
    const category = routePath.split("/")[2];
    await renderCategoryPages(category);
  }
}

// token이 없을 때 회원정보를 클릭하면 로그인을 하라고 모달창
const userInfoBtn = document.querySelector(".user-info-btn");
userInfoBtn.addEventListener("click", () => {
  const token = localStorage.getItem("token");
  if (token) {
    window.location = "#/user";
  } else {
    userModalContent.innerHTML = `로그인을 해주세요.`;
    userModal.classList.add("show");
  }
});

// bank elements
const inputBankEl1 = document.querySelector(".bank-link-1");
const inputBankEl2 = document.querySelector(".bank-link-2");
const inputBankEl3 = document.querySelector(".bank-link-3");
const inputBankEl4 = document.querySelector(".bank-link-4");
const allInputBankEl = document.querySelectorAll(".bank-link-input");
const bankSelectEl = document.querySelector(".bank-select");
const bankSubmitBtn = document.querySelector(".bank-link-btn");
let bankNumber = "";

bankSelectEl.addEventListener("change", () => {
  let select1 = bankSelectEl[bankSelectEl.selectedIndex].value;
  let arr = [];
  if (select1 === "none") {
    inputDisplay("none");
  } else if (select1 === "bank-nh") {
    inputDisplay("inline");
    arr = [3, 4, 4, 2];
  } else if (select1 === "bank-kb") {
    inputDisplay("inline");
    arr = [3, 2, 4, 3];
  } else if (select1 === "bank-sh") {
    inputDisplay("inline");
    arr = [3, 3, 6];
  } else if (select1 === "bank-ka") {
    inputDisplay("inline");
    arr = [4, 2, 7];
  }

  inputBankEl1.value = "";
  inputBankEl2.value = "";
  inputBankEl3.value = "";
  inputBankEl4.value = "";

  inputBankEl1.setAttribute("maxlength", arr[0]);
  inputBankEl2.setAttribute("maxlength", arr[1]);
  inputBankEl3.setAttribute("maxlength", arr[2]);
  inputBankEl4.setAttribute("maxlength", arr[3]);

  const i4Len = inputBankEl4.getAttribute("maxlength");

  if (i4Len === "undefined") {
    inputBankEl4.style.display = "none";
  } else {
    inputBankEl4.style.display = "inline";
  }
  inputBankEl1.focus();

  function inputDisplay(display) {
    allInputBankEl.forEach((e) => {
      e.style.display = display;
    });
  }
});

allInputBankEl.forEach((e, i) => {
  e.addEventListener("input", () => {
    if (i < 3) {
      if (
        allInputBankEl[i].value.length ===
        Number(allInputBankEl[i].getAttribute("maxlength"))
      ) {
        allInputBankEl[i + 1].focus();
      }
    }
  });
});
bankSubmitBtn.addEventListener("click", () => {
  allInputBankEl.forEach((e) => {
    bankNumber += e.value;
    e.value = "";
  });
  if (!Number(bankNumber)) {
    window.alert("숫자만 입력하세요");
  } else {
    // console.log(Number(bankNumber));
  }
  // console.log(bankNumber);
  bankNumber = "";
});
