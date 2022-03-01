let bsun =document.querySelector("#sunico");
const body =document.querySelector("body");
let mode = localStorage.getItem("mode");
if(mode=="dark"){
    body.classList.toggle('darkmode');
}else{}
bsun.addEventListener('click',e =>{
    let mode = localStorage.getItem("mode");
    if(mode=="dark"){
        localStorage.setItem("mode",'null');
    }else{
        localStorage.setItem("mode",'dark');
    }
    body.classList.toggle('darkmode');
})


let randWord = async() =>{
    try {
        const APIRANDOMW = 'https://random-word-form.herokuapp.com/random/noun';
        let resp = await fetch(APIRANDOMW);
        let word= await resp.json();
        // console.log(resp);
        while(word[0].length !=5){
            resp = await fetch(APIRANDOMW);
            word= await resp.json();
    
        }

        localStorage.setItem('word',word[0]) ;
    } catch (error) {
        console.log(error);
    }
}


let defRand = async(ww='') =>{
    try{
        let word;
        const DIC = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
        if(ww==''){
            word = localStorage.getItem('word');
            let resp = await fetch(`${DIC}${word}`);
            let def = await resp.json();
            
            document.getElementById("def1").textContent= def[0].meanings[0].definitions[0].definition;
            document.getElementById("def2").textContent= def[0].meanings[0].definitions[1].definition;
        }else {
            let resp = await fetch(`${DIC}${ww}`);
            return resp.ok;            
        };

    }catch(error) {
        console.log(error);
        return false;

    }
}

async function initWord(){
    await randWord();
    await defRand();
}
initWord();


let used = [];
let trys = 0;
let cond = false;

function textError(key){
    let mess;
    switch (key) {
        case 0:
            mess=""
            break;
        case 1:
            mess="The word doesn't exist in the dictionary."
            break;
        case 2:
            mess="The length of the word is invalid."
            break;
        case 3:
            mess="The word has already been used."
            break;
        default:
            break;
    }
    document.getElementById("error").textContent =  mess;
}


function noRepeat(arr,elem){
    let aux =[];
    arr.forEach(e => aux.push(e));
    while(aux.indexOf(elem)!=-1){
        aux.splice(aux.indexOf(elem),1);

    }
    return aux;
}

function elemCant(arr){

    let aux=new Map();
    let uniqueArr = new Set(arr);
    let auxxx = arr;
    uniqueArr.forEach(e => {
        let c=0
        auxxx.forEach(i=>{
            if(e==i) {
                c++;
            }
        })
        aux.set(e,c)
        auxxx = noRepeat(auxxx,e);     
    });
    return aux;
}


function arrCreate(myword,theword,len){
    let arrcant = elemCant(theword);
    
    let aux=[];
    for(;len!=0;len--) aux.push(0);
    
    
    
    for (let mm = 0; mm < myword.length; mm++) {
        let cant = arrcant.get(myword[mm]);
        for (let tt = 0; tt < theword.length; tt++) {
            if(mm==tt && myword[mm]== theword[tt] && cant!=0 && typeof aux[mm]=='number'){
                aux.splice(mm,1,[myword[mm],0]);

                let cont=arrcant.get(myword[mm]);
                cont--;
                arrcant.set(myword[mm],cont);

                break;
            }
        }
    }
    
    for (let mm = 0; mm < myword.length; mm++) {
        let cant = arrcant.get(myword[mm]);
        for (let tt = 0; tt < theword.length; tt++) {
            if(mm!=tt && myword[mm]== theword[tt] && cant!=0 && typeof aux[mm]=='number' ){
                aux.splice(mm,1,[myword[mm],1]);

                let cont=arrcant.get(myword[mm]);
                cont--;
                arrcant.set(myword[mm],cont);

                break;
            }   
        }
    }

    for (let aa = 0; aa < aux.length; aa++) {
        if(aux[aa]== 0) aux[aa] = [myword[aa],2];
    }
    return aux;
}

function refill(myword){
    let theword =localStorage.getItem('word').toUpperCase();
    theword=theword.toUpperCase();
    myword = myword.toUpperCase();
    let arr = arrCreate(myword.split(""),theword.split(""),5);

    let doc="";
    arr.forEach(e=>{
        doc+="<td"
        switch(e[1]){
            case 0:
                doc+=` class='acert' > ${e[0]}`;
                break;
            case 1:
                doc+=` class='inword' > ${e[0]}`;
                break;
            case 2:
                doc+=` class='wrong' > ${e[0]}`;
                break;
        }
        doc+="</td>"
    });

    document.getElementById(`cuad${trys}`).innerHTML = doc;

    if(theword==myword){
        cond=true;
    }else{
        used.push(myword);
        trys++;
    }
}


function winLose(){
    if(cond){
        document.getElementById('state').textContent = 'You Won';
        document.getElementById('state').classList.add("ax");
        document.getElementById('word').classList.add("ax");
        
    }else{
        document.getElementById('state').textContent = 'You Lost';
        document.getElementById('state').classList.add("wr");
        document.getElementById('word').classList.add("wr");
        
    }
    let word = localStorage.getItem('word').toUpperCase();
    document.getElementById('word').textContent = `The word is: ${word}`;
    document.getElementById('wantsend').innerHTML = '';
    
    
}


async function checkWordValue(){
    let myword = document.getElementById("areatext").value.toUpperCase();
    if(myword.length == 5){
        textError(0);
        if(used.indexOf(myword)!=-1) textError(3);
        else{
            let cond =  await defRand(myword);
            if (cond){
                refill(myword);
            }else{
                textError(1);
            }
        }
    }else{
        textError(2);
    }
    document.getElementById("areatext").value='';
    if(trys == 6 || cond ){
        winLose();
    }

}

document.getElementById("btsend").onclick = checkWordValue;
