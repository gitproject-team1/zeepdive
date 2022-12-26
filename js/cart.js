import { alertModal } from "./main.js";
export function cartIconClick() {
  const token = localStorage.getItem("token");
  if (!token) {
    alertModal(`로그인을 해주세요.`);
    return;
  }
  location.href = "#/cart";
}
