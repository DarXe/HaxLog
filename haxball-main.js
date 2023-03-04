//init

const logs = ["null"];
let push_logs;
let phrases = [];
const notifications = [];
let muted = ["spamm"];
let newLog = "";
let time;
let playerNickname;
let chat = document.getElementsByClassName("log ps ps--active-y")[0];
let timestamp;
let consoleChat;
let players = [];
let isRanked = false;
let isServerMessage = false;
let autoSave = true;
let consoleChatMuted = true;
getTime = () => new Date().toLocaleTimeString(); //funkcja pobierająca aktualny czas
getFullTime = () => new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' }); //aktualny czas i datę
const savePlayers = () => {
    localStorage.setItem('players', JSON.stringify(players));
}
let config = {
    push_logs: false, //domyślnie false, zmień na true jeśli chcesz zapisywać logi do tablicy logs
    timestamp: true, //domyślnie włączona godzina obok wiadomości
    consoleChat: true, //włączony czat w konsoli przeglądarki, ustawienie na fałsz nie wyłącza podglądu wyciszonych wiadomości
    consoleChatMuted: true, //włączone pokazywanie wyciszonych wiadmości w konsoli przeglądarki
    autoSave: true //automatyczne zapisywanie statystyk, przy wartości false statystyki zapisują się tylko, gdy rozpocznie się gra rankingowa
};

//main
function checkLogs(){
    time = getTime();
    newLog = chat.lastElementChild.innerText;
    isServerMessage = false;

    if(newLog.at(2) !== ":"){
        if(push_logs) logs.push(`${time} ${newLog}`); //do tablicy

        if(newLog.charAt(0) === "[" && newLog.charAt(7) === "]")//is server message
            isServerMessage = true;

        if(isServerMessage && newLog.includes("Tryb rankingowy.")) {//game is ranked?
            isRanked = true;
            savePlayers();
        } else if(isServerMessage && newLog.includes("Tryb rozgrzewki (")) {
            isRanked = false;
        }

        //statistics
        if (isServerMessage) {
            if (isRanked) {
                if (newLog.includes(" 🟨 Żółta")) { //yellow card
                    const playerYellowCard = newLog.split(" kartka dla ")[1].split("!")[0];
                    const playerIndex = addPlayer(playerYellowCard);
                    players[playerIndex].yellowCard++; 
                    players[playerIndex].lastAction = getFullTime(); 
                    if (autoSave) {savePlayers();}
                } else if (newLog.includes(" 🟥 Czerwona")) { //red card
                    const playerRedCard = newLog.split(" kartka dla ")[1].split("!")[0];
                    const playerIndex = addPlayer(playerRedCard);
                    players[playerIndex].redCard++; 
                    players[playerIndex].lastAction = getFullTime();
                    if (autoSave) {savePlayers();}

                } else if (newLog.includes("GOAL!")){ 
                    if(newLog.includes("OWN") && newLog.includes("🐸")){ //own goal
                        const playerOwnGoal = newLog.split("🐸 ")[1].split(" (")[0];
                        const playerIndex = addPlayer(playerOwnGoal);
                        players[playerIndex].ownGoals++;
                        players[playerIndex].lastAction = getFullTime();
                    }else{
                        const playerGoal = newLog.split("⚽ ")[1].split(" (")[0]; //goal
                        const playerIndex = addPlayer(playerGoal);
                        players[playerIndex].goals++;
                        players[playerIndex].lastAction = getFullTime();
                        if (newLog.includes("Assist:")){  //assist
                            const playerAssist = newLog.split("⚽ ")[1].split(" (")[1].split(": ")[1].split(")")[0]
                            const playerIndex = addPlayer(playerAssist);
                            players[playerIndex].assists++;
                            players[playerIndex].lastAction = getFullTime();
                        }
                    }
                    console.log("👑 HAXLOG 👑 TABLICA GRACZY:")
                    console.log(players);
                    if (autoSave) {savePlayers();}
                }
            } else {
                if (newLog.includes(" kartka dla ")) { //yellow card
                    const playerCard = newLog.split(" kartka dla ")[1].split("!")[0];
                    const playerIndex = addPlayer(playerCard);
                    players[playerIndex].unrankedCards++;
                    players[playerIndex].lastAction = getFullTime();
                    if (autoSave) {savePlayers();}
        
                } else if (newLog.includes("GOAL!")){ 
                    if(newLog.includes("OWN") && newLog.includes("🐸")){ //own goal
                        const playerOwnGoal = newLog.split("🐸 ")[1].split(" (")[0];
                        const playerIndex = addPlayer(playerOwnGoal);
                        players[playerIndex].unrankedGoals++;
                        players[playerIndex].lastAction = getFullTime();
                    }else{
                        const playerGoal = newLog.split("⚽ ")[1].split(" (")[0]; //goal
                        const playerIndex = addPlayer(playerGoal);
                        players[playerIndex].unrankedGoals++;
                        players[playerIndex].lastAction = getFullTime();
                    }
                    console.log("👑 HAXLOG 👑 TABLICA GRACZY:")
                    console.log(players);
                    if (autoSave) {savePlayers();}
                }
            }
            if (newLog.includes("ELO.")) { //player elo
                const playerELO = newLog.split(" ")[1];
                const playerIndex = addPlayer(playerELO);
                players[playerIndex].elo = newLog.split(" ")[3];
                players[playerIndex].lastAction = getFullTime();
                if (autoSave) {savePlayers();}
            }
        }

        //system cmd
        if(newLog.indexOf("^mute") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                let _ = newLog.substring(newLog.indexOf("^mute")+5).trim()
                muted.push(_);
                console.log(`👑 HAXLOG 👑 WYCISZYŁEŚ GRACZA: ${_}`);
                play();

                localStorage.setItem('muted', JSON.stringify(muted)); //save

                return;
            }
        }else if(newLog.indexOf("^add") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                let _ = newLog.substring(newLog.indexOf("^add")+4).trim()
                phrases.push(_);
                console.log(`👑 HAXLOG 👑 DODAŁEŚ DO POWIADOMIEŃ FRAZĘ: ${_}`);
                play();
                localStorage.setItem('phrases', JSON.stringify(phrases)); //save

                return;
            }
        }else if(newLog.indexOf("^time") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                timestamp = timestamp ? false : true;
                config.timestamp  = timestamp;
                localStorage.setItem('config', JSON.stringify(config));

                return;
            }
        }else if(newLog.indexOf("^console") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                consoleChat = consoleChat ? 0 : 1;
                config.consoleChat = consoleChat;
                localStorage.setItem('config', JSON.stringify(config));

                return;
            }
        }else if(newLog.indexOf("^del") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                let _ = newLog.substring(newLog.indexOf("^del")+4).trim()
                phrases = phrases.filter(phrase => !phrase.includes(_));
                console.log(`👑 HAXLOG 👑 USUNĄŁEŚ Z POWIADOMIEŃ FRAZĘ: ${_}`);
                console.log("👑 Aktualne zapisane frazy: ", phrases);
                play();
                localStorage.setItem('phrases', JSON.stringify(phrases)); //save

                return;
            }
        }else if(newLog.indexOf("^unmute") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                let _ = newLog.substring(newLog.indexOf("^unmute")+7).trim()
                muted = muted.filter(mute => !mute.includes(_));
                console.log(`👑 HAXLOG 👑 ODCISZYŁEŚ GRACZA: ${_}`);
                console.log("👑 Aktualne wyciszeni: ", muted);
                play();
                localStorage.setItem('phrases', JSON.stringify(phrases)); //save

                return;
            }
        } else if (newLog.indexOf("^stats") !== -1) {
            const nickname = newLog.substring(newLog.indexOf("^stats")+6).trim();
            showPlayerInfo(nickname);

            return;
        } else if (newLog.indexOf("^top") !== -1) {
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                console.log(`👑 HAXLOG 👑 STATYSTYKI:`);
                topScore();
                play();

                return;
            }
        } else if (newLog.indexOf("^start") !== -1) {
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                start();
                play();

                return;
            }
        }

        //chat + system mute
        for(let _ of muted){
            if(newLog.indexOf(_) !== -1){
                chat.removeChild(chat.lastElementChild);
                if(consoleChatMuted) console.log(`👑 HAXLOG 👑 Wyciszona wiadomość: ${newLog}`);
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
        players.push({
            added: getFullTime(),
            name: playerName,
            goals: 0,
            assists: 0,
            ownGoals: 0,
            lastAction: getFullTime(),
            elo: 0,
            yellowCard: 0,
            redCard: 0,
            unrankedGoals: 0,
            unrankedCards: 0
        });
        playerIndex = players.findIndex(player => player.name === playerName);
        console.log(`👑 HAXLOG 👑 Dodano nowego gracza do bazy! To ${players[playerIndex].name} :)`)
    }

    return playerIndex;
}
function showPlayerInfo(playerName) {
    const playerIndex = players.findIndex(player => player.name === playerName);
    if (playerIndex !== -1) {
        console.log(`👑 HAXLOG 👑 Gracz ${players[playerIndex].name} ma ${players[playerIndex].goals} bramek i ${players[playerIndex].assists} asyst.`);
        console.log("👑 Pełne dane: ");
        console.log(players[playerIndex]);
    } else {
        console.log(`👑 HAXLOG 👑 Nie ma jeszcze danych o graczu ${playerName} :/`);
    }
  }
console.log("Pomyślnie zainicjowano HaxLog!");
function start(){
    stop();
    isRanked = false;
    chat = document.getElementsByClassName("log ps ps--active-y")[0];
    chat.addEventListener("DOMNodeInserted", checkLogs); console.log("Pomyślnie uruchomiono skrypt! Aby zatrzymać wpisz stop();");

    //import data
    players = JSON.parse(localStorage.getItem('players'));
    if (players === null) {
        players = [];
    }
    phrases = JSON.parse(localStorage.getItem('phrases'));
    if (phrases === null) {
        phrases = [];
    }
    muted = JSON.parse(localStorage.getItem('muted'));
    if (muted === null) {
        muted = [];
    }
    config = JSON.parse(localStorage.getItem('config'));
    if (config === null) {
        config = {
            push_logs: false,
            timestamp: true,
            consoleChat: true,
            consoleChatMuted: true,
            autoSave: true
        };
    }
    
    playerNickname = localStorage['player_name'];
    console.log(`👑 HAXLOG 👑 Witaj ponownie ${playerNickname}! Załadowano ustawienia :)`);
    
    playerNickname = playerNickname.toLowerCase();
} 
function stop(){chat.removeEventListener("DOMNodeInserted", checkLogs);}
start();
autoConfig();

function topScore(){
    let goals = {};
    let assists = {};

    players.forEach(item => {
        if(goals[item.name]){
            goals[item.name] += item.goals;
        }else{
            goals[item.name] = item.goals;
        }
        
        if(assists[item.name]){
            assists[item.name] += item.assists;
        }else{
            assists[item.name] = item.assists;
        }
    });

    const sortedGoals = Object.entries(goals).sort((a, b) => b[1] - a[1]);
    const sortedAssists = Object.entries(assists).sort((a, b) => b[1] - a[1]);

    console.log("Top 10 strzelców:");
    sortedGoals.slice(0, 10).forEach((item, index) => {
    console.log(`${index + 1}. ${item[0]} - ${item[1]}`);
    });

    console.log("Top 10 asystentów:");
    sortedAssists.slice(0, 10).forEach((item, index) => {
    console.log(`${index + 1}. ${item[0]} - ${item[1]}`);
    });
}

function autoConfig() {
    push_logs = config.push_logs;
    timestamp = config.timestamp;
    consoleChat = config.consoleChat;
    consoleChatMuted = config.consoleChatMuted;
    autoSave = config.autoSave;
}
//1.03.0405 + command ^stats for player statistics