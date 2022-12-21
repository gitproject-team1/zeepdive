import { alertModal } from "./main";
import { addAccount, getAccounts, removeAccount } from "./requests";
import { bankSelectEl, accountListUl, loadEl } from "./store.js";
// bank elements

const inputBankEl1 = document.querySelector(".bank-add-1");
const inputBankEl2 = document.querySelector(".bank-add-2");
const inputBankEl3 = document.querySelector(".bank-add-3");
const inputBankEl4 = document.querySelector(".bank-add-4");
const allInputBankEl = document.querySelectorAll(".bank-add-input");
const bankPhoneNumEl = document.getElementById("bank-phone-num");
const bankSignatureEl = document.getElementById("account-signature");
const bankRadioBtn = document.querySelectorAll('.bank-radio-btn')
const bankAccountN = document.querySelector(".select-bank");
const bankText  = document.getElementById('.bank-account-num')

let accountNumber = "";
let bankCode = "";

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
  allInputBankEl.forEach((e) => {
    e.style.display = show;
  });
}

export async function accountAddSubmit() {
  accountNumber = "";
  allInputBankEl.forEach((e) => {
    accountNumber += e.value;
  });
  if (!Number(accountNumber)) {
    alertModal("계좌번호는 숫자만 입력해주세요");
  } else {
    if (!Number(bankPhoneNumEl.value)) {
      alertModal("전화번호는 숫자만 입력해주세요");
      bankPhoneNumEl.value = "";
      console.log(bankPhoneNumEl.value);
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

export function clearAccount () {
  accountNumber = ''
  bankPhoneNumEl.value = ''
  bankAccountN.innerHTML = '은행을 선택해주세요'
  bankSignatureEl.checked = false
  bankRadioBtn.forEach(btn => {
    btn.checked = false
  })
  inputDisplay("none");
}

export async function renderUserAccount() {
  loadEl.classList.remove("loader-hidden");
  const accountInfo = await getAccounts();
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
}

function createAccountList(acId, acName, acNum, acBalance, isAccount) {
  const createList = document.createElement("li");
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
