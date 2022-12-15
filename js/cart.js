import { userModalContent, userModal } from "./store.js";
import { renderCartPages } from "./render.js";
export async function cartIconClick() {
  const token = localStorage.getItem("token");
  if (!token) {
    userModalContent.innerHTML = `로그인을 해주세요.`;
    userModal.classList.add("show");
    return;
  }
  window.location = "#/cart";
}
