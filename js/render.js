import { mainPgEl } from "./main.js";
import {
  getItem,
  getDetailItem,
  authLogin,
  getAccounts,
  getQnA,
  postQna,
} from "./requests.js";
import {
  detailContainer,
  userModalContent,
  userModal,
  cartItems,
  singlePrice,
  deliveryPrice,
  totalPrice,
} from "./store.js";

const bankCode = {
  "089": 0,
  "081": 1,
  "090": 2,
  "011": 3,
  "088": 4,
  "020": 5,
  "004": 6,
};

//tags 별로 분류
async function filterCategories(search = "") {
  const items = await getItem();
  const christmasItem = items.filter((item) => item.tags[0] === "크리스마스");
  const planteriorItem = items.filter((item) => item.tags[0] === "플랜테리어");
  const cookooItem = items.filter((item) => item.tags[0] === "쿠쿠");
  const drawerItem = items.filter((item) => item.tags[0] === "수납");
  // console.log(search);
  const searchItem = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );
  return [christmasItem, planteriorItem, cookooItem, drawerItem, searchItem];
}

//메인 페이지 아이템 렌더링
export async function renderMainItems() {
  const filteredItems = await filterCategories();
  const tagsEl = [
    filteredItems[0],
    filteredItems[1],
    filteredItems[2],
    filteredItems[3],
  ];
  const itemTitlesArray = [
    "연말느낌 물씬, 크리스마스🎅",
    "초록을 담은 플랜테리어🌿",
    "쿠쿠하세요 쿠쿠🍚",
    "깔끔한 정리를 위해📦",
  ];
  const itemCommentArray = [
    "집에서 즐기는 홈파티",
    "지친 삶에 활기를 불어넣어요",
    "쿠쿠는 다 잘해요",
    "이것저것 다 넣어드립니다",
  ];
  const categoryArray = [
    "/#/furniture/christmas",
    "/#/furniture/plant",
    "/#/furniture/digital",
    "/#/furniture/drawer",
  ];

  //반복문을 돌면서 tags 별로 아이템 넣어주기
  for (let i = 0; i < 4; i++) {
    const saleslistContainer = document.createElement("section");
    saleslistContainer.classList.add("saleslist-container");
    saleslistContainer.innerHTML = /* html */ `
			<div class="saleslist-header">
					<div class="saleslist-header-main">${itemTitlesArray[i]}</div>
					<div class="saleslist-seemore">
            <a href=${categoryArray[i]}><button style="font-weight:700;" >전체 보기</button></a>
					</div>
			</div>
			<div class="saleslist-comment">${itemCommentArray[i]}</div>
			<div class="saleslist-itemlist">
					<div class="itemlist">
`;
    const itemList = saleslistContainer.querySelector(".itemlist");
    for (let j = 0; j < 4; j++) {
      const itemListContainer = document.createElement("div");
      itemListContainer.classList.add("itemlist-container");
      itemListContainer.innerHTML = /* html */ `
      <a href="#/detail/${tagsEl[Math.floor(i)][j].id}">
				<div class="itemlist-image">
					<img
						src=${tagsEl[Math.floor(i)][j].thumbnail}
						alt=${tagsEl[Math.floor(i)][j].tags}이미지
					/>
				</div>
				<div class="itemlist-detail">
					<div class="itemlist-tag">${tagsEl[Math.floor(i)][j].tags}</div>
					<div class="itemlist-title">${tagsEl[Math.floor(i)][j].title}</div>
					<div class="itemlist-price">${tagsEl[Math.floor(i)][
            j
          ].price.toLocaleString()}원</div>
				</div>
        </a>
			</div>
			`;
      itemList.appendChild(itemListContainer);
    }
    mainPgEl.append(saleslistContainer);
  }
}

//category별 페이지 렌더링
export async function renderCategoryPages(category, search = "") {
  const noItemImg = document.querySelector(".no-result");
  noItemImg.style.display = "none";
  const categoryMap = { christmas: 0, plant: 1, digital: 2, drawer: 3, all: 4 };
  const filteredItems = await filterCategories(search);
  // 검색을 이용하면 전체 카테고리에서 검색.
  if (category !== "all") {
    document.querySelector(".category-title").textContent =
      filteredItems[categoryMap[category]][0].tags;
  } else {
    document.querySelector(".category-title").textContent = "전체";
  }
  const itemList = document.querySelector(".category-itemlist > .itemlist");
  itemList.innerHTML = "";
  // 검색결과 없을때 이미지 띄우기
  if (filteredItems[categoryMap[category]].length === 0) {
    noItemImg.style.display = "flex";
    return;
  }
  for (let j = 0; j < filteredItems[categoryMap[category]].length; j++) {
    const itemListContainer = document.createElement("div");
    itemListContainer.classList.add("itemlist-container");
    itemListContainer.innerHTML = /* html */ `
    <a href="#/detail/${filteredItems[categoryMap[category]][j].id}">
      <div class="itemlist-image">
          <img
            src=${filteredItems[categoryMap[category]][j].thumbnail}
            alt=${filteredItems[categoryMap[category]][j].tags}이미지
          />
      </div>
      <div class="itemlist-detail">
        <div class="itemlist-tag">${
          filteredItems[categoryMap[category]][j].tags
        }</div>
        <div class="itemlist-title">${
          filteredItems[categoryMap[category]][j].title
        }</div>
        <div class="itemlist-price">${filteredItems[categoryMap[category]][
          j
        ].price.toLocaleString()}원</div>
      </div>
      </a>
    </div>
    `;
    itemList.appendChild(itemListContainer);
  }
}
export const email = "";
//상세페이지
export async function renderDetailPages(itemId) {
  const detailItem = await getDetailItem(itemId);
  console.log(detailItem);
  detailContainer.innerHTML = /* html */ `
  <div class="detail-view">
    <div class="thumnail">
      <img
        src=${detailItem.thumbnail}
        alt="${detailItem.title}상품 상세 사진"
      />
    </div>
    <div class="funiture-summary">
      <div class="furniture-tag">${detailItem.tags}</div>
      <div class="furniture-title">${detailItem.title}</div>
      <div class="furniture-price">${detailItem.price.toLocaleString()}원</div>
      <div class="item-addinfo">
        <div class="add-info-title">혜택</div>
        <div class="add-info-content">최대 ${
          Number(detailItem.price) * 0.01
        }P 적립 (회원 1% 적용)</div>
      </div>
      <div class="item-addinfo">
        <div class="add-info-title">배송비</div>
        <div class="add-info-content">3,500원 (100,000원 이상 구매하면 배송비 무료!)</div>
      </div>
      <div class="item-addinfo">
        <div class="add-info-title">교환/반품</div>
        <div class="add-del-info-content">
          배송/교환/반품 안내 자세히 보기
          <span class="material-symbols-outlined"> chevron_right </span>
        </div>
      </div>
      <div class="border-line"></div>
      <div class="buying-option">
        <p>옵션 선택</p>
        <select class="product-selector" type="button">
          <option value="default">기본</option>
          <option value="single-item">단품</option>
        </select>
      </div>
      <div class="buying-button">
        <div>
          <button type="button" class="option-cart">장바구니 담기</button>
        </div>
        <div>
          <button type="button" class="option-buynow">바로 구매</button>
        </div>
      </div>
    </div>
  </div>
  <div class="furniture-container">
    <div class="furniture-detail-view">
      <h2>제품 설명</h2>
    </div>
  </div>
  <div class="furniture-detail-img">
    <img
      src=${detailItem.photo}
      alt="${detailItem.title}제품 상세 사진"
    />
  </div>
  <div class="return-policy">
    <img
      src="https://image.ggumim.co.kr/proxy/20200916100508sKzPhMHtvd.jpeg/aHR0cDovL2ptczgxNS5jYWZlMjQuY29tL2ltZy9kZXRhaWwvY3VtYW1hX2FzLmpwZw"
      alt="반품 사진"
    />
  </div>
  <div class="qna-container">
    <div class="qna-title">
      <h2>Q & A 상품 문의</h2>
      <button type="button">Q&A 작성하기</button>
    </div>
    <div class="qna-content">작성된 Q & A가 없습니다</div>
  </div>

  
  `;
  const optionBtn = document.querySelector(".option-cart");
  const optionBuynow = document.querySelector(".option-buynow");

  // 로그인안했을때 물건을 사려하면... 방어코드 추가.
  optionBtn.addEventListener("click", () => {
    const token = localStorage.getItem("token");
    if (!token) {
      userModalContent.innerHTML = `로그인을 해주세요.`;
      userModal.classList.add("show");
    }
  });
  optionBuynow.addEventListener("click", () => {
    const token = localStorage.getItem("token");
    if (!token) {
      userModalContent.innerHTML = `로그인을 해주세요.`;
      userModal.classList.add("show");
    } else window.location = `#/purchase/${detailItem.id}`;
  });

  // 배송/환불/교환 관련 사진으로 바로 보내줌
  const delInfoBtnEl = document.querySelector(".add-del-info-content");
  const shipElement = document.querySelector(".return-policy");
  delInfoBtnEl.addEventListener("click", () =>
    shipElement.scrollIntoView({
      behavior: "smooth",
    })
  );
  // 장바구니 담기 버튼 클릭
  const optionCart = document.querySelector(".option-cart");
  optionCart.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      userModalContent.innerHTML = `로그인을 해주세요.`;
      userModal.classList.add("show");
      return;
    }
    const email = await authLogin();
    const cartIdArr = JSON.parse(localStorage.getItem(`cartId-${email}`)) || [];
    for (const cartIdEl of cartIdArr) {
      if (cartIdEl === detailItem.id) {
        userModalContent.innerHTML = `이미 장바구니에 담긴 상품입니다.`;
        userModal.classList.add("show");
        return;
      }
    }
    cartIdArr.push(detailItem.id);
    localStorage.setItem(`cartId-${email}`, JSON.stringify(cartIdArr));
    cartItems.innerHTML = "";
    await renderCartPages();
    userModalContent.innerHTML = `장바구니에 상품을 담았습니다.`;
    userModal.classList.add("show");
  });
}

//구매 페이지
export async function renderPurchasePages(itemId) {
  const detailItem = await getDetailItem(itemId);
  const purchaseContainer = document.querySelector(".purchase-inner");
  // 배송비는 가격이 10만이상이면 무료 아니면 3500원
  let shippingFee = 3500;
  if (detailItem.price >= 100000) shippingFee = 0;
  const totalPrice = shippingFee + detailItem.price;
  purchaseContainer.innerHTML = /* html */ `
          <div class="product">
            <div class="product-main">주문상품 1개</div>
            <div class="product-detail">
              <div class="product-tag" style="font-size:11px; color:#646f7c; font-weight:600" >${
                detailItem.tags
              }</div>
              <div class="product-container">
                <img
                  src=${detailItem.thumbnail}
                  width="100px"
                  height="100px"
                  alt=""
                />
                <div class="product-description">
                  <div class="product-title">${detailItem.title}</div>
                  <div class="product-option">기본/1개</div>
                  <div class="product-price">${detailItem.price.toLocaleString()}원</div>
                </div>
              </div>
            </div>
          </div>
          <div class="address">
            <div class="address-title">배송지</div>
            <form>
              <div class="purchase-content">
                <div class="purchase-content-subject">우편번호</div>
                <div class="postal-code-1">
                <input type="text" id="sample6_postcode" class="postalcode" placeholder="우편번호">
                <input type="button" class = "postalcode-find-btn" value="우편번호 찾기">
                </div>
              </div>
              <div class="purchase-content">
              <div class="purchase-content-subject">주소지</div>
              <div class="postal-code-2 ">
              <input type="text" class = "address-input" id="sample6_address" placeholder="주소">
              <input type="text" class = "address-input" id="sample6_detailAddress" placeholder="상세주소">
              <input type="text" class = "address-input" id="sample6_extraAddress" placeholder="참고항목">
              </div>
            </div>
              <div class="purchase-content">
                <div class="purchase-content-subject">배송 메모</div>
                <select class="purchase-content-selector" type="button">
                  <option value="default">배송 메세지를 선택해주세요.</option>
                  <option value="purchase-item">
                    배송 전에 미리 연락 바랍니다.
                  </option>
                  <option value="purchase-item">
                    부재시 경비실에 맡겨 주세요.
                  </option>
                  <option value="purchase-item">
                    부재시 전화 주시거나 문자 남겨 주세요.
                  </option>
                </select>
              </div>
            </form>
          </div>
          <div class="buyer">
            <div class="buyer-title">주문자</div>
            <form>
              <div class="purchase-content">
                <div class="purchase-content-subject">주문자</div>
                <input
                  class="address-content-input"
                  placeholder="이름을 입력해주세요"
                />
              </div>
              <div class="purchase-content">
                <div class="purchase-content-subject">이메일</div>
                <input
                  class="address-content-input"
                  placeholder="이메일을 입력해주세요"
                />
              </div>
              <div class="purchase-content">
                <div class="purchase-content-subject">휴대폰</div>
                <input
                  class="address-content-input"
                  placeholder="전화번호를 입력해주세요"
                />
              </div>
            </form>
          </div>
          <!-- </div> -->
          <div class="payment-amount">
            <div class="payment-amount-title">결제 금액</div>
            <div class="payment-amount-detail">
              <div class="payment-amount-content">
                <div class="payment-amount-content-subjcet">총 상품 금액</div>
                <div class="payment-amount-content-detail">${detailItem.price.toLocaleString()}원</div>
              </div>
              <div class="payment-amount-content">
                <div class="payment-amount-content-subjcet">배송비</div>
                <div class="payment-amount-content-detail">${shippingFee.toLocaleString()}원</div>
              </div>
              <div class="payment-amount-content">
                <div class="payment-amount-content-subjcet" >총 결제 금액</div>
                <div class="payment-amount-content-detail" style="color:red">${totalPrice.toLocaleString()}원</div>
              </div>
            </div>
          </div>
          <div class="payment-method">
            <div class="payment-method-title">결제 수단</div>
            <span class = "payment-selected">선택된 계좌: 케이뱅크</span>
          </div>
          <div class= "payment-method account-select">
            <ul class="payment-method-cfm-msg">
              <li>
                - 최소 결제 가능 금액은 총 결제 금액에서 배송비를 제외한
                금액입니다.
              </li>
              <li>
                - 소액 결제의 경우 PG사 정책에 따라 결제 금액 제한이 있을 수
                있습니다.
              </li>
            </ul>
            <div class="payment-cfm"></div>
            <div class="payment-cfm-btn">
              <button>총 ${totalPrice.toLocaleString()}원 결제하기</button>
            </div>
          </div>
  `;
  // 결제 카드 렌더링하기.
  const paymentMethod = document.querySelector(".payment-method");
  const accountSelect = document.querySelector(".payment-method-select-card");
  const accountImgs = accountSelect.querySelectorAll("img");
  const availableAccounts = await getAccounts();
  // 사용가능한 카드는 색깔을 입혀줌
  for (const account of availableAccounts) {
    accountImgs[bankCode[account.bankCode]].style.filter = "grayscale(0%)";
  }
  paymentMethod.after(accountSelect);
  accountSelect.style.display = "block";

  //우편번호 찾기
  const postalCodeBtnEl = document.querySelector(".postalcode-find-btn");
  const postcodeEl = document.getElementById("sample6_postcode");
  const extraAddress = document.getElementById("sample6_extraAddress");
  const addressEl = document.getElementById("sample6_address");
  const detailAddressEl = document.getElementById("sample6_detailAddress");

  postalCodeBtnEl.addEventListener("click", () => {
    new daum.Postcode({
      oncomplete: function (data) {
        var addr = ""; // 주소 변수
        var extraAddr = ""; // 참고항목 변수

        if (data.userSelectedType === "R") {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        if (data.userSelectedType === "R") {
          if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          if (data.buildingName !== "" && data.apartment === "Y") {
            extraAddr +=
              extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
          }
          if (extraAddr !== "") {
            extraAddr = " (" + extraAddr + ")";
          }
          extraAddress.value = extraAddr;
        } else {
          extraAddress.value = "";
        }
        postcodeEl.value = data.zonecode;
        addressEl.value = addr;
        detailAddressEl.focus();
      },
    }).open();
  });
}
// 장바구니 페이지
let itemsPrice = 0;
export async function renderCartPages() {
  const email = await authLogin();
  const cartIdArr = JSON.parse(localStorage.getItem(`cartId-${email}`));
  const promises = [];
  for (const id of cartIdArr) {
    promises.push(getDetailItem(id));
  }
  let promiseItems = await Promise.all(promises);
  itemsPrice = 0;
  for (const item of promiseItems) {
    const element = document.createElement("li");
    element.classList.add("cart-item");
    const attr = document.createAttribute("data-id");
    attr.value = item.id;
    element.setAttributeNode(attr);
    element.innerHTML = /* html */ `
        <img
          class="cart-img"
          src=${item.thumbnail}
          alt="cart-img"
        />
        <p class="cart-title">${item.title}</p>
        <p class="cart-count">1</p>
        <p class="cart-price">${item.price.toLocaleString()}원</p>
        <img
          class="cart-delete"
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0yMSA5Ljc2MiAyMC4yMzggOSAxNSAxNC4yMzggOS43NjIgOSA5IDkuNzYyIDE0LjIzOCAxNSA5IDIwLjIzOGwuNzYyLjc2MkwxNSAxNS43NjIgMjAuMjM4IDIxbC43NjItLjc2MkwxNS43NjIgMTV6IiBmaWxsPSIjQ0NDIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+Cg=="
          alt="cart-delete"
        />
          `;
    itemsPrice += item.price;
    cartItems.appendChild(element);
    const cartDelete = element.querySelector(".cart-delete");
    const cartTitle = element.querySelector(".cart-title");
    console.log(cartTitle);
    cartDelete.addEventListener("click", (event) => {
      deleteCartItems(event);
      renderPrice();
    });
    cartTitle.addEventListener("click", async (event) => {
      const incartItem = event.currentTarget.closest(".cart-item");

      await renderDetailPages(incartItem.dataset.id);
    });
  }
  renderPrice();
}

function renderPrice() {
  let deliveryFee = 3500;
  singlePrice.textContent = `${itemsPrice.toLocaleString()}원`;
  if (itemsPrice >= 100000) {
    deliveryFee = 0;
    deliveryPrice.textContent = `${deliveryFee}원`;
  } else deliveryPrice.textContent = `${deliveryFee.toLocaleString()}원`;
  totalPrice.textContent =
    (parseInt(itemsPrice) + parseInt(deliveryFee)).toLocaleString() + "원";
}

async function deleteCartItems(event) {
  const incartItem = event.currentTarget.closest(".cart-item");
  const incartPrice = event.currentTarget.previousElementSibling.innerHTML;
  const num = /[^0-9]/g;
  itemsPrice = itemsPrice - incartPrice.replace(num, "");
  cartItems.removeChild(incartItem);
  const email = await authLogin();
  const cartIdArr = JSON.parse(localStorage.getItem(`cartId-${email}`));
  const arr = cartIdArr.filter((cartIdEl) => {
    return incartItem.dataset.id !== cartIdEl;
  });
  if (arr.length === 0) {
    localStorage.removeItem(`cartId-${email}`);
    cartItems.innerHTML = /* html */ `
      <p class="cart-empty">장바구니에 담긴 상품이 없습니다</p>
    `;
    deliveryPrice.textContent = "0원";
    totalPrice.textContent = "0원";
    return;
  }
  localStorage.setItem(`cartId-${email}`, JSON.stringify(arr));
}

//QnA 페이지

const qnaTableContent = document.querySelector(".qna-table-content");
const requsetBtnEl = document.querySelector(".qna-requset-button");
const qnaModal = document.querySelector(".qna-modal");
const backgroundFilter = document.querySelector(".back-ground");
const qnaSubmitBtnEl = document.querySelector(".qna-submit-btn");
const qnaInputEl = document.querySelector(".qna-content");

requsetBtnEl.addEventListener("click", qnaModalOpen);
qnaSubmitBtnEl.addEventListener("click", addQna);

const renderQnA = (title, createdAt) => {
  const createdTime = dayjs(createdAt).format("YYYY년 MM월 DD일");

  qnaTableContent.innerHTML += /* html */ `
  <ul>
  <div class="qna-table-content-inner">
    <div class="content-numbering">대기중</div>
    <div class="content-subject">${title}</div>
    <div class="content-date">${createdTime}</div>
  </div>
</ul>
`;
};

async function addQna() {
  event.preventDefault();
  const qnaTitle = qnaInputEl.value.trim();
  const qnaItem = await postQna(qnaTitle);
  const { title, createdAt } = qnaItem;
  renderQnaList(title, createdAt);
}

function qnaModalOpen() {
  backgroundFilter.style.visibility = "visible";
  qnaModal.style.visibility = "visible";
  document.querySelector(".qna-close-btn").addEventListener("click", () => {
    backgroundFilter.style.visibility = "hidden";
    qnaModal.style.visibility = "hidden";
  });
}

async function renderQnaList() {
  const qnaItems = await getQnA();
  const reverseQna = qnaItems.reverse();
  reverseQna.forEach((qnaItem) => renderQnA(qnaItem.title, qnaItem.createdAt));
}
renderQnaList();
