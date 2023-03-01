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
let players = [];
getTime = () => new Date().toLocaleTimeString(); //funkcja pobierająca aktualny czas

//main
function checkLogs(){
    time = getTime();
    newLog = chat.lastElementChild.innerText;

    if(newLog.at(2) !== ":"){
        if(push_logs) logs.push(`${time} ${newLog}`); //do tablicy

        //statistics
        if (newLog.includes("GOAL!")){
            if(newLog.includes("OWN") && newLog.includes("🐸")){
                const playerOwnGoal = newLog.split("🐸 ")[1].split(" (")[0];
                const playerIndex = addPlayer(playerOwnGoal);
                players[playerIndex].ownGoals++;
            }else{
                const playerGoal = newLog.split("⚽ ")[1].split(" (")[0];
                const playerIndex = addPlayer(playerGoal);
                players[playerIndex].goals++;
                players[playerIndex].lastAction = time;
                if (newLog.includes("Assist:")){
                    const playerAssist = newLog.split("⚽ ")[1].split(" (")[1].split(": ")[1].split(")")[0]
                    const playerIndex = addPlayer(playerAssist);
                    players[playerIndex].assists++;
                    players[playerIndex].lastAction = time;
                }
            }
            console.log("👑 HAXLOG 👑 TABLICA GRACZY:")
            console.log(players);

            //save data in local storage
            localStorage.setItem('players', JSON.stringify(players));
        }

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
                console.log("👑 Aktualne zapisane frazy: ", phrases);
                play();

                return;
            }
        }else if(newLog.indexOf("^unmute") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                let _ = newLog.substring(newLog.indexOf("^unmute")+8)
                muted = muted.filter(mute => !mute.includes(_));
                console.log(`👑 HAXLOG 👑 ODCISZYŁEŚ GRACZA: ${_}`);
                console.log("👑 Aktualne wyciszeni: ", muted);
                play();

                return;
            }
        }

        //chat + system mute
        for(let _ of muted){
            if(newLog.indexOf(_) !== -1){
                chat.removeChild(chat.lastElementChild);
                console.log(`👑 HAXLOG 👑 Wyciszona wiadomość: ${newLog}`);
                setTimeout(() => {
                    if(chat.scrollTop === 0){
                        chat.scrollTop = chat.scrollHeight;
                        //fix bug
                        document.getElementsByClassName("ps__rail-x")[0].innerText = "";
                        document.getElementsByClassName("ps__rail-y")[0].innerText = "";
                    }
                }, 2);

                return;
            }
        }
        
        if(consoleChat) console.log(`${time} ${newLog}`) //czat w konsoli
        if(timestamp) chat.lastChild.innerText = `${time} ${newLog}`;
        
        //system sprawdzający powiadomienia na frazy
        for(let phrase of phrases){
            if(newLog.toLowerCase().indexOf(phrase.toLowerCase()) !== -1 && newLog.toLowerCase().indexOf(playerNickname) === -1){
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
function oldStyleHax(){
    document.getElementsByClassName("header")[0].style.display = "block";
    document.getElementsByClassName("game-view")[0].style.flexDirection = "column";
}
function newStyleHax(){
    document.getElementsByClassName("header")[0].style.display="none";
    //document.getElementsByClassName("game-view")[0].style.flexDirection = "column-reverse";
}
function addPlayer(playerName){
    let playerIndex = players.findIndex(player => player.name === playerName);
    
    if (playerIndex === -1){
        players.push({added: time, name: playerName, goals: 0, assists: 0, ownGoals: 0, lastAction: 0});
        playerIndex = players.findIndex(player => player.name === playerName);
    }

    return playerIndex;
}
console.log("Pomyślnie zainicjowano HaxLog!");
function start(){
    stop();
    chat = document.getElementsByClassName("log ps ps--active-y")[0];
    chat.addEventListener("DOMNodeInserted", checkLogs); console.log("Pomyślnie uruchomiono skrypt! Aby zatrzymać wpisz stop();");

    //import data
    const jsonData = localStorage.getItem('players');
    players = JSON.parse(jsonData);
    playerNickname = localStorage['player_name'];
} 
function stop(){chat.removeEventListener("DOMNodeInserted", checkLogs);}
start();
autoConfig();
function autoConfig(){
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

    console.log(`👑 HAXLOG 👑 Witaj ponownie ${playerNickname}! Załadowano ustawienia :)`);
    playerNickname = playerNickname.toLowerCase();
}
//1.03.0119.1 added automatic player name assignment