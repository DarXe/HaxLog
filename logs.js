//wyświetlenie ich według id
for (let index = 0; index < a.length; index++) {
    console.log(index);
    console.log(a[index].innerText);
}

//last log a[a.length-1].innerText
//init
function clear(){clearInterval(interval)} //helper
function changeInterval (time){
    clearInterval(interval);
    interval = setInterval(checkLogs, time);
}
function start(){interval = setInterval(checkLogs, 50);}
const a = document.getElementsByClassName("announcement");
const logs = ["null"];
const phrases = ["test"];
var interval;
var lastLog = "";
var newLog = "";
let time;
getTime = () => new Date().toLocaleTimeString(); //funkcja pobierająca aktualny czas

//main
function checkLogs(){
    time = getTime();
    newLog = a[a.length-1].innerText;
    if(newLog != lastLog.substring(9)){
        logs.push(time+" "+newLog); //do tablicy

        console.log(logs.at(-1)) //czat w konsoli
        
        //system sprawdzający
        for(let phrase of phrases){
            if(newLog.toLowerCase().indexOf(phrase.toLowerCase()) != -1){
                console.log(phrase+" NAPISAŁ WIADOMOŚĆ! ! !");
                break;
            }
        }
        lastLog = logs.at(-1); //nowy ostatni zapisany log
    }
}

//const changeInterval = (time)