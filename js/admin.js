import { addItem, getItem, deleteItem } from "./requests.js";
import { adminItemsEl } from "./main.js";

// 제품 추가
export async function createItemEvent(base64Thumbnail, base64Img) {
  const addItemEl = document.querySelectorAll(".add-item-name input");
  const state = {
    name: addItemEl[0].value,
    price: addItemEl[1].value,
    description: addItemEl[2].value,
    tag: addItemEl[3].value,
    thumbnail: base64Thumbnail,
    img: base64Img,
  };
  console.log(state);
  await addItem(state);
  // location.reload();
}

// 전체 제품 렌더링
// 전체 item을 먼저 찾아야함. 거기서 id찾아서 삭제로 보내야함
export async function renderAdminItems() {
  const items = await getItem();
  items.forEach((item) => {
    const items = document.createElement("div");
    items.classList.add("items");
    const itemName = document.createElement("p");
    itemName.classList.add("items-name");
    itemName.textContent = item.title;
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.classList.add("delete-btn");
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash");
    deleteBtn.append(deleteIcon);
    deleteBtn.addEventListener("click", async () => {
      await deleteItem(item.id);
      adminItemsEl.innerHTML = "";
      await renderAdminItems();
    });
    items.append(itemName, deleteBtn);
    adminItemsEl.append(items);
  });
}
