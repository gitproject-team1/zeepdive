import { mainPgEl, renderCartPages } from "./main.js";
import { getItem, getDetailItem, authLogin } from "./requests.js";
import { detailContainer, userModalContent, userModal } from "./store.js";

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
  const email = await authLogin();
  // 장바구니 담기 버튼 클릭
  const optionCart = document.querySelector(".option-cart");
  optionCart.addEventListener("click", () => {
    const cartIdArr = JSON.parse(localStorage.getItem(`cartId-${email}`)) || [];
    cartIdArr.push(detailItem.id);
    localStorage.setItem(`cartId-${email}`, JSON.stringify(cartIdArr));
    renderCartPages();
  });
}

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
              <div class="product-tag">${detailItem.tags}</div>
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
                <input
                  class="purchase-content-input"
                  placeholder="우편번호를 입력해주세요"
                />
              </div>
              <div class="purchase-content">
                <div class="purchase-content-subject">주소지</div>
                <input
                  class="purchase-content-input"
                  placeholder="주소를 입력해주세요"
                />
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
                <div class="payment-amount-content-subjcet">총 결제 금액</div>
                <div class="payment-amount-content-detail">${totalPrice.toLocaleString()}원</div>
              </div>
            </div>
          </div>
          <div class="payment-method">
            <div class="payment-method-title">결제 수단</div>
            <div class="payment-method-select-card"></div>
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
          </div>
          <div class="payment-cfm"></div>
          <div class="payment-cfm-btn">
            <button>총 ${totalPrice.toLocaleString()}원 결제하기</button>
          </div>
  `;
}
