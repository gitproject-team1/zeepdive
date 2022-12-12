import { mainPgEl } from "./main.js";
import { getItem } from "./requests.js";

export async function getMainPage() {
  const items = await getItem();
  const christmasItem = items.filter((item) => item.tags[0] === "크리스마스");
  const planteriorItem = items.filter((item) => item.tags[0] === "플랜테리어");
  const cookooItem = items.filter((item) => item.tags[0] === "쿠쿠");
  const drawerItem = items.filter((item) => item.tags[0] === "수납");
  const tagsEl = [christmasItem, planteriorItem, cookooItem, drawerItem];
  const itemTitlesEl = [
    "연말느낌 물씬, 크리스마스🎅",
    "초록을 담은 플랜테리어🌿",
    "쿠쿠하세요 쿠쿠🍚",
    "깔끔한 정리를 위해📦",
  ];
  const itemCommentEl = [
    "집에서 즐기는 홈파티",
    "지친 삶에 활기를 불어넣어요",
    "쿠쿠는 다 잘해요",
    "이것저것 다 넣어드립니다",
  ];

  for (let i = 0; i < 4; i++) {
    const saleslistContainer = document.createElement("section");
    saleslistContainer.classList.add("saleslist-container");
    saleslistContainer.innerHTML = /* html */ `
			<div class="saleslist-header">
					<div class="saleslist-header-main">${itemTitlesEl[i]}</div>
					<div class="saleslist-seemore">
							<button><a href="#">전체 보기</a></button>
					</div>
			</div>
			<div class="saleslist-comment">${itemCommentEl[i]}</div>
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
						alt="test image"
					/>
				</div>
				<div class="itemlist-detail">
					<div class="itemlist-tag">${tagsEl[Math.floor(i)][j].tags}</div>
					<div class="itemlist-title">${tagsEl[Math.floor(i)][j].title}</div>
					<div class="itemlist-price">${tagsEl[Math.floor(i)][j].price}</div>
				</div>
			</div>
			`;
      itemList.appendChild(itemListContainer);
    }
    mainPgEl.append(saleslistContainer);
  }
}
