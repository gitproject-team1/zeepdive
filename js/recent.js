import { getDetailItem } from "./requests.js";
export const local = window.localStorage;
// const recentlyViewEl = document.querySelector('.recently-veiw')
const recentlyViewUlEl = document.querySelector(".recently-view-list");

export async function recentItemSet() {
  let cnt = 0;
  const tmpId = location.hash.split("/")[2];
  if (local.getItem("recentId") === null) {
    local.setItem("recentId", JSON.stringify([tmpId]));
  } else {
    const recentIdArr = JSON.parse(local.getItem("recentId"));
    for (const x of recentIdArr) {
      if (x === tmpId) {
        ++cnt;
        break;
      }
    }
    if (cnt === 0) {
      recentIdArr.push(tmpId);
    }
    if (recentIdArr.length > 3) {
      recentIdArr.shift();
    }
    local.setItem("recentId", JSON.stringify(recentIdArr));
  }
}

let localRecentList = "";
export async function renderRecent() {
  const recentIdArr = JSON.parse(local.getItem("recentId"));
  if (recentIdArr === null) {
    recentlyViewUlEl.innerHTML =
      ' <li class="none-recent">최근 본 상품이 없습니다!</li>';
    console.log("없음", localRecentList);
  } else {
    console.log("있음", localRecentList);
    recentlyViewUlEl.innerHTML = "";
    localRecentList = "";
    for (const recentId of recentIdArr) {
      console.log(recentId);
      const recentItem = await getDetailItem(recentId);
      const itemTitle = await recentItem.title;
      const itemPrice = await recentItem.price;
      const itemImg = await recentItem.thumbnail;
      await createRecent(recentId, itemTitle, itemPrice, itemImg);
    }
    recentlyViewUlEl.innerHTML = localRecentList;
  }
}
async function createRecent(recentId, recentTitle, recentPr, recentImg) {
  localRecentList += `
  <li class="parent">
    <a href="#/detail/${recentId}">
      <div class="recently-text-box">
        <p>${recentTitle}</p>
        <p>₩ ${recentPr}</p>
      </div>
      <img src="${recentImg}" />
    </a>
  </li>
  `;
  return localRecentList;
}
