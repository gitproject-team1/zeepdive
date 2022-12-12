import {
  itemPriceEls,
  itemTagsEls,
  itemTitleEls,
  itemPriceEls,
} from "./store.js";
import { getItem } from "./requests.js";

export async function getMainPage() {
  const items = await getItem();
  const christmasItem = items.filter((item) => item.tags[0] === "크리스마스");
  const planterior = items.filter((item) => item.tags[0] === "플랜테리어");
  const cookoo = items.filter((item) => item.tags[0] === "쿠쿠");
  const drawer = items.filter((item) => item.tags[0] === "플랜테리어");
  for (let i = 0; i < 4; i++) {
    itemTagsEls[i].innerHTML = christmasItem[i].tags;
    itemTitleEls[i].innerHTML = christmasItem[i].title;
    itemPriceEls[i].innerHTML = christmasItem[i].price;
  }
  for (let i = 4; i < 8; i++) {
    itemTagsEls[i].innerHTML = planterior[i].tags;
    itemTitleEls[i].innerHTML = planterior[i].title;
    itemPriceEls[i].innerHTML = planterior[i].price;
  }
}
