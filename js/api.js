const APIRANDOMW = 'https://random-word-form.herokuapp.com/random/noun';


let RandWord = async() =>{
    try {
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


let defRand = async() =>{
    try{
        const DIC = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
        let word = localStorage.getItem('word');
        let resp = await fetch(`${DIC}${word}`);
        let def = await resp.json();
        
        document.getElementById("def1").textContent= def[0].meanings[0].definitions[0].definition;
        document.getElementById("def2").textContent= def[0].meanings[0].definitions[1].definition;

    }catch(error) {
        console.log(error);
        

    }
}


RandWord();
defRand();
console.log(localStorage.getItem('word'));
