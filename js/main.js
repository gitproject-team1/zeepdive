import { swiper } from "./swiper.js";
import {
  createSubmitEvent,
  createLoginEvent,
  pwchange,
  autoLogin,
  userinfoClick,
  renderLoginModal,
} from "./signup.js";
import { authLogin, editUser, getDetailItem } from "./requests.js";
import { renderAdminItems } from "./admin.js";
import { getItem } from "./requests.js";
import {
  renderMainItems,
  renderCategoryPages,
  renderDetailPages,
  renderPurchasePages,
  renderCartPages,
  renderQnA,
} from "./render.js";
import {
  submitEl,
  loginBtn,
  loginBtnEl,
  backGround,
  userInfoName,
  nameChangeBtn,
  pwChangeBtn,
  userModal,
  userModalBtn,
  userInfoBtn,
  searchForm,
  searchInput,
  bankSubmitBtn,
  bankSelectEl,
  removeSectionBtn,
  addSectionBtn,
  cartIcon,
  cartOrderBtn,
  cartItems,
  userModalContent,
} from "./store.js";
import {
  renderUserAccount,
  gnbBtnClick,
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
export const mainPgEl = document.querySelector(".main-page");
const userPgEl = document.querySelector(".user-page");
const adminPgEl = document.querySelector(".admin-page");
const footerEl = document.querySelector("footer");
const categorypgEl = document.querySelector(".category-page");
export const purchasepgEl = document.querySelector(".purchase-page");
export const cartPgEl = document.querySelector(".cart-page");
const qnaPgEl = document.querySelector(".qna-page");
const categorySort = document.querySelector(".selector");

// 검색창
searchForm.addEventListener("submit", (event) => {
  window.location.href = `#/furniture/all/${searchInput.value}`;
});

//상세페이지
export const detailPageEl = document.querySelector(".detail-container");

firstNav.addEventListener("mouseover", () => {
  backGround.style.visibility = "visible";
});
firstNav.addEventListener("mouseout", () => {
  backGround.style.visibility = "hidden";
});

// ============ 인증 관련 ============
// 로그인/회원가입 모달 visibility 조정
loginBtnEl.addEventListener("click", renderLoginModal);
// 회원가입 전송
submitEl.addEventListener("submit", createSubmitEvent);
// 로그인
loginBtn.addEventListener("click", createLoginEvent);
// 로컬에 로그인 데이터 있는지 확인.
(async () => {
  await autoLogin();
})();
// token이 없을 때 회원정보를 클릭하면 로그인을 하라고 모달창
userInfoBtn.addEventListener("click", () => {
  userinfoClick();
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
  // 거래가 정상적으로 되면 홈으로 보냄.
  if (location.hash.includes("#/purchase")) {
    if (localStorage.getItem("purchase") === "true") location.href = "/";
  }
});

// 비밀번호 변경 버튼 누르면 비밀번호 변경되도록 만들기
pwChangeBtn.addEventListener("click", pwchange);

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
    detailPageEl.style.display = "none";
    mainPgEl.style.display = "none";
    userPgEl.style.display = "none";
    adminPgEl.style.display = "none";
    footerEl.style.display = "none";
    categorypgEl.style.display = "none";
    cartPgEl.style.display = "none";
    purchasepgEl.style.display = "none";
    qnaPgEl.style.display = "none";
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
    purchasepgEl.style.display = "none";
    cartPgEl.style.display = "none";
    qnaPgEl.style.display = "none";
    //제품 상세정보 페이지
  } else if (routePath.includes("#/detail")) {
    mainPgEl.style.display = "none";
    userPgEl.style.display = "none";
    adminPgEl.style.display = "none";
    purchasepgEl.style.display = "none";
    categorypgEl.style.display = "none";
    recentItemSet();
    // id url에서 파싱해서 넘김
    await renderDetailPages(routePath.split("/")[2]);
    detailPageEl.style.display = "block";
    categorypgEl.style.display = "none";
    cartPgEl.style.display = "none";
    qnaPgEl.style.display = "none";
    //관리자 페이지
  } else if (routePath.includes("#/admin")) {
    // 관리자인지 확인
    const email = await authLogin();
    detailPageEl.style.display = "none";
    categorypgEl.style.display = "none";
    purchasepgEl.style.display = "none";
    cartPgEl.style.display = "none";
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
    purchasepgEl.style.display = "none";
    cartPgEl.style.display = "none";
    qnaPgEl.style.display = "none";
    // category url에서 파싱
    const category = routePath.split("/")[2];
    let searchKeyword = routePath.split("/")[3];
    searchKeyword = decodeURIComponent(searchKeyword);
    await renderCategoryPages(category, searchKeyword, "new");
    categorypgEl.style.display = "block";
    cartPgEl.style.display = "none";
    qnaPgEl.style.display = "none";
    // 제품 구매 페이지
  } else if (routePath.includes("#/purchase")) {
    detailPageEl.style.display = "none";
    mainPgEl.style.display = "none";
    userPgEl.style.display = "none";
    adminPgEl.style.display = "none";
    categorypgEl.style.display = "none";
    cartPgEl.style.display = "none";
    qnaPgEl.style.display = "none";
    if (routePath.includes("#/purchase/cart")) {
      await renderPurchasePages(cartIdArr);
      purchasepgEl.style.display = "block";
      return;
    }
    await renderPurchasePages([routePath.split("/")[2]]);
    purchasepgEl.style.display = "block";
    // 장바구니 페이지
  } else if (routePath.includes("#/cart")) {
    mainPgEl.style.display = "none";
    userPgEl.style.display = "none";
    adminPgEl.style.display = "none";
    detailPageEl.style.display = "none";
    categorypgEl.style.display = "none";
    purchasepgEl.style.display = "none";
    cartItems.innerHTML = "";
    await renderCartPages();
    cartPgEl.style.display = "block";
    qnaPgEl.style.display = "none";
    // QnA 페이지
  } else if (routePath.includes("#/qna")) {
    mainPgEl.style.display = "none";
    userPgEl.style.display = "none";
    adminPgEl.style.display = "none";
    detailPageEl.style.display = "none";
    categorypgEl.style.display = "none";
    purchasepgEl.style.display = "none";
    cartPgEl.style.display = "none";
    await renderQnA();
    qnaPgEl.style.display = "block";
  }
}

// user-info창에서 은행을 선택하면 생기는 이벤트
bankSelectEl.addEventListener("change", (event) => {
  bankSelelectEvent(event.target.value);
  event.preventDefault();
});

const accountAddForm = document.querySelector(".add-form");
bankSubmitBtn.addEventListener("click", async (event) => {
  await accountAddSubmit();
  await renderUserAccount();
  event.preventDefault();
  accountAddForm.style.display = "none";
  backGround.style.visibility = "hidden";
});
const addAccountBtn = document.querySelector(".add-account");
addAccountBtn.addEventListener("click", () => {
  accountAddForm.style.display = "flex";
  backGround.style.visibility = "visible";
});
const closeBtn = document.querySelector(".bank-close-btn");
closeBtn.addEventListener("click", (event) => {
  event.preventDefault();
  accountAddForm.style.display = "none";
  backGround.style.visibility = "hidden";
});
renderUserAccount();

const removeAccountBtn = document.querySelector(".remove-account");
removeAccountBtn.addEventListener("click", () => {
  removeAccountFnc();
});

window.addEventListener("hashchange", renderRecent);
renderRecent();

// ============ 장바구니 ============
cartIcon.addEventListener("click", cartIconClick);
cartOrderBtn.addEventListener("click", async () => {
  const email = await authLogin();
  cartIdArr = JSON.parse(localStorage.getItem(`cartId-${email}`));
  cartPgEl.style.display = "none";
  window.location.href = "#/purchase/cart";
});

// 경고 모달창 부르는 함수
export function alertModal(errormsg) {
  userModalContent.textContent = errormsg;
  userModal.classList.add("show");
}
