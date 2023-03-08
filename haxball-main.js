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
let pChangeCounter = 0;
let isRanked = false;
let isServerMessage = false;
let autoSave = true;
let consoleChatMuted = true;
let dbm = false; //debug message;
getTime = () => new Date().toLocaleTimeString(); //funkcja pobierająca aktualny czas
getFullTime = () => new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' }); //aktualny czas i datę
const savePlayers = () => {
    localStorage.setItem('players', JSON.stringify(players));
    console.log("[AUTOSAVE] Dane o graczach zostały zapisane!");
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

    if(newLog.charAt(2) !== ':' && newLog.charAt(0) !== '\uD83D'){
        if(push_logs) logs.push(`${time} ${newLog}`); //do tablicy
        if(consoleChat) console.log(`${time} ${newLog}`) //czat w konsoli

        if(newLog.charAt(0) === "[" && newLog.charAt(7) === "]")//is server message
            isServerMessage = true;

        if(isServerMessage && newLog.includes("Tryb rankingowy.")) {//game is ranked?
            isRanked = true;
            savePlayers();
            if(dbm) console.log(`⭐️Debug Message⭐️ Gra rankingowa! Log:${newLog}`);

            return;
        } else if(isServerMessage && newLog.includes("Tryb rozgrzewki (")) {
            isRanked = false;
            if(dbm) console.log(`⭐️Debug Message⭐️ Gra w trybie rozgrzewki! Log:${newLog}`);

            return;
        }

        //statistics
        if (isServerMessage) {
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
                            const playerAssist = newLog.split("⚽ ")[1].split(" (")[1].split(": ")[1].split(")")[0]
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
            if (newLog.includes("ELO.") && !newLog.includes("Straciłeś")) { //player elo
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
        if(newLog.indexOf("^mute") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                let _ = newLog.substring(newLog.indexOf("^mute")+5).trim();
                muted.push(_);
                chat.lastChild.innerText = `👑 HAXLOG 👑 Wyciszyłeś gracza/frazę '${_}'.`;
                localStorage.setItem('muted', JSON.stringify(muted)); //save

                return;
            }
        }else if(newLog.indexOf("^add") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                let _ = newLog.substring(newLog.indexOf("^add")+4).trim()
                phrases.push(_);
                chat.lastChild.innerText = `👑 HAXLOG 👑 Dodałeś do powiadomień frazę '${_}'`;
                localStorage.setItem('phrases', JSON.stringify(phrases)); //save

                return;
            }
        }else if(newLog.indexOf("^time") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
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
            }
        }else if(newLog.indexOf("^console") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
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
            }
        }else if(newLog.indexOf("^del") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                let _ = newLog.substring(newLog.indexOf("^del")+4).trim()
                phrases = phrases.filter(phrase => !phrase.includes(_));
                console.log("👑 Aktualne zapisane frazy: ", phrases);
                chat.lastChild.innerText = `👑 HAXLOG 👑 Usunąłeś z powiadomień frazę '${_}', lista fraz w konsoli.`;
                localStorage.setItem('phrases', JSON.stringify(phrases)); //save

                return;
            }
        }else if(newLog.indexOf("^unmute") !== -1){
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                let _ = newLog.substring(newLog.indexOf("^unmute")+7).trim()
                muted = muted.filter(mute => !mute.includes(_));
                console.log("👑 Aktualne wyciszeni: ", muted);
                chat.lastChild.innerText = `👑 HAXLOG 👑 Odciszyłeś gracza/frazę '${_}', lista wyciszonych w konsoli.`;
                localStorage.setItem('phrases', JSON.stringify(phrases)); //save

                return;
            }
        } else if (newLog.indexOf("^stats") !== -1) {
            const nickname = newLog.substring(newLog.indexOf("^stats")+6).trim();
            chat.lastChild.innerText = showPlayerInfo(nickname);

            return;
        } else if (newLog.indexOf("^top") !== -1) {
            if(newLog.toLowerCase().indexOf(playerNickname) !== -1){
                console.log(`👑 HAXLOG 👑 STATYSTYKI:`);
                topScore();
                chat.lastChild.innerText = `👑 HAXLOG 👑 TOP strzelców i asystentów wyświetlono w konsoli.`;

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

function dataExp(){
    savePlayers();
    return localStorage.getItem('players')
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

const playersNew = players.map(player => {
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
        //lA: new Date(player.lastAction),
        //add: new Date(player.added)
    }
})

function clearPlayers() {
    players = [];
    savePlayers();
}

//1.3.0804 clear players function