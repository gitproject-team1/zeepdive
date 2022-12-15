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
  accountListUl,
  removeSectionBtn,
  addSectionBtn,
  cartItems,
} from "./store.js";
import {
  renderUserAccount,
  gnbBtnClick,
  bankSelelectEvent,
  accountAddSubmit,
  removeAccountFnc,
} from "./account.js";

// 관리자 이메일 -> 추후 .env넣어야함.
const ADMIN_EMAIL = `hyochofriend@naver.com`;

const firstNav = document.querySelector("ul.nav-1depth > li:first-child");
export const mainPgEl = document.querySelector(".main-page");
const userPgEl = document.querySelector(".user-page");
const adminPgEl = document.querySelector(".admin-page");
const footerEl = document.querySelector("footer");
const categorypgEl = document.querySelector(".category-page");
const purchasepgEl = document.querySelector(".purchase-page");
const cartPgEl = document.querySelector(".cart-page");

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
});
// 비밀번호 변경 버튼 누르면 비밀번호 변경되도록 만들기
pwChangeBtn.addEventListener("click", pwchange);

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
    // purchasepgEl.style.display = "none";
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
    //제품 상세정보 페이지
  } else if (routePath.includes("#/detail")) {
    detailPageEl.style.display = "block";
    mainPgEl.style.display = "none";
    userPgEl.style.display = "none";
    adminPgEl.style.display = "none";
    purchasepgEl.style.display = "none";
    categorypgEl.style.display = "none";
    // id url에서 파싱해서 넘김
    await renderDetailPages(routePath.split("/")[2]);
    categorypgEl.style.display = "none";
    cartPgEl.style.display = "none";
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
    // category url에서 파싱
    console.log(routePath);
    const category = routePath.split("/")[2];
    let searchKeyword = routePath.split("/")[3];
    searchKeyword = decodeURIComponent(searchKeyword);
    await renderCategoryPages(category, searchKeyword);
    categorypgEl.style.display = "block";
    cartPgEl.style.display = "none";
    // 제품 구매 페이지
  } else if (routePath.includes("#/purchase")) {
    detailPageEl.style.display = "none";
    mainPgEl.style.display = "none";
    userPgEl.style.display = "none";
    adminPgEl.style.display = "none";
    categorypgEl.style.display = "none";
    await renderPurchasePages(routePath.split("/")[2]);
    purchasepgEl.style.display = "block";
    cartPgEl.style.display = "none";
    // 장바구니 페이지
  } else if (routePath.includes("#/cart")) {
    mainPgEl.style.display = "none";
    userPgEl.style.display = "none";
    adminPgEl.style.display = "none";
    detailPageEl.style.display = "none";
    categorypgEl.style.display = "none";
    purchasepgEl.style.display = "none";
    cartPgEl.style.display = "block";
  }
}

// user-info창에서 은행을 선택하면 생기는 이벤트
bankSelectEl.addEventListener("change", (event) => {
  event.preventDefault();
  bankSelelectEvent();
});
bankSubmitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  accountAddSubmit();
});

removeSectionBtn.addEventListener("click", function chacngeSection() {
  renderUserAccount();
  const clickValue = removeSectionBtn.classList.contains("on");
  gnbBtnClick("remove", clickValue);
  removeEventListener("click", chacngeSection);
});

addSectionBtn.addEventListener("click", () => {
  const clickValue = addSectionBtn.classList.contains("on");
  gnbBtnClick("add", clickValue);
});

const removeAccountBtn = document.querySelector(".remove-account");
removeAccountBtn.addEventListener("click", () => {
  removeAccountFnc();
});

// ============ 장바구니 ============
const cartIcon = document.querySelector(".cart-icon");
cartIcon.addEventListener("click", () => {
  window.location = "#/cart";
});

export async function renderCartPages() {
  const email = await authLogin();
  let itemsPrice = 0;
  const cartIdArr = JSON.parse(localStorage.getItem(`cartId-${email}`));
  for (const id of cartIdArr) {
    const element = document.createElement("li");
    element.classList.add("cart-item");
    const getItems = await getDetailItem(id);
    console.log(getItems);
    element.innerHTML = /* html */ `
        <img
          class="cart-img"
          src=${getItems.thumbnail}
          alt="cart-img"
        />
        <p class="cart-title">${getItems.title}</p>
        <p class="cart-count">1</p>
        <p class="cart-price">${getItems.price.toLocaleString()}원</p>
        <img
          class="cart-delete"
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0yMSA5Ljc2MiAyMC4yMzggOSAxNSAxNC4yMzggOS43NjIgOSA5IDkuNzYyIDE0LjIzOCAxNSA5IDIwLjIzOGwuNzYyLjc2MkwxNSAxNS43NjIgMjAuMjM4IDIxbC43NjItLjc2MkwxNS43NjIgMTV6IiBmaWxsPSIjQ0NDIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+Cg=="
          alt="cart-delete"
        />
          `;
    itemsPrice += getItems.price;
    cartItems.appendChild(element);
  }
  let deliveryFee = 3500;
  const singlePrice = document.querySelector(".single-price");
  singlePrice.textContent = `${itemsPrice.toLocaleString()}원`;
  const deliveryPrice = document.querySelector(".delivery-price");
  if (itemsPrice >= 100000) {
    deliveryFee = 0;
    deliveryPrice.textContent = `${deliveryFee}원`;
  } else deliveryPrice.textContent = `${deliveryFee.toLocaleString()}원`;
  const totalPrice = document.querySelector(".total-price");
  totalPrice.textContent =
    (parseInt(itemsPrice) + parseInt(deliveryFee)).toLocaleString() + "원";
}
