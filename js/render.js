import { mainPgEl } from "./main.js";
import { getItem } from "./requests.js";

//tags 별로 분류
async function filterCategories() {
  const items = await getItem();
  const christmasItem = items.filter((item) => item.tags[0] === "크리스마스");
  const planteriorItem = items.filter((item) => item.tags[0] === "플랜테리어");
  const cookooItem = items.filter((item) => item.tags[0] === "쿠쿠");
  const drawerItem = items.filter((item) => item.tags[0] === "수납");
  return [christmasItem, planteriorItem, cookooItem, drawerItem, items];
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
			</div>
			`;
      itemList.appendChild(itemListContainer);
    }
    mainPgEl.append(saleslistContainer);
  }
}

//category별 페이지 렌더링
export async function renderCategoryPages(category) {
  const categoryMap = { christmas: 0, plant: 1, digital: 2, drawer: 3, all: 4 };
  const filteredItems = await filterCategories();
  document.querySelector(".category-title").textContent =
    filteredItems[categoryMap[category]][0].tags;
  const itemList = document.querySelector(".category-itemlist > .itemlist");
  for (let j = 0; j < filteredItems[categoryMap[category]].length; j++) {
    const itemListContainer = document.createElement("div");
    itemListContainer.classList.add("itemlist-container");
    itemListContainer.innerHTML = /* html */ `
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
    </div>
    `;
    itemList.appendChild(itemListContainer);
  }
}
