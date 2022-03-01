

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

function arrCreate(myword,theword){
    let arr=[];
    let i =0;

    myword.forEach(e => {
        let p =theword.indexOf(e);
        
        if(theword.includes(e)){
            if (p==i) {arr.push([e,0]);}
            else arr.push([e,1]);

            theword.splice( p, 0 );
            myword.splice(i,0);

        }
        else arr.push([e,2]);
            i++;
        
    });
    return arr;

}

function refill(myword){
    let theword =localStorage.getItem('word').toUpperCase();
    theword=theword.toUpperCase();
    myword = myword.toUpperCase();
    console.log(theword);
    console.log(myword);
    let arr = arrCreate(myword.split(""),theword.split(""));

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
    if(trys == 6 || cond ){
        winLose();
    }

}

document.getElementById("btsend").onclick = checkWordValue;
