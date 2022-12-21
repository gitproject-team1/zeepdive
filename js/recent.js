import { getDetailItem } from "./requests.js";
// const recentlyViewEl = document.querySelector('.recently-veiw')
const recentlyViewUlEl = document.querySelector(".recently-view-list");

export async function recentItemSet() {
  let cnt = 0;
  const tmpId = location.hash.split("/")[2];
  if (localStorage.getItem("recentId") === null) {
    localStorage.setItem("recentId", JSON.stringify([tmpId]));
  } else {
    const recentIdArr = JSON.parse(localStorage.getItem("recentId"));
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
    localStorage.setItem("recentId", JSON.stringify(recentIdArr));
  }
}

let localRecentList = "";
export async function renderRecent() {
  const recentIdArr = JSON.parse(localStorage.getItem("recentId"));
  if (recentIdArr === null) {
    recentlyViewUlEl.innerHTML =
      ' <li class="none-recent">최근 본 상품이 없습니다!</li>';
  } else {
    recentlyViewUlEl.innerHTML = "";
    localRecentList = "";
    for (const recentId of recentIdArr) {
      const recentItem = await getDetailItem(recentId);
      const itemTitle = recentItem.title;
      const itemPrice = recentItem.price;
      const itemImg = recentItem.thumbnail;
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
