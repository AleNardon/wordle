
const sun= "<span class='material-icons sunicon' id='sunico'>  brightness_7</span>";


{/* <span class="material-icons-outlined">
brightness_4
</span> */}

let bsun =document.querySelector("#sunico");
const body =document.querySelector("body");


bsun.addEventListener('click',e =>{
    body.classList.toggle('darkmode');
})
    