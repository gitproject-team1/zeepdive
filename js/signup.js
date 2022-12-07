import {
  emailInputEl,
  passwordInputEl,
  passwordcheckEl,
  displayNameInputEl,
  loginBtn,
  loginId,
  loginPw,
} from "./main.js";

const state = {
  email: "",
  password: "",
  displayName: "",
};

//테스트
export async function createSubmitEvent(event) {
  event.preventDefault();
  state.email = emailInputEl.value;
  state.password = passwordInputEl.value;
  state.displayName = displayNameInputEl.value;
  await signup(state.email, state.password, state.displayName);
  location.reload();
  console.log("done");
}

// 회원가입
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

// const loginId = document.querySelector(".login-id");
// const loginPw = document.querySelector(".login-pw");
// const loginBtn = document.querySelector(".login");

// loginBtn.addEventListener("click", () => {
//   state.email = loginId.value;
//   state.password = loginPw.value;
//   login(state.email, state.password);
// });

export async function createLoginEvent(event) {
  state.email = loginId.value;
  state.password = loginPw.value;
  await login(state.email, state.password);
  location.reload();
  console.log("done");
}

// 로그인
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
  const json = await res.json();
  console.log("Response:", json);
  localStorage.setItem("token", json.accessToken);
}
