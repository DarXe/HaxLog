/* old log checking system
function stop(){clearInterval(interval); console.log("Pomyślnie zatrzymano skrypt! Aby uruchomić wpisz start();");}
function restart(){stop(); start();}
function changeInterval (time){
    clearInterval(interval);
    interval = setInterval(checkLogs, time);
}
function start(){interval = setInterval(checkLogs, 25); console.log("Pomyślnie uruchomiono skrypt! Aby zatrzymać wpisz stop();");}
*/

//init

const logs = ["null"];
let push_logs = false;
const phrases = [];
let debugMess = false;
const notifications = [];
const muted = ["spam"];
let interval;
let lastLog = "";
let newLog = "";
let time;
getTime = () => new Date().toLocaleTimeString(); //funkcja pobierająca aktualny czas

//main
function checkLogs(){
    if(chat.scrollTop == 0){
        chat.scrollTop = chat.scrollHeight;
        if(debugMess)
            console.log(`👑 HAXLOG 👑 PRZEWINIETO CZAT  NA DOL2`);
    }else if(debugMess){console.log(`👑 HAXLOG 👑 NIE PRZEWIJA CZATU NA DOL2 ${chat.scrollTop} ${chat.scrollHeight}`);}
    time = getTime();
    newLog = chat.lastElementChild.innerText;
    if(newLog != lastLog){
        if(push_logs) logs.push(`${time} ${newLog}`); //do tablicy

        //system cmd
        if(newLog.indexOf("^mute") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname.toLowerCase()) !== -1){
                let _ = newLog.substring(newLog.indexOf("^mute")+6)
                muted.push(_);
                console.log(`👑 HAXLOG 👑 WYCISZYŁEŚ GRACZA: ${_}`);
                lastLog = newLog;
                play();

                return;
            }
        }else
        if(newLog.indexOf("^add") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname.toLowerCase()) !== -1){
                let _ = newLog.substring(newLog.indexOf("^add")+5)
                phrases.push(_);
                console.log(`👑 HAXLOG 👑 DODAŁEŚ DO POWIADOMIEŃ FRAZĘ: ${_}`);
                lastLog = newLog;
                play();

                return;
            }
        }

        //chat + system mute
        for(let _ of muted){
            if(newLog.indexOf(_) !== -1){
                let __ = chat.lastElementChild.innerText;
                chat.lastElementChild.style.display = "none";
                if(debugMess)
                    console.log(`👑 HAXLOG newLog  ${newLog} lastChild:  ${__}`);
                if(chat.scrollTop == 0){
                    chat.scrollTop = chat.scrollHeight;
                    if(debugMess)
                        console.log(`👑 MUTED 👑 PRZEWINIETO CZAT  NA DOL`);
                }else {if(debugMess) console.log(`👑 MUTED 👑 NIE PRZEWIJA CZATU NA DOL2 ${chat.scrollTop} ${chat.scrollHeight}`);}
                lastLog = newLog;

                return;
            }
        }
        
        console.log(time+" "+newLog) //czat w konsoli
        
        //system sprawdzający
        for(let phrase of phrases){
            if(newLog.substring(11).toLowerCase().indexOf(phrase.toLowerCase()) !== -1){
                console.log(`👑 HAXLOG 👑 NOWE POWIADOMIENIE NA FRAZE: ${phrase}`);
                notifications.push(time+newLog); //dodanie powiadomienia do pojemnika
                play();

                break;
            }
        }
        lastLog = newLog; //nowy ostatni zapisany log
    }
}

//audio
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
function play() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = 440;

    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(10, now);
    gainNode.gain.exponentialRampToValueAtTime(0.11, now + 1);
    oscillator.start(now);
    oscillator.stop(now + 1);
}

let chat = document.getElementsByClassName("log ps ps--active-y")[0];
console.log("Pomyślnie zainicjowano HaxLog!");
function start(){
    stop();
    chat = document.getElementsByClassName("log ps ps--active-y")[0];
    chat.addEventListener("DOMNodeInserted", checkLogs); console.log("Pomyślnie uruchomiono skrypt! Aby zatrzymać wpisz stop();");
}
function stop(){chat.removeEventListener("DOMNodeInserted", checkLogs);}
start();
let playerNickname;
const autoConfig = false;
if(autoConfig){
    playerNickname = "[live]darxe"; //wielkosc liter nie ma znaczenia
    phrases[0] = "darxe"; //wielkosc liter nie ma znaczenia
    muted[0] = "Server";
}
    
else
    playerNickname = prompt("Witaj w HaxLog! Podaj swój dokładny nick z czatu: ")
console.log(`👑 HAXLOG 👑 Ustawiłeś swój nick na: ${playerNickname}`);
//