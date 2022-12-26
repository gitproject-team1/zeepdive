import { alertModal } from "./main";
import { addAccount, getAccounts, removeAccount } from "./requests";
import { loadEl, loginModalEl } from "./store.js";
// bank elements

let accountNumber = "";
let bankCode = "";
const mainAppEl = document.querySelector(".app");

export function bankSelelectEvent(bankValue) {
  let digits = [];
  switch (bankValue) {
    case "농협은행":
      digits = [3, 4, 4, 2];
      bankCode = "011";
      inputDisplay("inline");
      break;
    case "국민은행":
      digits = [3, 2, 4, 3];
      bankCode = "004";
      inputDisplay("inline");
      break;
    case "신한은행":
      digits = [3, 3, 6];
      bankCode = "088";
      inputDisplay("inline");
      break;
    case "카카오뱅크":
      digits = [4, 2, 7];
      bankCode = "090";
      inputDisplay("inline");
      break;
    case "우리은행":
      digits = [4, 3, 6];
      bankCode = "020";
      inputDisplay("inline");
      break;
    case "하나은행":
      digits = [3, 6, 5];
      bankCode = "081";
      inputDisplay("inline");
      break;
    case "케이뱅크":
      digits = [3, 3, 6];
      bankCode = "089";
      inputDisplay("inline");
      break;
  }
  const inputBankEl1 = document.querySelector(".bank-add-1");
  const inputBankEl2 = document.querySelector(".bank-add-2");
  const inputBankEl3 = document.querySelector(".bank-add-3");
  const inputBankEl4 = document.querySelector(".bank-add-4");
  const allInputBankEl = document.querySelectorAll(".bank-add-input");

  const bankAccountN = document.querySelector(".select-bank");

  bankAccountN.innerHTML = `${bankValue}`;

  inputBankEl1.value = "";
  inputBankEl2.value = "";
  inputBankEl3.value = "";
  inputBankEl4.value = "";

  inputBankEl1.setAttribute("maxlength", digits[0]);
  inputBankEl2.setAttribute("maxlength", digits[1]);
  inputBankEl3.setAttribute("maxlength", digits[2]);
  inputBankEl4.setAttribute("maxlength", digits[3]);

  const input4Len = inputBankEl4.getAttribute("maxlength");

  if (input4Len === "undefined") {
    inputBankEl4.style.display = "none";
  } else {
    inputBankEl4.style.display = "inline";
  }
  inputBankEl1.focus();
  allInputBankEl.forEach((e, i) => {
    e.addEventListener("input", () => {
      if (i < 3) {
        if (
          allInputBankEl[i].value.length ===
          Number(allInputBankEl[i].getAttribute("maxlength"))
        ) {
          allInputBankEl[i + 1].focus();
        }
      }
    });
  });
}

function inputDisplay(show) {
  const allInputBankEl = document.querySelectorAll(".bank-add-input");
  allInputBankEl.forEach((e) => {
    e.style.display = show;
  });
}

export async function accountAddSubmit() {
  const allInputBankEl = document.querySelectorAll(".bank-add-input");
  const bankPhoneNumEl = document.getElementById("bank-phone-num");
  const bankSignatureEl = document.getElementById("account-signature");
  const bankSelectEl = document.querySelector(".bank-list");
  let accountNumber = "";
  allInputBankEl.forEach((e) => {
    accountNumber += e.value;
  });
  if (!Number(accountNumber)) {
    alertModal("계좌번호는 숫자만 입력해주세요");
  } else {
    if (!Number(bankPhoneNumEl.value)) {
      alertModal("전화번호는 숫자만 입력해주세요");
      bankPhoneNumEl.value = "";
    } else {
      await addAccount(
        bankCode,
        accountNumber,
        bankPhoneNumEl.value,
        bankSignatureEl.checked
      );
      accountNumber = "";
      bankPhoneNumEl.value = "";
      bankSignatureEl.checked = false;
      bankSelectEl.value = "none";
      inputDisplay("none");
    }
  }
}

export function clearAccount() {
  const bankPhoneNumEl = document.getElementById("bank-phone-num");
  const bankRadioBtn = document.querySelectorAll(".bank-radio-btn");
  const bankSignatureEl = document.getElementById("account-signature");
  const bankAccountN = document.querySelector(".select-bank");
  accountNumber = "";
  bankPhoneNumEl.value = "";
  bankAccountN.innerHTML = "은행을 선택해주세요";
  bankSignatureEl.checked = false;
  bankRadioBtn.forEach((btn) => {
    btn.checked = false;
  });
  inputDisplay("none");
}

export async function renderUserAccount() {
  loadEl.classList.remove("loader-hidden");
  mainAppEl.innerHTML = /* html */ `
    <!-- 회원정보 페이지 -->
    <article class="user-page">
      <div class="user-container">
        <div class="user-info">
          <form class="change-form">
            <h3>회원정보</h3>
            <p class="user-info-name-box">
              <label for="user-info-name">이름</label>
              <input style="display: none" aria-hidden="true" />
              <input type="password" style="display: none" aria-hidden="true" />
              <input
                type="text"
                name="name"
                id="user-info-name"
                autocomplete="new-password"
              />
              <button class="name-change-btn">변경</button>
            </p>
            <!-- user-info-name-box -->
            <p class="user-info-pwd-box">
              <label for="user-info-pwd">비밀번호</label>
              <input style="display: none" aria-hidden="true" />
              <input type="password" style="display: none" aria-hidden="true" />
              <input
                type="password"
                id="user-info-pwd"
                placeholder="기존 비밀번호를 입력하세요"
                autocomplete="new-password"
              />
              <span class="change-pw-box">
                <input
                  type="password"
                  id="user-info-new-pwd"
                  placeholder="변경할 비밀번호를 입력하세요"
                />
                <button class="pw-change-btn">변경</button> </span
              ><!-- /.change-pw-box -->
            </p>
          </form>
          <!-- /.user-info-pwd-box -->
        </div>
        <!-- /.user-info -->

        <div class="bank-info">
          <!-- /.bank-info -->
          <section class="bank-add-section">
            <h3>계좌 관리</h3>
            <!-- bank-add-section -->
            <ul class="account-lists"></ul>
            <div class="remove-check-button-box">
              <span>
                <label for="remove-sign">삭제 동의</label>
                <input type="checkbox" id="account-remove-sign" />
              </span>
              <button class="remove-account">선택계좌 해지하기</button>
            </div>
            <button class="add-account">계좌 연결</button>
            <form class="add-form">
              <ul class="add-top-head">
                <li>
                  <button class="bank-close-btn">
                    <i class="fa-solid fa-circle-xmark"></i>
                  </button>
                </li>
                <li><h4>계좌 연결</h4></li>
                <li></li>
              </ul>
              <fieldset class="bank-list">
                <input
                  type="radio"
                  name="bank-select"
                  value="국민은행"
                  class="bank-radio-btn"
                />
                <input
                  type="radio"
                  name="bank-select"
                  value="우리은행"
                  class="bank-radio-btn"
                />
                <input
                  type="radio"
                  name="bank-select"
                  value="신한은행"
                  class="bank-radio-btn"
                />
                <input
                  type="radio"
                  name="bank-select"
                  value="농협은행"
                  class="bank-radio-btn"
                />
                <input
                  type="radio"
                  name="bank-select"
                  value="케이뱅크"
                  class="bank-radio-btn"
                />
                <input
                  type="radio"
                  name="bank-select"
                  value="카카오뱅크"
                  class="bank-radio-btn"
                />
                <input
                  type="radio"
                  name="bank-select"
                  value="하나은행"
                  class="bank-radio-btn"
                />
              </fieldset>
              <fieldset class="add-account-box">
                <h5 class="select-bank">은행을 선택해주세요</h5>
                <!-- <p class="bank-account-num">계좌번호</p> -->
                <p class="account-box">
                  <input
                    type="text"
                    pattern="[0-9]+"
                    class="bank-add-1 bank-add-input"
                  />
                  <input
                    type="text"
                    pattern="[0-9]+"
                    class="bank-add-2 bank-add-input"
                  />
                  <input
                    type="text"
                    pattern="[0-9]+"
                    class="bank-add-3 bank-add-input"
                  />
                  <input
                    type="text"
                    pattern="[0-9]+"
                    class="bank-add-4 bank-add-input"
                  />
                </p>
                <!-- /.account-box -->
              </fieldset>
              <p class="phone-box">
                <label for="bank-phone-num">휴대폰 번호</label>
                <input
                  type="text"
                  pattern="[0-9]+"
                  maxlength="11"
                  id="bank-phone-num"
                  placeholder="' - ' 를 제외하고 입력해주세요"
                />
              </p>
              <!-- /.phone-box -->
              <p class="signature-box">
                <label for="account-signature">약관 동의</label>
                <input type="checkbox" id="account-signature" />
                <button class="bank-add-btn">계좌 연결</button>
              </p>
              <!-- /.signature-box -->
            </form>
            <!-- bank-add-section -->
          </section>
          <!-- /.add-bank -->
        </div>
        <!-- /.bank-info -->
      </div>
      <!-- /.container -->
      <!-- </div> -->
    </article>
    <!-- /.user-page -->
  `;

  const accountInfo = await getAccounts();
  const accountListUl = document.querySelector(".account-lists");
  accountListUl.innerHTML = "";
  if (!accountInfo.length) {
    createAccountList(1, 1, 1, 1, false);
  } else {
    accountInfo.forEach((element) => {
      const accountId = element.id;
      const accountName = element.bankName;
      const accountNum = element.accountNumber;
      const accountBal = element.balance;
      createAccountList(accountId, accountName, accountNum, accountBal, true);
    });
  }
  loadEl.classList.add("loader-hidden");
  // 계좌 관련 elements
  const bankSelectEl = document.querySelector(".bank-list");
  bankSelectEl.addEventListener("change", (event) => {
    event.preventDefault();
    bankSelelectEvent(event.target.value);
  });

  const accountAddForm = document.querySelector(".add-form");
  const bankSubmitBtn = document.querySelector(".bank-add-btn");
  bankSubmitBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    await accountAddSubmit();
    await renderUserAccount();
    clearAccount();
    accountAddForm.style.display = "none";
    loginModalEl.backGround.style.visibility = "hidden";
  });
  const addAccountBtn = document.querySelector(".add-account");
  addAccountBtn.addEventListener("click", () => {
    accountAddForm.style.display = "flex";
    loginModalEl.backGround.style.visibility = "visible";
  });
  const closeBtn = document.querySelector(".bank-close-btn");
  closeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    clearAccount();
    accountAddForm.style.display = "none";
    loginModalEl.backGround.style.visibility = "hidden";
  });

  const removeAccountBtn = document.querySelector(".remove-account");
  removeAccountBtn.addEventListener("click", async () => {
    await removeAccountFnc();
  });
}

function createAccountList(acId, acName, acNum, acBalance, isAccount) {
  const createList = document.createElement("li");
  const accountListUl = document.querySelector(".account-lists");
  if (!isAccount) {
    createList.innerHTML = `
        <span style="width: max-content;">연결된 계좌가 없습니다. 계좌를 먼저 연결해주세요</span>
      `;
  } else {
    createList.id = acId;
    const tmpacBalance = acBalance
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    createList.innerHTML = `
        <input type="checkbox" id="remove-check">
        <span class="bank-name">${acName}</span>
        <span class="acount-number">${acNum}</span>
        <span class="account-balance">₩ ${tmpacBalance}</span>
      `;
  }
  accountListUl.append(createList);
}

export async function removeAccountFnc() {
  const accountListUl = document.querySelector(".account-lists");
  const accountCheckEl = document.querySelectorAll(
    ".account-lists>li>#remove-check"
  );
  const accountList = document.querySelectorAll(".account-lists>li");
  let arr = [];
  accountCheckEl.forEach((e, i) => {
    if (e.checked) {
      arr.push(
        document
          .getElementById(accountList[i].getAttribute("id"))
          .getAttribute("id")
      );
    }
  });
  const accountRemoveSign = document.querySelector("#account-remove-sign");
  for (const x of arr) {
    await removeAccount(x, accountRemoveSign.checked);
  }
  accountListUl.innerHTML = "";
  accountRemoveSign.checked = false;
  renderUserAccount();
}
