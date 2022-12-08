import { setItemWithExpireTime } from "./signup.js";
import { loginBtnEl, idboxEl, pwboxEl, loginErrorBox } from "./main.js";

const API_KEY = `FcKdtJs202209`;
const USER_NAME = `imyeji`;

// 회원가입 api
export async function signup(email, password, displayName) {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/signup",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
      },
      body: JSON.stringify({
        email: email,
        password: password,
        displayName: displayName,
      }),
    }
  );
  const json = await res.json();
  console.log("Response:", json);
}

// 로그인 api
export async function login(email, password) {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/login",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
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

// 로그아웃 api
export async function logout() {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/logout",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const json = await res.json();
  console.log("Response:", json);
  window.localStorage.removeItem("token");
  location.reload();
  // 만약에 #/user에서 로그아웃을 하면 / 로 나오게 하기
  window.location = "/";
  loginBtnEl.textContent = "로그인/가입";
}

export const userInfoName = document.getElementById("user-info-name");
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
        apikey: API_KEY,
        username: USER_NAME,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const json = await res.json();
  console.log("Response:", json);
  if (token) {
    loginBtnEl.addEventListener("click", async () => {
      await logout();
    });
    // 로그인할 때 회원정보에 이름 들어가도록 만들기
    userInfoName.value = json.displayName;
  }
}

// 사용자 정보 수정 api
async function editUser(displayName, oldPassword, newPassword) {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/auth/user",
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        displayName,
        oldPassword,
        newPassword,
      }),
    }
  );
  const json = await res.json();
  console.log("Response:", json);
}

// 이름 옆에 변경 버튼 누르면 이름 변경되도록 만들기
const nameChangeBtn = document.querySelector(".name-change-btn");
nameChangeBtn.addEventListener("click", async () => {
  await editUser(userInfoName.value);
});

// 비밀번호 변경 버튼 누르면 비밀번호 변경되도록 만들기
const userInfoPw = document.getElementById("user-info-pwd");
const userInfoNewPw = document.getElementById("user-info-new-pwd");
const pwChangeBtn = document.querySelector(".pw-change-btn");
pwChangeBtn.addEventListener("click", async () => {
  await editUser(userInfoName.value, userInfoPw.value, userInfoNewPw.value);
});
