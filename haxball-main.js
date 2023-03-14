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
let inEl = document.querySelector('[data-hook="input"]');
let outEl = document.querySelector('button[data-hook="send"]');
let timestamp;
let consoleChat;
let players = [];
let playerFouls = [];
let pChangeCounter = 0;
let isRanked = false;
let isServerMessage = false;
let isServerInfo = false;
let btAnswers = false;
let collectData = true;
let autoSave = true;
let consoleChatMuted = true;
let dbm = false; //debug message;
let cd = true;
let ver = "1.3.1412.1"; //added more commands
const MESSAGE_COOLDOWN = 30000;
let scriptStarted = new Date().getTime();
let scriptRestarted = 0;
let blockedPlayers = {};
getTime = () => new Date().toLocaleTimeString(); //funkcja pobierająca aktualny czas
getFullTime = () => new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' }); //aktualny czas i datę
document.getElementsByClassName("ps__rail-y")[0].style.color = "transparent";
document.getElementsByClassName("ps__rail-x")[0].style.color = "transparent";
const savePlayers = () => {
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('playerFouls', JSON.stringify(playerFouls));
    console.log("[AUTOSAVE] Dane o graczach zostały zapisane!");
}
const out = (value) => {
    inEl.value = value;
    outEl.dispatchEvent(new MouseEvent('click'));
}
const remLog = () => {
    chat.removeChild(chat.lastElementChild)
    setTimeout(() => {
        if(chat.scrollTop === 0) {
        chat.scrollTop = chat.scrollHeight;
        }
    }, 2);
}
const isBlockedPlayer = (name) => {
    const currentTime = new Date().getTime();
    const timeSinceLastMessage = (currentTime - blockedPlayers[name]);
    
    if (timeSinceLastMessage < MESSAGE_COOLDOWN) {
        if (dbm) console.log(`👑 HAXLOG 👑 Gracz ${name} jest zablokowany. Może wysłać kolejną wiadomość za ${(MESSAGE_COOLDOWN - timeSinceLastMessage)/1000} sekund.`);
        
        return 1;
    }

    return 0;
}
let config = {
    push_logs: false, //domyślnie false, zmień na true jeśli chcesz zapisywać logi do tablicy logs
    timestamp: true, //domyślnie włączona godzina obok wiadomości
    consoleChat: true, //włączony czat w konsoli przeglądarki, ustawienie na fałsz nie wyłącza podglądu wyciszonych wiadomości
    consoleChatMuted: true, //włączone pokazywanie wyciszonych wiadmości w konsoli przeglądarki
    autoSave: true, //automatyczne zapisywanie statystyk, przy wartości false statystyki zapisują się tylko, gdy rozpocznie się gra rankingowa
    debugMessage: false
};

//main
function checkLogs(){
    time = getTime();
    newLog = chat.lastElementChild.innerText;
    isServerMessage = false;
    isServerInfo = false;

    if(newLog.charAt(2) !== ':' && newLog.charAt(0) !== '\uD83D'){
        if(push_logs) logs.push(`${time} ${newLog}`); //do tablicy
        if(newLog.indexOf("%$") !== -1 && cd) {
            remLog();
            if (newLog.toLowerCase().indexOf(playerNickname) === -1) {
                if (newLog.includes("!")) {     
                    let _ = newLog.substring(newLog.indexOf("$!")+2).trim();
                    out(_);
                }
    
                return;
            }
        }

        if (btAnswers) {
            if(newLog.includes(": $")) {
                for(let _ of muted) {
                    if(newLog.indexOf(_) !== -1) {
                        return;
                    }
                }
                const name = newLog.split(" (")[0];
                if(isBlockedPlayer(name)) {

                    return;
                }
                if(newLog.includes("goals")) {
                    let _ = showPlayerStats(name, 'g', 'en');
                    out(_);
                } else if (newLog.includes("assists")) {
                    let _ = showPlayerStats(name, 'a', 'en');
                    out(_);
                } else if (newLog.includes("bramki")) {
                    let _ = showPlayerStats(name, 'g', 'pl');
                    out(_);
                } else if (newLog.includes("asysty")) {
                    let _ = showPlayerStats(name, 'g', 'pl');
                    out(_);
                } else {
                    out("COMMANDS: $bramki $goals $asysty $assists");
                }
                blockedPlayers[name] = new Date().getTime();

                return;
            }
        }

        if(consoleChat) console.log(`${time} ${newLog}`) //czat w konsoli

        if(newLog.charAt(0) === "[" && newLog.charAt(7) === "]") {//is server message
            isServerMessage = true;
        } else if (newLog.charAt(0) === '[' && newLog.charAt(2) === 'S' && newLog.charAt(3) === ' ') {
            isServerInfo = true;
        }
 
        if(isServerMessage && newLog.includes("Tryb rankingowy.")) {//game is ranked?
            isRanked = true;
            savePlayers();
            if(dbm) console.log(`⭐️Debug Message⭐️ Gra rankingowa! Log:${newLog}`);
            //fix bug
            document.getElementsByClassName("ps__rail-x")[0].innerText = "";
            document.getElementsByClassName("ps__rail-y")[0].innerText = "";

            return;
        } else if(isServerMessage && newLog.includes("Tryb rozgrzewki (")) {
            isRanked = false;
            if(dbm) console.log(`⭐️Debug Message⭐️ Gra w trybie rozgrzewki! Log:${newLog}`);
            document.getElementsByClassName("ps__rail-x")[0].innerText = "";
            document.getElementsByClassName("ps__rail-y")[0].innerText = "";

            return;
        }

        //statistics - fouls
        if (isServerInfo && collectData) {
            if (isRanked) {
                if (newLog.includes(" sfaulował ")) { //foul
                    const playerFoul = newLog.split(" sfaulował ")[0].split("ssion] ")[1];
                    const playerIndex = addPlayerFoul(playerFoul);
                    let playerHasFouled;
                    if (newLog.split(" sfaulował ")[1].split("!").length === 3) {
                        playerHasFouled = `${newLog.split(" sfaulował ")[1].split("!")[0]}!`;
                    } else {
                        playerHasFouled = newLog.split(" sfaulował ")[1].split("!")[0];
                    }                  
                    const playerFouledIndex = addPlayerFoul(playerHasFouled);
                    playerFouls[playerIndex].f++; pChangeCounter++;
                    playerFouls[playerIndex].lF = getFullTime(); 
                    playerFouls[playerFouledIndex].hF++;
                    if (autoSave) {savePlayers();}
                    if(dbm) console.log(`⭐️Debug Message⭐️ Gracz ${playerFouls[playerIndex].n} sfaulował gracza ${playerFouls[playerFouledIndex].n} Log:${newLog}`);
                    
                    return;
                } else if (newLog.includes(" Niesportowy faul ")) { //unsportsmanlike foul
                    let playerUnsportsmanlikeFoul;
                    if (newLog.split("y faul wykonany przez ")[1].split("!").length === 3) {
                        playerUnsportsmanlikeFoul = `${newLog.split("y faul wykonany przez ")[1].split("!")[0]}!`;
                    } else {
                        playerUnsportsmanlikeFoul = newLog.split("y faul wykonany przez ")[1].split("!")[0];
                    }                  
                    const playerUnsportsmanlikeFoulIndex = addPlayerFoul(playerUnsportsmanlikeFoul);
                    playerFouls[playerUnsportsmanlikeFoulIndex].unsF++; pChangeCounter++;
                    if (autoSave) {savePlayers();}
                    if(dbm) console.log(`⭐️Debug Message⭐️ Gracz ${playerFouls[playerUnsportsmanlikeFoulIndex].n} wykonał niesportowy faul! Log:${newLog}`);

                    return;
                } else if (newLog.includes(" nie wywołał faulu.")) { //not call a foul
                    const playerNotCallFoul = newLog.split("ssion] ")[1].split(" nie wywołał faulu.")[0];
                    const playerNotCallFoulIndex = addPlayerFoul(playerNotCallFoul);    
                    playerFouls[playerNotCallFoulIndex].nC++; pChangeCounter++;
                    if (autoSave) {savePlayers();}
                    if(dbm) console.log(`⭐️Debug Message⭐️ Gracz ${playerFouls[playerNotCallFoulIndex].n} nie wywołał faulu! Log:${newLog}`);

                    return;
                }
            } else {
                if (newLog.includes(" sfaulował ")) { //unranked foul
                    const playerFoul = newLog.split(" sfaulował ")[0].split("ssion] ")[1];
                    const playerIndex = addPlayerFoul(playerFoul);
                    let playerHasFouled;
                    if (newLog.split(" sfaulował ")[1].split("!").length === 3) {
                        playerHasFouled = `${newLog.split(" sfaulował ")[1].split("!")[0]}!`;
                    } else {
                        playerHasFouled = newLog.split(" sfaulował ")[1].split("!")[0];
                    }                  
                    const playerFouledIndex = addPlayerFoul(playerHasFouled); //unranked has fouled
                    playerFouls[playerIndex].uF++; pChangeCounter++;
                    playerFouls[playerIndex].lF = getFullTime(); 
                    playerFouls[playerFouledIndex].uhF++;
                    if (autoSave) {savePlayers();}
                    if(dbm) console.log(`⭐️Debug Message⭐️ Gracz ${playerFouls[playerIndex].n} sfaulował gracza ${playerFouls[playerFouledIndex].n} Log:${newLog}`);
                    
                    return;
                }
            }
        }
        //statistics - goals, cards
        else if (isServerMessage && collectData) {
            if (isRanked) {
                if (newLog.includes(" 🟨 Żółta")) { //yellow card
                    const playerYellowCard = newLog.split(" kartka dla ")[1].split("!")[0];
                    const playerIndex = addPlayer(playerYellowCard);
                    players[playerIndex].yellowCard++; pChangeCounter++;
                    players[playerIndex].lastAction = getFullTime(); 
                    if (autoSave) {savePlayers();}
                    if(dbm) console.log(`⭐️Debug Message⭐️ Żółta kartka dla ${players[playerIndex].name} Log:${newLog}`);

                    return;
                } else if (newLog.includes(" 🟥 Czerwona")) { //red card
                    const playerRedCard = newLog.split(" kartka dla ")[1].split("!")[0];
                    const playerIndex = addPlayer(playerRedCard);
                    players[playerIndex].redCard++; pChangeCounter++;
                    players[playerIndex].lastAction = getFullTime();
                    if (autoSave) {savePlayers();}
                    if(dbm) console.log(`⭐️Debug Message⭐️ Czerwona kartka dla ${players[playerIndex].name} Log:${newLog}`);

                    return;
                } else if (newLog.includes("GOAL!")){ 
                    if(newLog.includes("OWN") && newLog.includes("🐸")){ //own goal
                        const playerOwnGoal = newLog.split("🐸 ")[1].split(" (")[0];
                        const playerIndex = addPlayer(playerOwnGoal);
                        players[playerIndex].ownGoals++; pChangeCounter++;
                        players[playerIndex].lastAction = getFullTime();
                        if(dbm) console.log(`⭐️Debug Message⭐️ ${players[playerIndex].name} - gol samobójczy! Log:${newLog}`);

                    }else{
                        const playerGoal = newLog.split("⚽ ")[1].split(" (")[0]; //goal
                        const playerIndex = addPlayer(playerGoal);
                        players[playerIndex].goals++; pChangeCounter++;
                        players[playerIndex].lastAction = getFullTime();
                        if(dbm) console.log(`⭐️Debug Message⭐️ GOOOL! ${players[playerIndex].name} Log:${newLog}`);
                        if (newLog.includes("Assist:")){  //assist
                            const playerAssist = newLog.split("⚽ ")[1].split("Assist: ")[1].split(")")[0];
                            const playerIndex = addPlayer(playerAssist);
                            players[playerIndex].assists++; pChangeCounter++;
                            players[playerIndex].lastAction = getFullTime();
                            if(dbm) console.log(`⭐️Debug Message⭐️ Dodatkowo asysta zaliczona przez ${players[playerIndex].name}! Log:${newLog}`);
                        }
                    }
                    if (autoSave) {savePlayers();}

                    return;
                }
            } else {
                if (newLog.includes(" kartka dla ")) { //yellow card
                    const playerCard = newLog.split(" kartka dla ")[1].split("!")[0];
                    const playerIndex = addPlayer(playerCard);
                    players[playerIndex].unrankedCards++; pChangeCounter++;
                    players[playerIndex].lastAction = getFullTime();
                    if (autoSave) {savePlayers();}
                    if(dbm) console.log(`⭐️Debug Message⭐️ [UNRANKED] Kartka dla ${players[playerIndex].name} Log:${newLog}`);
        
                    return;
                } else if (newLog.includes("GOAL!")){ 
                    if(newLog.includes("OWN") && newLog.includes("🐸")){ //own goal
                        const playerOwnGoal = newLog.split("🐸 ")[1].split(" (")[0];
                        const playerIndex = addPlayer(playerOwnGoal);
                        players[playerIndex].unrankedGoals++; pChangeCounter++;
                        players[playerIndex].lastAction = getFullTime();
                        if(dbm) console.log(`⭐️Debug Message⭐️ [UNRANKED] Samobójczy gol strzelony przez ${players[playerIndex].name} Log:${newLog}`);

                    }else{
                        const playerGoal = newLog.split("⚽ ")[1].split(" (")[0]; //goal
                        const playerIndex = addPlayer(playerGoal);
                        players[playerIndex].unrankedGoals++; pChangeCounter++;
                        players[playerIndex].lastAction = getFullTime();
                        if(dbm) console.log(`⭐️Debug Message⭐️ [UNRANKED] Gol strzelony przez ${players[playerIndex].name} Log:${newLog}`);
                    }
                    if (autoSave) {savePlayers();}

                    return;
                }
            }
            if (newLog.includes("ELO.") && !newLog.includes("Straciłeś") && !newLog.includes("Wygrałeś")) { //player elo
                const playerELO = newLog.split(" ma ")[0].split("] ")[1];
                const playerIndex = addPlayer(playerELO);
                players[playerIndex].elo = newLog.split(" ma ")[1].split(" p")[0];
                players[playerIndex].lastAction = getFullTime();
                if (autoSave) {savePlayers();}
                if(dbm) console.log(`⭐️Debug Message⭐️ ${players[playerIndex].name} ma ${players[playerIndex].elo} ELO. Log:${newLog}`);

                return;
            }
        }

        //system cmd
        if(newLog.indexOf("^") !== -1 && newLog.toLowerCase().indexOf(playerNickname) !== -1) {
            if(newLog.indexOf("^mute") !== -1){
                let _ = newLog.substring(newLog.indexOf("^mute")+5).trim();
                muted.push(_);
                chat.lastChild.innerText = `👑 HAXLOG 👑 Wyciszyłeś gracza/frazę '${_}'.`;
                localStorage.setItem('muted', JSON.stringify(muted)); //save

                return;
        }else if(newLog.indexOf("^add") !== -1){
                let _ = newLog.substring(newLog.indexOf("^add")+4).trim()
                phrases.push(_);
                chat.lastChild.innerText = `👑 HAXLOG 👑 Dodałeś do powiadomień frazę '${_}'`;
                localStorage.setItem('phrases', JSON.stringify(phrases)); //save

                return;
            }else if(newLog.indexOf("^time") !== -1){
                if (timestamp) {
                    timestamp = false;
                    chat.lastChild.innerText = `👑 HAXLOG 👑 Wyłączyłeś godzinę obok wiadomości.`;
                } else {
                    timestamp = true;
                    chat.lastChild.innerText = `👑 HAXLOG 👑 Włączyłeś godzinę obok wiadomości.`;
                }
                config.timestamp  = timestamp;
                localStorage.setItem('config', JSON.stringify(config));

                return;
            }else if(newLog.indexOf("^console") !== -1){
                if (consoleChat) {
                    consoleChat = false;
                    chat.lastChild.innerText = `👑 HAXLOG 👑 Wyłączyłeś czat w konsoli.`;
                } else {
                    consoleChat = true;
                    chat.lastChild.innerText = `👑 HAXLOG 👑 Włączyłeś czat w konsoli.`;
                }
                config.consoleChat = consoleChat;
                localStorage.setItem('config', JSON.stringify(config));

                return;
            }else if(newLog.indexOf("^del") !== -1){
                let _ = newLog.substring(newLog.indexOf("^del")+4).trim()
                phrases = phrases.filter(phrase => !phrase.includes(_));
                console.log("👑 Aktualne zapisane frazy: ", phrases);
                chat.lastChild.innerText = `👑 HAXLOG 👑 Usunąłeś z powiadomień frazę '${_}', lista fraz w konsoli.`;
                localStorage.setItem('phrases', JSON.stringify(phrases)); //save

                return;
            }else if(newLog.indexOf("^unmute") !== -1){
                let _ = newLog.substring(newLog.indexOf("^unmute")+7).trim()
                muted = muted.filter(mute => !mute.includes(_));
                console.log("👑 Aktualne wyciszeni: ", muted);
                chat.lastChild.innerText = `👑 HAXLOG 👑 Odciszyłeś gracza/frazę '${_}', lista wyciszonych w konsoli.`;
                localStorage.setItem('phrases', JSON.stringify(phrases)); //save

                return;
            } else if (newLog.indexOf("^stats") !== -1) {
                const nickname = newLog.substring(newLog.indexOf("^stats")+6).trim();
                chat.lastChild.innerText = showPlayerInfo(nickname);

                return;      
            } else if (newLog.indexOf("^top") !== -1) {
                console.log(`👑 HAXLOG 👑 STATYSTYKI:`);
                topScore();
                chat.lastChild.innerText = `👑 HAXLOG 👑 TOP strzelców i asystentów wyświetlono w konsoli.`;

                return;
            } else if (newLog.indexOf("^clearP") !== -1) {
                clearPlayers();
                chat.lastChild.innerText = `👑 HAXLOG 👑 Wyczyszczono! :-)`;

                return;
            } else if (newLog.indexOf("^dataLen") !== -1) {
                chat.lastChild.innerText = `👑 HAXLOG 👑 Info:`;
                const m = `${players.length}, ${playerFouls.length}, v${ver}`; out(m);

                return;
            } else if (newLog.indexOf("^fix") !== -1) {
                elmtFix();

                return;
            } else if (newLog.indexOf("^bot") !== -1) {
                if (!btAnswers) {
                    btAnswers = true;
                    chat.lastChild.innerText = `👑 HAXLOG 👑 Włączyłeś bota`;
                } else {
                    btAnswers = false;
                    chat.lastChild.innerText = `👑 HAXLOG 👑 Wyłączyłeś bota`;
                }

                return;
            } else if (newLog.indexOf("^coll3ct") !== -1) {
                if (!btAnswers) {
                    btAnswers = true;
                    collectData = false;
                    chat.lastChild.innerText = `👑 HAXLOG 👑 ON`;
                } else {
                    btAnswers = false;
                    chat.lastChild.innerText = `👑 HAXLOG 👑 OFF`;
                }
                
                return
            } else if (newLog.indexOf("^started") !== -1) {
                let current = new Date().getTime();
                let timeStarted = (current - scriptStarted) / 1000 / 60;
                let startDate = new Date(scriptStarted);
                let startTime = startDate.toLocaleTimeString();
                if ((scriptRestarted - scriptStarted) < 1000) {
                    chat.lastChild.innerText = `👑 HAXLOG 👑 Skrypt uruchomiony ${timeStarted.toFixed(0)} minut temu o godzinie ${startTime}.`;
                } else {
                    let timeRestarted = (current - scriptRestarted) / 1000 / 60;
                    let restartDate = new Date(scriptRestarted);
                    let restartTime = restartDate.toLocaleTimeString();
                    chat.lastChild.innerText = `👑 HAXLOG 👑 Skrypt zrestartowany ${timeRestarted.toFixed(0)} minut temu o godzinie ${restartTime}. Uruchomiony ${timeStarted.toFixed(2)} minut temu o godzinie ${startTime}.`;
                }

                return;
            } else if (newLog.indexOf("^strd") !== -1) {
                let current = new Date().getTime();
                let timeStarted = (current - scriptStarted) / 1000 / 60;
                let startDate = new Date(scriptStarted);
                let startTime = startDate.toLocaleTimeString();
                if ((scriptRestarted - scriptStarted) < 1000) {
                    let _ = `👑 HAXLOG 👑 Skrypt uruchomiony ${timeStarted.toFixed(0)} minut temu o godzinie ${startTime}.`; out(_);
                } else {
                    let timeRestarted = (current - scriptRestarted) / 1000 / 60;
                    let restartDate = new Date(scriptRestarted);
                    let restartTime = restartDate.toLocaleTimeString();
                    let _ = `👑 HAXLOG 👑 Skrypt zrestartowany ${timeRestarted.toFixed(0)} minut temu o godzinie ${restartTime}. Uruchomiony ${timeStarted.toFixed(2)} minut temu o godzinie ${startTime}.`; out(_);
                }

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
                    }
                }, 2);

                return;
            }
        }

        //timestamp 00:00:00 player: text
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
function addPlayerFoul(playerName){
    let playerIndex = playerFouls.findIndex(player => player.n === playerName);
    
    if (playerIndex === -1){
        playerFouls.push({
            n: playerName, //name
            f: 0, //fouls
            hF: 0, //has fouled
            unsF: 0, //unsportsmanlike foul
            bF: 0, //brutal foul
            nC: 0, //not call a foul
            uF: 0, //unranked fouls
            uhF: 0, //unranked has fouled
            lF: getFullTime() //last foul
        });
        playerIndex = playerFouls.findIndex(player => player.n === playerName);
        console.log(`👑 HAXLOG 👑 Dodano nowego gracza do bazy fauli! To ${playerFouls[playerIndex].n} :)`)
    }

    return playerIndex;
}
function showPlayerInfo(playerName) {
    const playerIndex = players.findIndex(player => player.name === playerName);
    let _ = ``;
    if (playerIndex !== -1) {
        _ = `👑 HAXLOG 👑 Gracz ${players[playerIndex].name} ma ${players[playerIndex].goals} bramek i ${players[playerIndex].assists} asyst. Pełne dane w konsoli ->`;
        console.log(_);
        console.log("👑 Pełne dane: ");
        console.log(players[playerIndex]);
    } else {
        _ = `👑 HAXLOG 👑 Nie ma jeszcze danych o graczu ${playerName} :/`;
    }
    return _;
}
function showPlayerStats(playerName, action, lang) {
    const playerIndex = players.findIndex(player => player.name === playerName);
    let _ = ``;
    if (playerIndex !== -1) {
        switch (action) {
            case 'g':
                {
                    switch (lang) {
                        case 'pl':
                            _ = `Witaj ${players[playerIndex].name}, masz ${players[playerIndex].goals} bramek oraz ${players[playerIndex].unrankedGoals} bramek nierankinowych! Następna komenda za 30s.`;
                            break;
                        case 'en':
                            _ = `Hello ${players[playerIndex].name}, you have ${players[playerIndex].goals} goals and ${players[playerIndex].unrankedGoals} unranked goals! Next command for 30sec.`;
                            break;
                    
                        default:
                            break;
                    }
                }
                break;
            case 'a':
                {
                    switch (lang) {
                        case 'pl':
                            _ = `Witaj ${players[playerIndex].name}, masz ${players[playerIndex].goals} asyst! Następna komenda za 30s.`;
                            break;
                        case 'en':
                            _ = `Hello ${players[playerIndex].name}, you have ${players[playerIndex].assists} assists! Next command for 30sec.`;
                            break;
                    
                        default:
                            break;
                    }
                }
                break;
        
            default:
                break;
        }
        
        console.log(players[playerIndex]);
    } else {
        
        switch (lang) {
            case 'pl':
                _ = `Nie mam jeszcze danych o graczu ${playerName} :/ Do dzieła, jeszcze wszystko przed Tobą!`;
                break;
            case 'en':
                _ = `I don't have player details yet ${playerName} :/ Let's do it, there's more to come!`;
                break;
        
            default:
                break;
        }
    }
    return _;
}
function elmtFix() {
    inEl = document.querySelector('[data-hook="input"]');
    outEl = document.querySelector('button[data-hook="send"]');
}
console.log("Pomyślnie zainicjowano HaxLog!");
function start(){
    stop();
    scriptRestarted = new Date().getTime();
    isRanked = false;
    chat = document.getElementsByClassName("log ps ps--active-y")[0];
    elmtFix();
    chat.addEventListener("DOMNodeInserted", checkLogs); console.log("Pomyślnie uruchomiono skrypt! Aby zatrzymać wpisz stop();");

    //import data
    players = JSON.parse(localStorage.getItem('players'));
    if (players === null) {
        players = [];
    }
    playerFouls = JSON.parse(localStorage.getItem('playerFouls'));
    if (playerFouls === null) {
        playerFouls = [];
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
    if (config.debugMessage === undefined) {
        config.debugMessage = false;
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
    dbm = config.debugMessage;
}

function dataExp(i = 0){
    savePlayers();
    if (i === 2) {
        return localStorage.getItem('playerFouls');
    }
    return localStorage.getItem('players');
}

let players2 = []; //players2 = JSON.parse(string_import_data)
function joinArrays() {
    let newPlayers = 0;
    let actions = 0;
    players2.forEach(player2 => {
        const index = players.findIndex(player => player.name === player2.name);

        if (index === -1) {
            players.push(player2);
            console.log(`${++newPlayers}. Przeniesiono gracza ${player2.name} do players`)
        } else {
            if(player2.goals > 0) {
                console.log(`Gracz ${players[index].name} ma ${players[index].goals} oraz ${player2.goals} bramek`);
                players[index].goals += player2.goals;
                console.log(`Przeniesiono ${player2.goals} bramki gracza ${player2.name} do players, teraz ma ${players[index].goals}`);
                player2.goals = 0;
                actions++;
            }
            if(player2.assists > 0) {
                console.log(`Gracz ${players[index].name} ma ${players[index].assists} oraz ${player2.assists} asyst`);
                players[index].assists += player2.assists;
                console.log(`Przeniesiono ${player2.assists} asysty gracza ${player2.name} do players, teraz ma ${players[index].assists}`);
                player2.assists = 0;
                actions++;
            }
            if(player2.ownGoals > 0) {
                console.log(`Gracz ${players[index].name} ma ${players[index].ownGoals} oraz ${player2.ownGoals} goli samobójczych`);
                players[index].ownGoals += player2.ownGoals;
                console.log(`Przeniesiono ${player2.ownGoals} bramki samobójcze gracza ${player2.name} do players, teraz ma ${players[index].ownGoals}`);
                player2.ownGoals = 0;
                actions++;
            }
            if(player2.yellowCard > 0) {
                console.log(`Gracz ${players[index].name} ma ${players[index].yellowCard} oraz ${player2.yellowCard} żółtych kartek`);
                players[index].yellowCard += player2.yellowCard;
                console.log(`Przeniesiono ${player2.yellowCard} żółte kartki gracza ${player2.name} do players, teraz ma ${players[index].yellowCard}`);
                player2.yellowCard = 0;
                actions++;
            }
            if(player2.redCard > 0) {
                console.log(`Gracz ${players[index].name} ma ${players[index].redCard} oraz ${player2.redCard} czerwonych kartek`);
                players[index].redCard += player2.redCard;
                console.log(`Przeniesiono ${player2.redCard} czerwone kartki gracza ${player2.name} do players, teraz ma ${players[index].redCard}`);
                player2.redCard = 0;
                actions++;
            }
            if(player2.unrankedGoals > 0) {
                console.log(`Gracz ${players[index].name} ma ${players[index].unrankedGoals} oraz ${player2.unrankedGoals} [unranked] bramkek`);
                players[index].unrankedGoals += player2.unrankedGoals;
                console.log(`Przeniesiono ${player2.unrankedGoals} [unranked] bramki gracza ${player2.name} do players, teraz ma ${players[index].unrankedGoals}`);
                player2.unrankedGoals = 0;
                actions++;
            }
            if(player2.unrankedCards > 0) {
                console.log(`Gracz ${players[index].name} ma ${players[index].unrankedCards} oraz ${player2.unrankedCards} [unranked] kartek`);
                players[index].unrankedCards += player2.unrankedCards;
                console.log(`Przeniesiono ${player2.unrankedCards} [unranked] kartki gracza ${player2.name} do players, teraz ma ${players[index].unrankedCards}`);
                player2.unrankedCards = 0;
                actions++;
            }
            if(player2.elo > players[index].elo) {
                console.log(`Elo [${player2.elo}] gracza ${player2.name} jest większe niż ELO [${players[index].elo}] w players '${players[index].elo}'`)
                players[index].elo = player2.elo;
                actions++;
            }

            const lastAction = new Date(player2.lastAction);
            if (lastAction > new Date(players[index].lastAction)) {
                console.log(`Data ${player2.lastAction} jest aktualniejsza niż ${players[index].lastAction}`)
                players[index].lastAction = player2.lastAction;
                actions++;
            }
        }
    });
    console.log(`👑 HAXLOG 👑 Wykonano import z innej bazy do bazy players! Dodano ${newPlayers} nowych graczy oraz wykonano ${actions} przeniesień`);
  //localStorage.setItem('players', JSON.stringify(players));
}

const database = players.map(player => {
    return {
        n: player.name,
        g: player.goals,
        a: player.assists,
        oG: player.ownGoals,
        yC: player.yellowCard,
        rC: player.redCard,
        e: player.elo,
        uG: player.unrankedGoals,
        uC: player.unrankedCards,
        //lA: player.lastAction,
        //add: new Date(player.added)
    }
})

function clearPlayers() {
    players = [];
    playerFouls = [];
    savePlayers();
}
ver = `${ver}.`;
//