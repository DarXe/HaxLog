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
let playerNickname;
let chat = document.getElementsByClassName("log ps ps--active-y")[0];
getTime = () => new Date().toLocaleTimeString(); //funkcja pobierająca aktualny czas

//main
function checkLogs(){
    time = getTime();
    newLog = chat.lastElementChild.innerText;

    if(true){
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
                chat.lastElementChild.style.display = "none";
                console.log(`👑 HAXLOG 👑 Wyciszona wiadomość: ${newLog}`);
                setTimeout(scrollDown, 5);
                lastLog = newLog;

                return;
            }
        }
        
        console.log(`${time} ${newLog}`) //czat w konsoli
        chat.lastChild.innerText = `${time} ${newLog}`;
        
        //system sprawdzający powiadomienia na frazy
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

console.log("Pomyślnie zainicjowano HaxLog!");
function start(){
    stop();
    chat = document.getElementsByClassName("log ps ps--active-y")[0];
    chat.addEventListener("DOMNodeInserted", checkLogs); console.log("Pomyślnie uruchomiono skrypt! Aby zatrzymać wpisz stop();");
}
function stop(){chat.removeEventListener("DOMNodeInserted", checkLogs);}
function scrollDown(){
    if(chat.scrollTop == 0){
        chat.scrollTop = chat.scrollHeight;
    }
}
start();
autoConfig();
function autoConfig(){
    //ustaw swój nick
    playerNickname = "[live]darxe"; //wielkosc liter nie ma znaczenia

    //dodaj frazy, na które chcesz powiadomienia dodając do szufladek odpowiednie dane
    phrases[0] = "darxe"; //wielkosc liter nie ma znaczenia!
    phrases[1] = "jakastamwiadomosc";
    phrases[2] = "jakastamwiadomosc";

    //możesz z góry dodać frazy, które chcesz wyciszać na czacie
    muted[0] = "Server"; //wielkość liter ma znadzenie przy mute!
    muted[1] = "jakastamwiadomosc"
    muted[2] = "jakastamwiadomosc"

    //wiadomość powitalna, nie zmieniaj
    console.log(`👑 HAXLOG 👑 Witaj ponownie ${playerNickname}! Załadowano ustawienia :)`);
}
//1.02.2215.2