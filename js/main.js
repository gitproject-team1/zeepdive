import {swiper} from './swiper.js'

const firstNav = document.querySelector('ul.nav-1depth > li:first-child')
const backGround = document.querySelector('.back-ground')

// console.log(firstNav.innerHTML)
firstNav.addEventListener('mouseover',() => {
  backGround.style.visibility = 'visible'
})
firstNav.addEventListener('mouseout',() => {
  backGround.style.visibility = 'hidden'
})