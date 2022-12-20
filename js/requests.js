import { alertModal } from "./main.js";
import { setItemWithExpireTime, showErrorBox } from "./signup.js";
import { signupEl, loginEl, loginModalEl, userInfoEl } from "./store.js";

const API_KEY = `FcKdtJs202209`;
const USER_NAME = `imyeji`;

// ========== 인증 관련 api ==========
// 회원가입 api
export async function signup(email, password, displayName) {
  try {
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
    if (!res.ok) throw new Error("Request failed");
    alertModal(`회원가입에 성공하였습니다.`);
    location.reload();
  } catch (error) {
    showErrorBox(signupEl.emailOverlapError);
  }
}

// 로그인 api
export async function login(email, password) {
  try {
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
    if (!res.ok) throw new Error("Request failed");
    const json = await res.json();
    // locaStorage에 24시간 만료시간을 설정하고 데이터 저장
    setItemWithExpireTime("token", json.accessToken, 86400000);
    location.reload();
  } catch (error) {
    showErrorBox(loginEl.loginErrorBox);
  }
}

// 로그아웃 api
export async function logout() {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  try {
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
    localStorage.removeItem("token");
    location.href = "/";
    loginModalEl.loginBtnEl.textContent = "로그인/가입";
  } catch (error) {
    console.log("로그아웃에 실패하였습니다.");
  }
}

// 인증 확인 api
export async function authLogin() {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  if (token) {
    try {
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
      userInfoEl.userInfoName.value = json.displayName;
      return json.email;
    } catch (error) {
      console.log("자동 로그인에 실패하였습니다.");
    }
  }
}

// 사용자 정보 수정 api
export async function editUser(content, displayName, oldPassword, newPassword) {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  try {
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
    if (!res.ok) throw new Error("Request failed");
    alertModal(`${content} 변경이 완료되었습니다.`);
  } catch (error) {
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
  try {
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
  } catch (error) {
    console.log("제품 추가에 실패하였습니다.");
  }
}

// 상품 정보 갖고오기
export async function getItem() {
  try {
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
    return json;
  } catch (error) {
    console.log("제품 불러오기에 실패하였습니다.");
  }
}

// 상품 삭제 api
export async function deleteItem(id) {
  try {
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
  } catch (error) {
    console.log("제품 삭제에 실패하였습니다.");
  }
}

// 상품 상세 정보 api
export async function getDetailItem(id) {
  try {
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
    return json;
  } catch (error) {
    console.log("제품 정보를 불러오는데 실패하였습니다.");
  }
}

// 상품 상태변경 api
export async function editItemStatus(id, sold = true) {
  try {
    const res = await fetch(
      `https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/${id}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          apikey: API_KEY,
          username: USER_NAME,
          masterKey: "true",
        },
        body: JSON.stringify({
          isSoldOut: sold,
        }),
      }
    );
    const json = await res.json();
  } catch (error) {
    console.log("제품 상태 변경에 실패하였습니다.");
  }
}

// 상품 검색 api
export async function searchItem(name) {
  try {
    const res = await fetch(
      `https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/search`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          apikey: API_KEY,
          username: USER_NAME,
          masterKey: "true",
        },
        body: JSON.stringify({
          searchText: name,
        }),
      }
    );
    const json = await res.json();
    return json;
  } catch (error) {
    console.log("제품 검색에 실패하였습니다.");
  }
}

// ========== 계좌 관련 api ==========

export async function addAccount(code, accN, phoneN, sign) {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  try {
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
    if (!res.ok) throw new Error("Request failed");
    alertModal("계좌가 연결되었습니다.");
  } catch (error) {
    alertModal(`${json}`);
  }
}

export async function getAccounts() {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  try {
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
  } catch (error) {
    console.log("전체 계좌 목록을 불러오는데 실패하였습니다.");
  }
}

export async function removeAccount(accId, sign) {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  try {
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
    if (!res.ok) throw new Error("Request failed");
    alertModal("삭제되었습니다.");
  } catch (error) {
    alertModal(`${json}`);
  }
}

//QnA API
export async function getQnA() {
  try {
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
  } catch (error) {
    console.log("Q&A정보를 불러오는데 실패하였습니다.");
  }
}

export async function postQna(title) {
  try {
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
  } catch (error) {
    console.log("Q&A 글 작성에 실패하였습니다.");
  }
}

export async function deleteQna(id) {
  try {
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
  } catch (error) {
    console.log("Q&A 삭제에 실패하였습니다.");
  }
}

// 구매 관련 api
export async function purchaseItems(accountId, productId) {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  try {
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
    return json;
  } catch (error) {
    console.log("제품 구매에 실패하였습니다.");
  }
}

// 전체 거래내역 api
export async function getAllPurchases() {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  try {
    const res = await fetch(
      `https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/transactions/details`,
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
    return json;
  } catch (error) {
    console.log("전체 거래 내역을 불러오는데 실패하였습니다.");
  }
}

// 제품 구매 취소 api
export async function cancelPurchase(id) {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  try {
    const res = await fetch(
      `https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/cancel`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          apikey: API_KEY,
          username: USER_NAME,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          detailId: id,
        }),
      }
    );
    const json = await res.json();
    alertModal("거래가 취소되었습니다.");
  } catch (error) {
    console.log("구매 취소에 실패하였습니다.");
  }
}

// 제품 구매 확정 api
export async function confirmPurchase(id) {
  const tokenValue = localStorage.getItem("token");
  const token = JSON.parse(tokenValue).value;
  try {
    const res = await fetch(
      `https://asia-northeast3-heropy-api.cloudfunctions.net/api/products/ok`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          apikey: API_KEY,
          username: USER_NAME,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          detailId: id,
        }),
      }
    );
    const json = await res.json();
    alertModal("거래가 확정되었습니다.");
  } catch (error) {
    console.log("구매 확정에 실패하였습니다.");
  }
}
