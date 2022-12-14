import { mainPgEl } from "./main.js";
import { getItem, getDetailItem } from "./requests.js";
import { detailContainer } from "./store.js";

//tags 별로 분류
async function filterCategories(search = "") {
  const items = await getItem();
  const christmasItem = items.filter((item) => item.tags[0] === "크리스마스");
  const planteriorItem = items.filter((item) => item.tags[0] === "플랜테리어");
  const cookooItem = items.filter((item) => item.tags[0] === "쿠쿠");
  const drawerItem = items.filter((item) => item.tags[0] === "수납");
  // console.log(search);
  const searchItem = items.filter((item) => item.title.includes(search));
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
  const categoryMap = { christmas: 0, plant: 1, digital: 2, drawer: 3, all: 4 };
  const filteredItems = await filterCategories(search);
  console.log(filteredItems[categoryMap[category]]);
  document.querySelector(".category-title").textContent =
    filteredItems[categoryMap[category]][0].tags;
  const itemList = document.querySelector(".category-itemlist > .itemlist");
  itemList.innerHTML = "";
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
  const delInfoBtnEl = document.querySelector(".add-del-info-content");
  const shipElement = document.querySelector(".return-policy");
  delInfoBtnEl.addEventListener("click", () =>
    shipElement.scrollIntoView({
      behavior: "smooth",
    })
  );
}
