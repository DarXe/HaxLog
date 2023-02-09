# HaxLog PL || ANG
HaxBall Logus - program do powiadomień dźwiękowych z czatu gry HaxBall.com

# JAK ZAINSTALOWAĆ?
1. Klikamy prawym przyciskiem myszki na okno haxballa, wybieramy "Zbadaj", "zbadaj element", bądź "Wykonaj inspekcję"
2. https://github.com/DarXe/HaxLog/blob/v1.02/logs.js kopiujemy kod (ctrl+a, ctrl+c)
3. Wybieramy konsole "Console", wklejamy tam cały kod z pliku logs.js (zaznacz kod ctrl+C i wklej do konsoli ctrl+v)
4. Program uruchomi się automatycznie, w konsoli powinniśmy dostać informację "Pomyślnie zainicjowano HaxLog!"

# DODAWANIE GRACZA DO BAZY
Aby dodać gracza wystarczy wpisać w konsoli (tam gdzie wklejaliśmy kod) komendę **phrases.push('nick')**
W przyszłości czat z HaxBalla będzie połączony z HaxLog, powstaną odpowiednie komendy

# Usuwanie ostatnio dodanej frazy: 
**phrases.pop();**

# Zatrzymanie skryptu: 
**stop();**

# Zmiana odświeżania czatu: 
**changeInterval(czas w ms);**


# #ANG HaxLog
HaxBall Logus - program for sound notifications from HaxBall.com game chat

# HOW TO INSTALL
1. Right-click on the haxball window, select "Inspect", "inspect element", or "Inspect"
2. https://github.com/DarXe/HaxLog/blob/v1.02/logs.js copy the code (ctrl+a, ctrl+c)
3. Select the "Console" console, paste the entire code from the logs.js file there (select the ctrl+C code and paste ctrl+v into the console)
4. The program will start automatically, in the console you should get the message "HaxLog initialized successfully!"

# ADDING A PLAYER TO THE BASE
To add a player, just type in the console (where you pasted the code) the command **phrases.push('nick')**
In the future, chat with HaxBall will be connected to HaxLog, appropriate commands will be created

# Delete last added phrase:
**phrases.pop();**

# Stop the script: 
**stop();**

# Change chat refresh: 
**changeInterval(time in ms);**


## NOTICE! IMPORTANT
PL: Nigdy nie uruchamiaj skryptu 2 razy! Komenda start(); uruchamia, a stop(); zatrzumuje skrypt
ENG: Never run a script twice! start(); starts, and stop(); stops the script
