import { alertModal } from "./main.js";
import { setItemWithExpireTime, showErrorBox } from "./signup.js";
import {
  loginBtnEl,
  userInfoName,
  loginErrorBox,
  emailOverlapError,
} from "./store.js";

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
  if (!res.ok) {
    showErrorBox(emailOverlapError);
    return;
  }
  const json = await res.json();
  location.reload();
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
    // locaStorage에 24시간 만료시간을 설정하고 데이터 저장
    setItemWithExpireTime("token", json.accessToken, 86400000);
    location.reload();
  } else {
    showErrorBox(loginErrorBox);
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
  window.localStorage.removeItem("token");
  window.location = "/";
  loginBtnEl.textContent = "로그인/가입";
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
        apikey: API_KEY,
        username: USER_NAME,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const json = await res.json();
  // 로그인할 때 회원정보에 이름 들어가도록 만들기
  userInfoName.value = json.displayName;
  return json.email;
}

// 사용자 정보 수정 api
export async function editUser(content, displayName, oldPassword, newPassword) {
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
  if (res.ok) {
    const json = await res.json();
    alertModal(`${content} 변경이 완료되었습니다.`);
  } else {
    alertModal(`${content}가 일치하지 않습니다.`);
  }
}

// ========== 관리자 api ==========
export async function addItem({
  name,
  price,
  description,
  tag,
  thumbnail,
  img,
}) {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/products",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        masterKey: "true",
      },
      body: JSON.stringify({
        title: name,
        price: Number(price),
        description: description,
        tags: [tag],
        thumbnailBase64: thumbnail,
        photoBase64: img,
      }),
    }
  );
  const json = await res.json();
  console.log("Response:", json);
}

export async function getItem() {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/products",
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        masterKey: "true",
      },
    }
  );
  const json = await res.json();
  // console.log("Response:", json);
  return json;
}

export async function deleteItem(id) {
  const res = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/${id}`,
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        masterKey: "true",
      },
    }
  );
  const json = await res.json();
  console.log("Response:", json);
}

export async function getDetailItem(id) {
  const res = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/${id}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
      },
    }
  );
  const json = await res.json();
  console.log("Response:", json);
  return json;
}

export async function getAllPurchases() {
  const res = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/transactions/all `,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        masterKey: "true",
      },
    }
  );
  const json = await res.json();
  console.log("Response:", json);
}

// 계좌관련 api

export async function addAccount(code, accN, phoneN, sign) {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/account",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bankCode: code,
        accountNumber: accN,
        phoneNumber: phoneN,
        signature: sign,
      }),
    }
  );
  const json = await res.json();
  console.log(json);
  if (!res.ok) {
    alertModal(`${json}`);
  } else {
    alertModal("계좌가 연결되었습니다.");
  }
}

export async function getAccounts() {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/account",
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const json = await res.json();
  console.log(json);
  return json.accounts;
}

export async function removeAccount(accId, sign) {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/account",
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        accountId: accId, // 계좌 ID (필수!)
        signature: sign, // 사용자 서명 (필수!)
      }),
    }
  );
  const json = await res.json();
  console.log(json);
  if (!res.ok) {
    alertModal(`${json}`);
  } else {
    alertModal("삭제되었습니다.");
  }
}

//QnA API
export async function getQnA() {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos?apikey=FcKdtJs202209&username=KDT3-Tanaka",
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        apikey: "FcKdtJs202209",
        username: "KDT3_Tanaka",
      },
    }
  );
  const json = await res.json();
  return json;
}

export async function postQna(title) {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: "FcKdtJs202209",
        username: "KDT3_Tanaka",
      },
      body: JSON.stringify({
        title,
      }),
    }
  );
  const json = await res.json();
  return json;
}

export async function deleteQna(id) {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos" +
      `/${id}`,
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        apikey: "FcKdtJs202209",
        username: "KDT3_Tanaka",
      },
    }
  );
  const json = await res.json();
  return json;
}

// 구매 관련 api
export async function purchaseItems(accountId, productId) {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  const res = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/buy`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: API_KEY,
        username: USER_NAME,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: productId,
        accountId: accountId,
      }),
    }
  );
  const json = await res.json();
  console.log("Response:", json);
  return json;
}
