//pobranie elementów z czatu
const a = document.getElementsByClassName("announcement")

//wyświetlenie ich według id
for (let index = 0; index < a.length; index++) {
    console.log(index);
    console.log(a[index].innerText);
}

//last log a[a.length-1].innerText

const logs = []
//system zapisywania logów
//dodanie logu jeśli się różni od poprzedniego
if(a[a.length-1].innerText!=logs[logs.length-1]){
	logs.push(a[a.length-1].innerText);
}
var interval;
function checkLogs(){
    console.log("check");
}

function changeInterval (func, time){
    clearInterval(interval);
    interval = setInterval(func, time);
}

time = 1000;
interval = setInterval(checkLogs, time);


const changeInterval = (checkLogs, time)