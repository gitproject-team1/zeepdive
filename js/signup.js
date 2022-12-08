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
    if (json.accessToken) {
      localStorage.setItem("token", json.accessToken);
      location.reload();
    }
  } else {
    idboxEl.style.border = "2px solid red";
    pwboxEl.style.border = "2px solid red";
    loginErrorBox.innerHTML = "회원 정보가 올바르지 않습니다.";
  }
}

// 인증 확인 api
export async function authLogin() {
  const token = localStorage.getItem("token");
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
  } else {
    loginBtnEl.textContent = "로그인/가입";
  }
}

// 로그아웃
async function signout() {
  const token = localStorage.getItem("token");
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
