# HaxLog PL || ENG
HaxBall Logus - program do powiadomień dźwiękowych z czatu gry HaxBall.com

# JAK URUCHOMIĆ SKRYPT?
1. Klikamy prawym przyciskiem myszki na okno haxballa, wybieramy "Zbadaj", "Zbadaj element", bądź "Wykonaj inspekcję"
2. https://github.com/DarXe/HaxLog/blob/main/logs.js kopiujemy kod (zaznacz od 1 do ostatniej linii i Ctrl+C)
3. Wybieramy konsole "Console", wklejamy tam cały kod z pliku logs.js (wklej do konsoli Ctrl+V)
4. Program uruchomi się automatycznie, w konsoli powinniśmy dostać informację "Pomyślnie zainicjowano HaxLog!"

# KOMENDY
* ^mute test - wycisza gracza o nazwie test w konsoli czatu
* ^add test - dodaje frazę 'test' do powiadomień dźwiękowych
* ^time - włącza/wyłącza godzinę obok wiadomości
* ^console - włącza/wyłącza logi z czatu w konsoli przeglądarki (wyciszone zawsze się tam pokazują)

# Usuwanie ostatnio dodanej frazy: 
**phrases.pop();**  (konsola)

# #ENG HaxLog
HaxBall Logus - program for sound notifications from HaxBall.com game chat

# HOW TO RUN THE SCRIPT?
1. Right-click on the haxball window, select "Inspect", "Inspect element", or "Inspect"
2. https://github.com/DarXe/HaxLog/blob/main/logs.js copy the code (mark from 1 to the last line and Ctrl+C)
3. Select the "Console" console, paste the entire code from the logs.js file there (paste Ctrl + V into the console)
4. The program will start automatically, in the console you should get the message "HaxLog initialized successfully!"

# COMMANDS (beta)
* ^mute test - mutes the player named test in the chat console
* ^add test - adds the phrase 'test' to sound notifications

# ADDING A PLAYER TO THE BASE
To add a player, just type in the console (where you pasted the code) the command **phrases.push('nick')** (console)
In the future, chat with HaxBall will be connected to HaxLog, appropriate commands will be created

# Deleting the last added phrase:
**phrases.pop();** (console)