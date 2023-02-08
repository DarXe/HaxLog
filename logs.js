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
                New_sound.play_sound();
                break;
            }
        }
        lastLog = logs.at(-1); //nowy ostatni zapisany log
    }
}

//const changeInterval = (time)

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
	
let New_sound = {
   song: "fffbzfbzz",
   counting: 0,
   scale: {
	f: 349.23,
	b: 493.88,
	z: 0
   },
		
   create() {
	this.oscillator = audioContext.createOscillator();
	this.gainNode = audioContext.createGain();
	this.oscillator.connect(this.gainNode);
	this.gainNode.connect(audioContext.destination);
   },
		
   new_sound(wave, Hz, volume) {
	let now = audioContext.currentTime
	this.oscillator.type = wave;
	this.oscillator.frequency.value = Hz;
	this.gainNode.gain.value = volume;
	this.gainNode.gain.setValueAtTime(1, audioContext.currentTime);
	this.gainNode.gain.exponentialRampToValueAtTime(0.11, now + 1.5);
   }, 
	
   play_sound() {
	const now = audioContext.currentTime;
	if (this.counting == this.song.length) {
		this.counting = 0;
		return;
	}
	if ( this.counting < this.song.length) { 
            let note = this.song.charAt(this.counting); 
            let Hz = this.scale[note]; 
            this.create(); 
            this.new_sound("square", Hz, 1); 
            this.oscillator.start(now); 
            this.counting += 1; } 
            // Aby this w setTimeout odnosiło się do obiektu, a nie do jego metody, trzeba zastosować funkcję strzałkową 
            setTimeout(() => {
		this.oscillator.stop(now + 1.5);
		this.oscillator.disconnect(this.gainNode);
		this.gainNode.disconnect(audioContext.destination);
		let loop = this.play_sound();
	}, 220);
   }
}