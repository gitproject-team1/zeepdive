import { signup, login } from "./requests.js";
import {
  loginErrorBox,
  emailInputEl,
  passwordInputEl,
  passwordcheckEl,
  displayNameInputEl,
  loginId,
  loginPw,
  loginBtnEl,
  backGround,
  loginModal,
  signupModal,
  userModal,
  userInfoPw,
  userInfoNewPw,
  userModalContent,
  userInfoName,
  idErrorMsg,
  idboxEl,
  emailErrorMsg,
  singupEmailBox,
  pwLengthMsg,
  signupPwBox,
  pwErrorMsg,
  signupRepwBox,
  exptext,
  signupErrorBox,
  cartItems,
} from "./store.js";
import { editUser, authLogin } from "./requests.js";
import { renderCartPages } from "./main.js";
const state = {
  email: "",
  password: "",
  displayName: "",
};
// 로그인/회원가입 모달 visibility 조정
export async function renderLoginModal() {
  if (loginBtnEl.textContent === "로그인/가입") {
    backGround.style.visibility = "visible";
    loginModal.style.visibility = "visible";
    document.querySelector(".close-login").addEventListener("click", () => {
      backGround.style.visibility = "hidden";
      loginModal.style.visibility = "hidden";
      validationStyle(idErrorMsg, "remove", idboxEl, "#999");
      loginId.value = "";
      loginPw.value = "";
    });
    document.querySelector(".signup").addEventListener("click", () => {
      signupModal.style.visibility = "visible";
      loginModal.style.visibility = "hidden";
      document.querySelector(".close-signup").addEventListener("click", () => {
        backGround.style.visibility = "hidden";
        signupModal.style.visibility = "hidden";
        validationStyle(idErrorMsg, "remove", idboxEl, "#999");
        validationStyle(emailErrorMsg, "remove", singupEmailBox, "#333");
        validationStyle(pwLengthMsg, "remove", signupPwBox, "#333");
        validationStyle(pwErrorMsg, "remove", signupRepwBox, "#333");
        emailInputEl.value = "";
        passwordInputEl.value = "";
        passwordcheckEl.value = "";
        displayNameInputEl.value = "";
      });
    });
  }
}

// 회원가입 이벤트
export async function createSubmitEvent(event) {
  event.preventDefault();
  // 이메일
  state.email = emailInputEl.value;
  // 비밀번호
  state.password = passwordInputEl.value;
  // 사용자 이름
  state.displayName = displayNameInputEl.value;
  if (
    emailInputEl.value &&
    passwordInputEl.value &&
    passwordcheckEl.value &&
    displayNameInputEl.value &&
    passwordInputEl.value === passwordcheckEl.value
  ) {
    await signup(state.email, state.password, state.displayName);
    location.reload();
  } else {
    showErrorBox(signupErrorBox);
  }
}

// 유효성 검사 스타일
async function validationStyle(errormsg, type, element, color) {
  switch (type) {
    case "add":
      errormsg.classList.add("show");
      element.style.border = `1px solid ${color}`;
      break;
    case "remove":
      errormsg.classList.remove("show");
      element.style.border = `1px solid ${color}`;
      break;
    default:
      break;
  }
}

// 로그인 시 유효성 검사
loginId.addEventListener("focusout", () => {
  if (loginId.value && !exptext.test(loginId.value)) {
    validationStyle(idErrorMsg, "add", idboxEl, "#ed234b");
  }
});
loginId.addEventListener("focusin", () => {
  validationStyle(idErrorMsg, "remove", idboxEl, "#999");
});

// 회원가입 유효성 검사
// 이메일
emailInputEl.addEventListener("focusout", () => {
  if (emailInputEl.value && !exptext.test(emailInputEl.value)) {
    validationStyle(emailErrorMsg, "add", singupEmailBox, "#ed234b");
  }
});
emailInputEl.addEventListener("focusin", () => {
  validationStyle(emailErrorMsg, "remove", singupEmailBox, "#333");
});
// 비밀번호 8자리 이상
passwordInputEl.addEventListener("focusout", () => {
  if (passwordInputEl.value && passwordInputEl.value.length < 8) {
    validationStyle(pwLengthMsg, "add", signupPwBox, "#ed234b");
  }
});
passwordInputEl.addEventListener("focusin", () => {
  validationStyle(pwLengthMsg, "remove", signupPwBox, "#333");
});
// 비밀번호 확인
passwordcheckEl.addEventListener("focusout", () => {
  if (passwordInputEl && passwordInputEl.value !== passwordcheckEl.value) {
    validationStyle(pwErrorMsg, "add", signupRepwBox, "#ed234b");
  }
});
passwordcheckEl.addEventListener("focusin", () => {
  validationStyle(pwErrorMsg, "remove", signupRepwBox, "#333");
});

// 로그인 이벤트
export async function createLoginEvent(event) {
  event.preventDefault();
  state.email = loginId.value;
  state.password = loginPw.value;
  await login(state.email, state.password);
}

// 로그인 실패 시 Error Box
export function showErrorBox(errorbox) {
  errorbox.classList.add("show");
  setTimeout(() => {
    errorbox.classList.remove("show");
  }, 1500);
}

// token이 없을 때 회원정보를 클릭하면 로그인을 하라고 모달창
export async function userinfoClick() {
  const token = localStorage.getItem("token");
  if (token) {
    window.location = "#/user";
  } else {
    userModalContent.innerHTML = `로그인을 해주세요.`;
    userModal.classList.add("show");
  }
}

// 회원정보 페이지 비밀번호 변경
export async function pwchange(event) {
  event.preventDefault();
  if (!userInfoPw.value || !userInfoNewPw.value) {
    userModalContent.innerHTML = `비밀번호를 입력해주세요.`;
    userModal.classList.add("show");
    return;
  }
  if (userInfoNewPw.value.length < 8) {
    userModalContent.innerHTML = `비밀번호를 8자리 이상 입력해주세요.`;
    userModal.classList.add("show");
    return;
  }
  await editUser(
    "비밀번호",
    userInfoName.value,
    userInfoPw.value,
    userInfoNewPw.value
  );
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

// 로컬에 로그인 데이터 있는지 확인.
export async function autoLogin() {
  const token = localStorage.getItem("token");
  if (token) {
    loginBtnEl.textContent = "로그아웃";
    await authLogin();
  } else {
    loginBtnEl.textContent = "로그인/가입";
  }
  const email = await authLogin();
  const cartItem = localStorage.getItem(`cartId-${email}`);
  if (cartItem) {
    cartItems.innerHTML = "";
    await renderCartPages();
  }
  // 만료시간 체크는 계속
  getItemWithExpireTime("token");
}
