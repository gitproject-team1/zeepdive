import { addItem } from "./requests.js";

// 제품 추가
export async function createItemEvent() {
  const addItemEl = document.querySelectorAll(".add-item-name input");
  const state = {
    name: addItemEl[0].value,
    price: addItemEl[1].value,
    description: addItemEl[2].value,
    tag: addItemEl[3].value,
    thumbnail: addItemEl[4].value,
    img: addItemEl[5].value,
  };
  console.log(state);
  await addItem(state);
}
