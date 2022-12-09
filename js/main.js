import { swiper } from "./swiper.js";
import {
  createSubmitEvent,
  createLoginEvent,
  getItemWithExpireTime,
} from "./signup.js";
import { authLogin, editUser } from "./requests.js";
import { createItemEvent, renderAdminItems } from "./admin.js";

// 관리자 이메일 -> 추후 .env넣어야함.
const ADMIN_EMAIL = `hyochofriend@naver.com`;

const firstNav = document.querySelector("ul.nav-1depth > li:first-child");
const backGround = document.querySelector(".back-ground");
export const loginBtnEl = document.querySelector(".login");
const loginModal = document.querySelector(".login-modal");
const signupModal = document.querySelector(".signup-modal");
const mainPgEl = document.querySelector(".main-page");
const userPgEl = document.querySelector(".user-page");
const adminPgEl = document.querySelector(".admin-page");

// signup elements
export const emailInputEl = document.getElementById("signup-email");
export const passwordInputEl = document.getElementById("signup-pw");
export const passwordcheckEl = document.getElementById("signup-repw");
export const displayNameInputEl = document.getElementById("signup-name");
export const submitEl = document.getElementById("frm");

// login elements
export const loginId = document.querySelector(".login-id");
export const loginPw = document.querySelector(".login-pw");
export const loginBtn = document.querySelector(".login-btn");
export const idboxEl = document.querySelector(".id-box");
export const pwboxEl = document.querySelector(".pw-box");
export const loginErrorBox = document.querySelector(".login-error-box");

//search elements
const searchInput = document.getElementById("search-main");

// admin elements
const addItemBtn = document.querySelector(".submit-item");
export const adminItemsEl = document.querySelector(".item-container");

// user Info elements
export const userInfoName = document.getElementById("user-info-name");
export const nameChangeBtn = document.querySelector(".name-change-btn");
export const userInfoPw = document.getElementById("user-info-pwd");
export const userInfoNewPw = document.getElementById("user-info-new-pwd");
const pwChangeBtn = document.querySelector(".pw-change-btn");

firstNav.addEventListener("mouseover", () => {
  backGround.style.visibility = "visible";
});
firstNav.addEventListener("mouseout", () => {
  backGround.style.visibility = "hidden";
});

// 로그인/회원가입 모달 visibility 조정
loginBtnEl.addEventListener("click", () => {
  if (loginBtnEl.textContent === "로그인/가입") {
    backGround.style.visibility = "visible";
    loginModal.style.visibility = "visible";
    document.querySelector(".close-login").addEventListener("click", () => {
      backGround.style.visibility = "hidden";
      loginModal.style.visibility = "hidden";
    });
    document.querySelector(".signup").addEventListener("click", () => {
      signupModal.style.visibility = "visible";
      loginModal.style.visibility = "hidden";
      document.querySelector(".close-signup").addEventListener("click", () => {
        backGround.style.visibility = "hidden";
        signupModal.style.visibility = "hidden";
      });
    });
  }
});

submitEl.addEventListener("submit", createSubmitEvent);
loginBtn.addEventListener("click", createLoginEvent);

// 이름 옆에 변경 버튼 누르면 이름 변경되도록 만들기
nameChangeBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  await editUser(userInfoName.value);
});
// 비밀번호 변경 버튼 누르면 비밀번호 변경되도록 만들기
pwChangeBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  await editUser(userInfoName.value, userInfoPw.value, userInfoNewPw.value);
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

// ============ 관리자페이지 ============
addItemBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  await createItemEvent();
});

// 초기화면(새로고침, 화면진입) 렌더
router();

// 이후로는 hashchange(페이지이동)때 렌더
window.addEventListener("hashchange", router);

// 라우팅
async function router() {
  const routePath = location.hash;
  // 초기화면
  if (routePath === "") {
    mainPgEl.style.display = "block";
    userPgEl.style.display = "none";
    adminPgEl.style.display = "none";
  } else if (routePath.includes("#/user")) {
    // 기존꺼 hide하고 갈기면됨
    mainPgEl.style.display = "none";
    adminPgEl.style.display = "none";
    userPgEl.style.display = "block";
  } else if (routePath.includes("#/admin")) {
    const email = await authLogin();
    if (email === ADMIN_EMAIL) {
      mainPgEl.style.display = "none";
      userPgEl.style.display = "none";
      adminPgEl.style.display = "block";
      renderAdminItems();
    } else {
      alert("허용되지 않은 접근입니다.");
    }
  }
}

// token이 없을 때 회원정보를 클릭하면 로그인을 하라고 모달창
const userInfoBtn = document.querySelector(".user-info-btn");
userInfoBtn.addEventListener("click", () => {
  const token = localStorage.getItem("token");
  if (token) {
    window.location = "#/user";
  } else return;
});
