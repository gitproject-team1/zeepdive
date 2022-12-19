import { swiper } from "./swiper.js";
import {
  createSubmitEvent,
  createLoginEvent,
  pwchange,
  autoLogin,
  userinfoClick,
  renderLoginModal,
} from "./signup.js";
import { authLogin, editUser } from "./requests.js";
import { renderAdminItems } from "./admin.js";
import {
  renderMainItems,
  renderCategoryPages,
  renderDetailPages,
  renderPurchasePages,
  renderCartPages,
  renderQnA,
  routerInit,
} from "./render.js";
import {
  searchForm,
  searchInput,
  bankSubmitBtn,
  bankSelectEl,
  signupEl,
  loginEl,
  loginModalEl,
  userInfoEl,
  cartEl,
  pageEl,
} from "./store.js";
import {
  renderUserAccount,
  bankSelelectEvent,
  accountAddSubmit,
  removeAccountFnc,
} from "./account.js";
import { cartIconClick } from "./cart.js";
import { renderRecent, recentItemSet } from "./recent";
// 관리자 이메일 -> 추후 .env넣어야함.
const ADMIN_EMAIL = `hyochofriend@naver.com`;
let cartIdArr = "";
const firstNav = document.querySelector("ul.nav-1depth > li:first-child");
const categorySort = document.querySelector(".selector");
const footerEl = document.querySelector("footer");

// 검색창
searchForm.addEventListener("submit", (event) => {
  location.href = `#/furniture/all/${searchInput.value}`;
});

firstNav.addEventListener("mouseover", () => {
  loginModalEl.backGround.style.visibility = "visible";
});
firstNav.addEventListener("mouseout", () => {
  loginModalEl.backGround.style.visibility = "hidden";
});

// ============ 인증 관련 ============
// 로그인/회원가입 모달 visibility 조정
loginModalEl.loginBtnEl.addEventListener("click", renderLoginModal);
// 회원가입 전송
signupEl.submitEl.addEventListener("submit", createSubmitEvent);
// 로그인
loginEl.loginBtn.addEventListener("click", createLoginEvent);
// 로컬에 로그인 데이터 있는지 확인.
(async () => {
  await autoLogin();
})();

// ============ 인증 관련 : 회원정보 페이지 ============
// 회원정보 클릭
userInfoEl.userInfoBtn.addEventListener("click", userinfoClick);
// 이름 변경
userInfoEl.nameChangeBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  if (userInfoEl.userInfoName.value)
    await editUser("이름", userInfoEl.userInfoName.value);
});
// 변경 됐다는 모달창에 있는 확인 버튼
userInfoEl.userModalBtn.addEventListener("click", () => {
  userInfoEl.userModal.classList.remove("show");
  // 거래가 정상적으로 되면 홈으로 보냄.
  if (location.hash.includes("#/purchase")) {
    if (localStorage.getItem("purchase") === "true") location.href = "/";
  }
});
// 비밀번호 변경
userInfoEl.pwChangeBtn.addEventListener("click", pwchange);

// 카테고리창에서 sort option 변경될시 다시 렌더링 해야함.
categorySort.addEventListener("change", async () => {
  const routePath = location.hash;
  const category = routePath.split("/")[2];
  let searchKeyword = routePath.split("/")[3];
  searchKeyword = decodeURIComponent(searchKeyword);
  await renderCategoryPages(category, searchKeyword, categorySort.value);
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
    routerInit();
    footerEl.style.display = "none";
    await renderMainItems();
    pageEl.mainPgEl.style.display = "block";
    footerEl.style.display = "block";
    //회원정보 페이지
  } else if (routePath.includes("#/user")) {
    routerInit();
    pageEl.userPgEl.style.display = "block";
    //제품 상세정보 페이지
  } else if (routePath.includes("#/detail")) {
    routerInit();
    await recentItemSet();
    // id url에서 파싱해서 넘김
    await renderDetailPages(routePath.split("/")[2]);
    pageEl.detailPageEl.style.display = "block";
    //관리자 페이지
  } else if (routePath.includes("#/admin")) {
    // 관리자인지 확인
    const email = await authLogin();
    //만약 관리자라면,
    if (email === ADMIN_EMAIL) {
      routerInit();
      await renderAdminItems();
      pageEl.adminPgEl.style.display = "block";
    } else {
      // 허가되지 않은 사용자면 -> alert띄운다
      alert("허용되지 않은 접근입니다.");
    }
    //category 분류 페이지
  } else if (routePath.includes("#/furniture")) {
    routerInit();
    // category url에서 파싱
    const category = routePath.split("/")[2];
    let searchKeyword = routePath.split("/")[3];
    searchKeyword = decodeURIComponent(searchKeyword);
    await renderCategoryPages(category, searchKeyword, "new");
    pageEl.categorypgEl.style.display = "block";
    // 제품 구매 페이지
  } else if (routePath.includes("#/purchase")) {
    routerInit();
    if (routePath.includes("#/purchase/cart")) {
      await renderPurchasePages(cartIdArr);
      pageEl.purchasepgEl.style.display = "block";
      return;
    }
    await renderPurchasePages([routePath.split("/")[2]]);
    pageEl.purchasepgEl.style.display = "block";
    // 장바구니 페이지
  } else if (routePath.includes("#/cart")) {
    routerInit();
    cartEl.cartItems.innerHTML = "";
    await renderCartPages();
    pageEl.cartPgEl.style.display = "block";
    // QnA 페이지
  } else if (routePath.includes("#/qna")) {
    routerInit();
    await renderQnA();
    pageEl.qnaPgEl.style.display = "block";
  }
}

// user-info창에서 은행을 선택하면 생기는 이벤트
bankSelectEl.addEventListener("change", (event) => {
  event.preventDefault();
  bankSelelectEvent(event.target.value);
});

const accountAddForm = document.querySelector(".add-form");
bankSubmitBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  await accountAddSubmit();
  await renderUserAccount();
  accountAddForm.style.display = "none";
  loginModalEl.backGround.style.visibility = "hidden";
});
const addAccountBtn = document.querySelector(".add-account");
addAccountBtn.addEventListener("click", () => {
  accountAddForm.style.display = "flex";
  loginModalEl.backGround.style.visibility = "visible";
});
const closeBtn = document.querySelector(".bank-close-btn");
closeBtn.addEventListener("click", (event) => {
  event.preventDefault();
  accountAddForm.style.display = "none";
  loginModalEl.backGround.style.visibility = "hidden";
});
renderUserAccount();

const removeAccountBtn = document.querySelector(".remove-account");
removeAccountBtn.addEventListener("click", async () => {
  await removeAccountFnc();
});

window.addEventListener("hashchange", renderRecent);
renderRecent();

// ============ 장바구니 ============
cartEl.cartIcon.addEventListener("click", cartIconClick);
cartEl.cartOrderBtn.addEventListener("click", async () => {
  const email = await authLogin();
  cartIdArr = JSON.parse(localStorage.getItem(`cartId-${email}`));
  pageEl.cartPgEl.style.display = "none";
  location.href = "#/purchase/cart";
});

// 경고 모달창 부르는 함수
export function alertModal(errormsg) {
  userInfoEl.userModalContent.textContent = errormsg;
  userInfoEl.userModal.classList.add("show");
}
