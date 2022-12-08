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
  idboxEl,
  pwboxEl,
  loginErrorBox,
} from "./main.js";

const state = {
  email: "",
  password: "",
  displayName: "",
};

// 회원가입 이벤트
export async function createSubmitEvent(event) {
  event.preventDefault();
  state.email = emailInputEl.value;
  state.password = passwordInputEl.value;
  state.displayName = displayNameInputEl.value;
  await signup(state.email, state.password, state.displayName);
  location.reload();
  console.log("done");
}

// 회원가입 api
async function signup(email, password, displayName) {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/signup",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: "FcKdtJs202209",
        username: "imyeji",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        displayName: displayName,
      }),
    }
  );
  console.log(res);
  const json = await res.json();
  console.log("Response:", json);
}

// 로그인 이벤트
export async function createLoginEvent(event) {
  event.preventDefault();
  state.email = loginId.value;
  state.password = loginPw.value;
  await login(state.email, state.password);
  location.reload();
}

// 로그인 api
async function login(email, password) {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/login",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: "FcKdtJs202209",
        username: "imyeji",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }
  );
  if (res.ok) {
    const json = await res.json();
    console.log("Response:", json);
    // locaStorage에 24시간 만료시간을 설정하고 데이터 저장
    setItemWithExpireTime("token", json.accessToken, 86400000);
    location.reload();
  } else {
    idboxEl.style.border = "2px solid red";
    pwboxEl.style.border = "2px solid red";
    loginErrorBox.innerHTML = "회원 정보가 올바르지 않습니다.";
  }
}

// 인증 확인 api
export async function authLogin() {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/me",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: "FcKdtJs202209",
        username: "imyeji",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const json = await res.json();
  console.log("Response:", json);
  if (token) {
    loginBtnEl.textContent = "로그아웃";
    loginBtnEl.addEventListener("click", async () => {
      await signout();
    });
  }
}

// 로그아웃
async function signout() {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/logout",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: "FcKdtJs202209",
        username: "imyeji",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const json = await res.json();
  console.log("Response:", json);
  window.localStorage.removeItem("token");
  location.reload();
  loginBtnEl.textContent = "로그인/가입";
}

// 만료 시간과 함께 데이터를 저장
function setItemWithExpireTime(keyName, keyValue, tts) {
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
