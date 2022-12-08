import {
  emailInputEl,
  passwordInputEl,
  passwordcheckEl,
  displayNameInputEl,
  loginBtn,
  loginId,
  loginPw,
  loginBtnEl,
  test,
} from "./main.js";

import { signup, login, logout, authLogin } from "./requests.js";

const state = {
  email: "",
  password: "",
  displayName: "",
};

const signupEmailBox = document.querySelector(".signup-email-box");
const signupEmailAlert = document.querySelector(".email-alert");
// 회원가입 이벤트
export async function createSubmitEvent(event) {
  event.preventDefault();
  // 이메일
  state.email = emailInputEl.value;
  // const exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
  // if (!exptext.test(email)) {
  //   signupEmailBox.style.border = "2px solid red";
  //   signupEmailAlert.classList.add("show");
  // }
  // 비밀번호
  state.password = passwordInputEl.value;
  // 사용자 이름
  state.displayName = displayNameInputEl.value;
  await signup(state.email, state.password, state.displayName);
  location.reload();
  console.log("done");
}

// 로그인 이벤트
export async function createLoginEvent(event) {
  event.preventDefault();
  state.email = loginId.value;
  state.password = loginPw.value;
  await login(state.email, state.password);
  location.reload();
}

// 만료 시간과 함께 데이터를 저장
export function setItemWithExpireTime(keyName, keyValue, tts) {
  // localStorage에 저장할 객체
  const obj = {
    value: keyValue,
    expire: Date.now() + tts,
  };
  // 객체를 JSON 문자열로 변환
  const objString = JSON.stringify(obj);
  // setItem
  window.localStorage.setItem(keyName, objString);
}

// 만료 시간을 체크하며 데이터 읽기
export function getItemWithExpireTime(keyName) {
  // localStorage 값 읽기(문자열)
  const objString = window.localStorage.getItem(keyName);
  // null 체크
  if (!objString) {
    return null;
  }
  // 문자열을 객체로 변환
  const obj = JSON.parse(objString);
  // 현재시간과 localStorage의 expire 시간 비교
  if (Date.now() > obj.expire) {
    // 만료시간이 지난 item 삭제
    window.localStorage.removeItem(keyName);
    loginBtnEl.textContent = "로그인/가입";
    // null 리턴
    return null;
  }
  // 만료기간이 남아있는 경우, value 값 리턴
  return obj.value;
}
