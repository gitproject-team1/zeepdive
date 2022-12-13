import {
  addAccount,
  getAccounts,
  removeAccount
} from "./requests"
import {
  userModal,
  userModalContent,
  bankSubmitBtn,
  bankSelectEl,
  accountListUl,
  removeSectionBtn,
  addSectionBtn
} from "./store.js"
// bank elements 

const inputBankEl1 = document.querySelector('.bank-add-1')
const inputBankEl2 = document.querySelector('.bank-add-2')
const inputBankEl3 = document.querySelector('.bank-add-3')
const inputBankEl4 = document.querySelector('.bank-add-4')
const allInputBankEl = document.querySelectorAll('.bank-add-input')
const bankPhoneNumEl = document.getElementById('bank-phone-num')
const bankSignatureEl = document.getElementById('account-signature')
const addSection = document.querySelector('.bank-add-section')
const removeSection = document.querySelector('.bank-remove-section')

let accountNumber = ''
let bankCode = ''

export function bankSelelectEvent() {
  let digits = []
  let select1 = bankSelectEl[bankSelectEl.selectedIndex].value
  switch (select1) {
    case 'none':
      inputDisplay('none');
      break;
    case 'bank-nh':
      digits = [3, 4, 4, 2]
      bankCode = '011'
      inputDisplay('inline');
      break;
    case 'bank-kb':
      digits = [3, 2, 4, 3]
      bankCode = '004'
      inputDisplay('inline');
      break;
    case 'bank-sh':
      digits = [3, 3, 6]
      bankCode = '088'
      inputDisplay('inline');
      break;
    case 'bank-kakao':
      digits = [4, 2, 7]
      bankCode = '090'
      inputDisplay('inline');
      break;
    case 'bank-woori':
      digits = [4, 3, 6]
      bankCode = '020'
      inputDisplay('inline');
      break;
    case 'bank-hana':
      digits = [3, 6, 5]
      bankCode = '081'
      inputDisplay('inline');
      break;
    case 'bank-kbank':
      digits = [3, 6, 5]
      bankCode = '081'
      inputDisplay('inline');
      break;
  }

  inputBankEl1.value = ''
  inputBankEl2.value = ''
  inputBankEl3.value = ''
  inputBankEl4.value = ''

  inputBankEl1.setAttribute('maxlength', digits[0])
  inputBankEl2.setAttribute('maxlength', digits[1])
  inputBankEl3.setAttribute('maxlength', digits[2])
  inputBankEl4.setAttribute('maxlength', digits[3])

  const input4Len = inputBankEl4.getAttribute('maxlength')

  if (input4Len === 'undefined') {
    inputBankEl4.style.display = 'none'
  } else {
    inputBankEl4.style.display = 'inline'
  }
  inputBankEl1.focus()
  allInputBankEl.forEach((e, i) => {
    e.addEventListener('input', () => {
      if (i < 3) {
        if (allInputBankEl[i].value.length === Number(allInputBankEl[i].getAttribute('maxlength'))) {
          allInputBankEl[i + 1].focus()
        }
      }
    })
  })
}

function inputDisplay(display) {
  allInputBankEl.forEach(e => {
    e.style.display = display
  })
}

export async function accountAddSubmit() {
  accountNumber = ''
  allInputBankEl.forEach(e => {
    accountNumber += e.value
  })
  if (!Number(accountNumber)) {
    userModalContent.innerHTML = '계좌번호는 숫자만 입력해주세요';
    userModal.classList.add("show");
    allInputBankEl.forEach(e => {
      e.value = ''
    })
  } else {
    if (!Number(bankPhoneNumEl.value)) {
      userModalContent.innerHTML = '전화번호는 숫자만 입력해주세요';
      userModal.classList.add("show");
      bankPhoneNumEl.value = ''
      console.log(accountNumber)
    } else {
      console.log(accountNumber)
      await addAccount(bankCode, accountNumber, bankPhoneNumEl.value, true)
      accountNumber = ''
      bankPhoneNumEl.value = ''
      bankSignatureEl.checked = false
      bankSelectEl.value = 'none'
      inputDisplay('none');
    }
  }
}

export async function renderUserAccount() {
  const accountInfo = await getAccounts()
  accountListUl.innerHTML = ''
  if (!accountInfo.length) {
    createAccountList(1, 1, 1, 1, false)
  } else {
    accountInfo.forEach(element => {
    console.log(element)
    const accountId = element.id
    const accountName = element.bankName
    const accountNum = element.accountNumber
    const accountBal = element.balance
    createAccountList(accountId, accountName, accountNum, accountBal, true)
    })
  }
}

function createAccountList(acId, acName, acNum, acBalance, isAccount) {
  const createList = document.createElement('li')
  if (!isAccount) {
    createList.innerHTML = `
        <span style="width: max-content;">연결된 계좌가 없습니다. 계좌를 먼저 연결해주세요</span>
      `
  } else {
    createList.id = acId
    acBal = acBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    createList.innerHTML = `
        <input type="checkbox" id="remove-check">
        <span class="bank-name">${acName}</span>
        <span class="acount-number">${acNum}</span>
        <span class="balance">₩ ${acBal}</span>
      `
  }

  accountListUl.append(createList)
}

export function gnbBtnClick(wBtn, bool) {
  if (wBtn === 'add') {
    if (!bool) {
      addSectionBtn.classList.add('on')
      removeSectionBtn.classList.remove('on')
      addSection.style.display = 'block'
      removeSection.style.display = 'none'
    }
  } else if (wBtn === 'remove') {

    if (!bool) {
      removeSectionBtn.classList.add('on')
      addSectionBtn.classList.remove('on')
      addSection.style.display = 'none'
      removeSection.style.display = 'block'
    }
  }
}

export async function removeAccountFnc() {
  const accountCheckEl = document.querySelectorAll('.account-lists>li>#remove-check')
  const accountList = document.querySelectorAll('.account-lists>li')
  let arr = []
  accountCheckEl.forEach((e, i) => {
    if (e.checked) {
      arr.push(document.getElementById(accountList[i].getAttribute('id')).getAttribute('id'))
    }
  })
  const accountRemoveSign = document.querySelector('#account-remove-sign')
  for (const x of arr) {
    await removeAccount(x, accountRemoveSign.checked)
  }
  accountListUl.innerHTML = ''
  accountRemoveSign.checked = false
  renderUserAccount()
}