// let h2 = document.querySelector("h2");
// console.dir(h2.innerText);
let divs = document.querySelectorAll(".box");
 let idx = 1;
for  (div of divs){
    div.innerText = ` new value ${idx}`;
    idx++;
}
console.log(div);