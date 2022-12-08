import { addItem } from "./requests.js";

// 제품 추가
export async function createItemEvent(state) {
  console.log(state);
  await addItem(state);
}
