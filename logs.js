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
let push_logs;
let phrases = [];
let debugMess = false;
const notifications = [];
let muted = ["spam"];
let interval;
let lastLog = "";
let newLog = "";
let time;
let playerNickname;
let chat = document.getElementsByClassName("log ps ps--active-y")[0];
let timestamp;
let consoleChat;
getTime = () => new Date().toLocaleTimeString(); //funkcja pobierająca aktualny czas

//main
function checkLogs(){
    time = getTime();
    newLog = chat.lastElementChild.innerText;

    if(newLog.at(2) !== ":"){
        if(push_logs) logs.push(`${time} ${newLog}`); //do tablicy

        //system cmd
        if(newLog.indexOf("^mute") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                let _ = newLog.substring(newLog.indexOf("^mute")+6)
                muted.push(_);
                console.log(`👑 HAXLOG 👑 WYCISZYŁEŚ GRACZA: ${_}`);
                play();

                return;
            }
        }else if(newLog.indexOf("^add") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                let _ = newLog.substring(newLog.indexOf("^add")+5)
                phrases.push(_);
                console.log(`👑 HAXLOG 👑 DODAŁEŚ DO POWIADOMIEŃ FRAZĘ: ${_}`);
                play();

                return;
            }
        }else if(newLog.indexOf("^time") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                timestamp = timestamp ? 0 : 1;

                return;
            }
        }
        else if(newLog.indexOf("^console") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                consoleChat = consoleChat ? 0 : 1;

                return;
            }
        }else if(newLog.indexOf("^del") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                let _ = newLog.substring(newLog.indexOf("^del")+5)
                phrases = phrases.filter(phrase => !phrase.includes(_));
                console.log(`👑 HAXLOG 👑 USUNĄŁEŚ Z POWIADOMIEŃ FRAZĘ: ${_}`);
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

                return;
            }
        }
        
        if(consoleChat) console.log(`${time} ${newLog}`) //czat w konsoli
        if(timestamp) chat.lastChild.innerText = `${time} ${newLog}`;
        
        //system sprawdzający powiadomienia na frazy
        for(let phrase of phrases){
            if(newLog.toLowerCase().indexOf(phrase.toLowerCase()) !== -1 && newLog.toLowerCase().indexOf(playerNickname) == -1){
                console.log(`👑 HAXLOG 👑 NOWE POWIADOMIENIE NA FRAZE: ${phrase}`);
                notifications.push(time+newLog); //dodanie powiadomienia do pojemnika
                play();

                break;
            }
        }
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

    push_logs = false; //domyślnie false, zmień na true jeśli chcesz zapisywać logi do tablicy logs
    timestamp = true; //domyślnie włączona godzina obok wiadomości
    consoleChat = true; //włączony czat w konsoli przeglądarki, ustawienie na fałsz nie wyłącza podglądu wyciszonych wiadomości

    //dodaj frazy, na które chcesz powiadomienia dodając do szufladek odpowiednie dane
    phrases[0] = "darxe"; //wielkosc liter nie ma znaczenia!
    phrases[1] = "jakastamwiadomosc";
    phrases[2] = "[Server] Rusz się!";
    phrases[3] = "jakastamwiadomosc";
    phrases[4] = "jakastamwiadomosc";

    //możesz z góry dodać frazy, które chcesz wyciszać na czacie
    muted[0] = "hb.jakjus.com"; //wielkość liter ma znadzenie przy mute!
    muted[1] = "jakastamwiadomosc"
    muted[2] = "jakastamwiadomosc"

    //wiadomość powitalna, nie zmieniaj
    console.log(`👑 HAXLOG 👑 Witaj ponownie ${playerNickname}! Załadowano ustawienia :)`);
    playerNickname = playerNickname.toLowerCase();
}
//1.02.2313 new cmd: ^del nick
//00:48:08 [Server] GOAL! 🟥 0 - 1 🟦 🕒0:33 ⚽ DeVeRaS
//00:48:25 [Server] GOAL! 🟥 1 - 1 🟦 🕒0:41 ⚽ boleco (Assist: bvb)
//💎 You earned 15 coins for being AFK (50% of total). Spend it in !store.⭐️