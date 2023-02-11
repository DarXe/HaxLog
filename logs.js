//init
function stop(){clearInterval(interval)} //helper
function restart(){stop(); start();}
function changeInterval (time){
    clearInterval(interval);
    interval = setInterval(checkLogs, time);
}

function start(){interval = setInterval(checkLogs, 25); console.log("Pomyślnie uruchomiono skrypt! Aby zatrzymać wpisz stop();")}
const a = document.getElementsByClassName("announcement");
const logs = ["null"];
const phrases = [];
const notifications = [];
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
                notifications.push(); //dodanie powiadomienia do pojemnika
                play();
                break;
            }
        }
        lastLog = logs.at(-1); //nowy ostatni zapisany log
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
    console.log("Pomyślnie zainicjowano HaxLog!")
//