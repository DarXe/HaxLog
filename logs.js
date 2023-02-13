//init
function stop(){clearInterval(interval); console.log("Pomyślnie zatrzymano skrypt! Aby uruchomić wpisz start();");}
function restart(){stop(); start();}
function changeInterval (time){
    clearInterval(interval);
    interval = setInterval(checkLogs, time);
}

function start(){interval = setInterval(checkLogs, 25); console.log("Pomyślnie uruchomiono skrypt! Aby zatrzymać wpisz stop();");}
const a = document.getElementsByClassName("announcement");
const logs = ["null"];
let push_logs = false;
const phrases = [];
const notifications = [];
const muted = ["spam"];
let interval;
let lastLog = "";
let newLog = "";
let time;
getTime = () => new Date().toLocaleTimeString(); //funkcja pobierająca aktualny czas

//main
function checkLogs(){
    time = getTime();
    newLog = a[a.length-1].innerText;
    if(newLog != lastLog){
        if(push_logs) logs.push(time+" "+newLog); //do tablicy

        //system cmd
        if(newLog.indexOf("^mute") !== -1){
            let _ = newLog.substring(newLog.indexOf("^mute")+6)
            muted.push(_);
            console.log("WYCISZYŁEŚ GRACZA: "+_);
            lastLog = newLog;
            play();

            return;
        }

        //chat + system mute
        for(let _ of muted){
            if(newLog.indexOf(_) !== -1){
                lastLog = newLog;

                return;
            }
        }
        
        console.log(time+" "+newLog) //czat w konsoli
        
        //system sprawdzający
        for(let phrase of phrases){
            if(newLog.substring(11).toLowerCase().indexOf(phrase.toLowerCase()) !== -1){
                console.log("NOWE POWIADOMIENIE NA FRAZE: "+phrase);
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
    start();
    console.log("Pomyślnie zainicjowano HaxLog!");
//