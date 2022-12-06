import {swiper} from './swiper.js'

const firstNav = document.querySelector('ul.nav-1depth > li:first-child')
const backGround = document.querySelector('.back-ground')
const loginBtnEl = document.querySelector('.login')
const loginModal = document.querySelector('.login-modal')
const signupModal = document.querySelector('.signup-modal')

// console.log(firstNav.innerHTML)
firstNav.addEventListener('mouseover',() => {
  backGround.style.visibility = 'visible'
})
firstNav.addEventListener('mouseout',() => {
  backGround.style.visibility = 'hidden'
})
loginBtnEl.addEventListener('click', ()=>{
  backGround.style.visibility = 'visible'
  loginModal.style.visibility = 'visible'
  document.querySelector('.close-login').addEventListener('click',()=>{
    backGround.style.visibility = 'hidden'
    loginModal.style.visibility = 'hidden'
  })
  document.querySelector('.signup').addEventListener('click',()=>{
    signupModal.style.visibility = 'visible'
    loginModal.style.visibility = 'hidden'
    document.querySelector('.close-signup').addEventListener('click',()=>{
      backGround.style.visibility = 'hidden'
      signupModal.style.visibility = 'hidden'
    })
  })
})

