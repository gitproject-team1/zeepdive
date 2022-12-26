import { addItem, getItem, deleteItem } from "./requests.js";

const mainAppEl = document.querySelector(".app");

// 제품 추가
async function createItemEvent(base64Thumbnail, base64Img) {
  const addItemEl = document.querySelectorAll(".add-item-name input");
  const state = {
    name: addItemEl[0].value,
    price: addItemEl[1].value,
    description: addItemEl[2].value,
    tag: addItemEl[3].value,
    thumbnail: base64Thumbnail,
    img: base64Img,
  };
  await addItem(state);
}

// 전체 제품 렌더링
// 전체 item을 먼저 찾아야함. 거기서 id찾아서 삭제로 보내야함
export async function renderAdminItems() {
  mainAppEl.innerHTML = /* html */ `
    <!-- 관리자 페이지 -->
    <article class="admin-page">
      <div class="admin-container">
        <form class="add-item" action="">
          <h3>제품 추가</h3>
          <p class="add-item-name">
            <label for="add-name">제품 이름</label>
            <input type="text" name="name" id="admin-info-name" />
          </p>
          <p class="add-item-name">
            <label for="add-price">제품 가격</label>
            <input type="text" name="price" id="admin-info-price" />
          </p>
          <p class="add-item-name">
            <label for="add-description">제품 설명</label>
            <input type="text" name="tag" id="admin-info-description" />
          </p>
          <p class="add-item-name">
            <label for="add-tag">제품 태그</label>
            <input type="text" name="tag" id="admin-info-tag" />
          </p>
          <p class="add-item-name">
            <label for="add-thumbnail">썸네일</label>
            <input type="file" name="thumbnail" id="admin-info-thumbnail" />
          </p>
          <p class="add-item-name">
            <label for="add-img">상세 사진</label>
            <input type="file" name="img" id="admin-info-img" />
          </p>
          <button class="submit-item" type="submit">추가</button>
        </form>
        <div class="total-items">
          <h3>모든 제품 조회</h3>
          <div class="item-container"></div>
        </div>
      </div>
    </article>
  `;
  //관리자페이지
  const adminThumbnailFile = document.getElementById("admin-info-thumbnail");
  const adminImgFile = document.getElementById("admin-info-img");
  const addItemBtn = document.querySelector(".submit-item");
  const adminItemsEl = document.querySelector(".total-items > .item-container");
  const addItemEl = document.querySelectorAll(".add-item-name input");

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

  // ============ 관리자페이지 ============
  let base64Thumbnail = "";
  let base64Img = "";

  // 썸네일 base64변환 input type="file". 이벤트리스너로 받음
  adminThumbnailFile.addEventListener("change", (event) => {
    const { files } = event.target;
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener("load", (e) => {
        base64Thumbnail = e.target.result;
      });
    }
  });

  // 상세사진 base64변환 input type="file". 이벤트리스너로 받음
  adminImgFile.addEventListener("change", (event) => {
    const { files } = event.target;
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener("load", (e) => {
        base64Img = e.target.result;
      });
    }
  });

  // 전체 정보 서버로 넘김
  addItemBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    await createItemEvent(base64Thumbnail, base64Img);
    location.reload();
  });
}
