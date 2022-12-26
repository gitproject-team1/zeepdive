import {
  createSubmitEvent,
  createLoginEvent,
  autoLogin,
  renderLoginModal,
  initUserInfo,
} from "./signup.js";
import { authLogin } from "./requests.js";
import { renderAdminItems } from "./admin.js";
import {
  renderCategoryPage,
  renderDetailPage,
  renderPurchasePage,
  renderCartPages,
  renderQnaPage,
  renderReceiptPage,
  renderMainPage,
  initCategoryPage,
} from "./render.js";
import {
  searchForm,
  searchInput,
  signupEl,
  loginEl,
  loginModalEl,
  userInfoEl,
} from "./store.js";
import { renderUserAccount } from "./account.js";
import { cartIconClick } from "./cart.js";
import { renderRecent, recentItemSet } from "./recent";
// 관리자 이메일
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
require("dotenv").config();

let cartIdArr = "";
const firstNav = document.querySelector("ul.nav-1depth > li:first-child");
const footerEl = document.querySelector("footer");
const receiptBtn = document.querySelector(".receipt-info-btn");
const userInfoBtn = document.querySelector(".user-info-btn");
// 구매내역 창 로그인 검사
receiptBtn.addEventListener("click", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alertModal(`로그인을 해주세요.`);
  } else {
    location.href = "#/receipt";
  }
});

// 회원정보 클릭
userInfoBtn.addEventListener("click", () => {
  // 회원정보 클릭
  const token = localStorage.getItem("token");
  if (token) {
    location.href = "#/user";
  } else {
    alertModal(`로그인을 해주세요.`);
  }
});

// 변경 됐다는 모달창에 있는 확인 버튼
userInfoEl.userModalBtn.addEventListener("click", () => {
  userInfoEl.userModal.classList.remove("show");
  // 거래가 정상적으로 되면 홈으로 보냄.
  if (location.hash.includes("#/purchase")) {
    if (localStorage.getItem("purchase") === "true") location.href = "/";
  }
  if (location.hash.includes("#/receipt")) {
    if (localStorage.getItem("receipt") === "true") location.reload();
  }
});

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

// 초기화면(새로고침, 화면진입) 렌더
router();

// 이후로는 hashchange(페이지이동)때 렌더
window.addEventListener("hashchange", router);

// 라우팅
if (location.hash === "") {
  console.log(
    "%c\n" +
      "                                                                        ,,\n" +
      "                                                                       /  ,\n" +
      "                                                                      /   /\n" +
      "                                                                     /   /\n" +
      "                                                                    /   /\n" +
      "     __________________________                                    /   /\n" +
      "    ⎢                         ⎥                                   /   /\n" +
      "    ⎢ 집다이브에 깊이 빠져보아요!⎥                                  /   /\n" +
      "    ⎢____    _________________⎥                                 /   /\n" +
      "          \\/    ,      ,,                                      /   /\n" +
      "               /" +
      "%c@" +
      "%c\\____/" +
      "%c@" +
      "%c \\                                ____/   /\n" +
      "              /           \\                         _____/        /__\n" +
      '        /" \\ / •    •      \\                     __/             /  ' +
      "%c@@" +
      '%c"\\\n' +
      "        \\    " +
      "%c@@" +
      "%c  ㅅ  " +
      "%c@@" +
      "%c     /___             ___/                /    _/\n" +
      '       /" \\   \\                 \\__________/                    |__/ "\\\n' +
      "       \\   \\                                                   /      /\n" +
      "        \\    \\  __                                                  _/\n" +
      "         \\                                                       __/\n" +
      "           \\_                                             ______/\n" +
      "              \\ ___                                    __/\n" +
      "                    \\__                             __/\n" +
      "                        \\_____                _____/\n" +
      "                              \\______________/\n" +
      "\n",
    "font-weight: bold;",
    "font-weight: bold; color: #ff7777",
    "font-weight: bold;",
    "font-weight: bold; color: #ff7777",
    "font-weight: bold;",
    "font-weight: bold; color: #ff7777",
    "font-weight: bold;",
    "font-weight: bold; color: #ff7777",
    "font-weight: bold;",
    "font-weight: bold; color: #ff7777",
    "font-weight: bold;"
  );
}
async function router() {
  const routePath = location.hash;
  // 초기화면
  if (routePath === "") {
    await renderMainPage();
    //회원정보 페이지
  } else if (routePath.includes("#/user")) {
    await renderUserAccount();
    await initUserInfo();
    //제품 상세정보 페이지
  } else if (routePath.includes("#/detail")) {
    await recentItemSet();
    // id url에서 파싱해서 넘김
    await renderDetailPage(routePath.split("/")[2]);
    //관리자 페이지
  } else if (routePath.includes("#/admin")) {
    // 관리자인지 확인
    const email = await authLogin();
    //만약 관리자라면,
    if (email === ADMIN_EMAIL) {
      await renderAdminItems();
    } else {
      // 허가되지 않은 사용자면 -> alert띄운다
      alert("허용되지 않은 접근입니다.");
    }
    //category 분류 페이지
  } else if (routePath.includes("#/furniture")) {
    // select option 때문에... 카테고리의 뼈대를 먼저 생성
    initCategoryPage();
    // category url에서 파싱
    const category = routePath.split("/")[2];
    let searchKeyword = routePath.split("/")[3];
    searchKeyword = decodeURIComponent(searchKeyword);
    await renderCategoryPage(category, searchKeyword, "new");
    // 카테고리창에서 sort option 변경될시 다시 렌더링 해야함.
    const categorySort = document.querySelector(".selector");
    categorySort.addEventListener("change", async () => {
      const routePath = location.hash;
      const category = routePath.split("/")[2];
      let searchKeyword = routePath.split("/")[3];
      searchKeyword = decodeURIComponent(searchKeyword);
      await renderCategoryPage(category, searchKeyword, categorySort.value);
    });

    // 제품 구매 페이지
  } else if (routePath.includes("#/purchase")) {
    if (routePath.includes("#/purchase/cart")) {
      await renderPurchasePage(cartIdArr);
      return;
    }
    await renderPurchasePage([routePath.split("/")[2]]);
    // 장바구니 페이지
  } else if (routePath.includes("#/cart")) {
    await renderCartPages();
    // ============ 장바구니 ============
    const cartOrderBtn = document.querySelector(".cart-order-btn");
    cartOrderBtn.addEventListener("click", async () => {
      const email = await authLogin();
      cartIdArr = JSON.parse(localStorage.getItem(`cartId-${email}`));
      location.href = "#/purchase/cart";
    });
    // QnA 페이지
  } else if (routePath.includes("#/qna")) {
    await renderQnaPage();
  } else if (routePath.includes("#/receipt")) {
    await renderReceiptPage();
  }
}

window.addEventListener("hashchange", renderRecent);
renderRecent();

// ============ 장바구니 초기 설정============
const cartIcon = document.querySelector(".cart-icon");
cartIcon.addEventListener("click", cartIconClick);

// 경고 모달창 부르는 함수
export function alertModal(errormsg) {
  userInfoEl.userModalContent.textContent = errormsg;
  userInfoEl.userModal.classList.add("show");
}
