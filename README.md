﻿# Zadanie rekrutacyjne

dla Oxido

treść zadania (https://cdn.oxido.pl/hr/Zadanie%20dla%20JJunior%20AI%20Developera.pdf)

1. Za pomocą terminala w środowisku programistycznym (np VSC) pobieramy projekt komendą **`git clone https://github.com/ArStrzel/ai_recruitment_task.git`**
2. Przechodzimy do głównego katalogu projektu, w tym przypadku **`cd ai_recruitment_task`**
3. Instalujemy potrzebne biblioteki node.js komendą **`npm install`** (oprócz "startowych" npm pobiera dodatkowo openai oraz dotenv)
4. Przed pierwszym uruchomienie aplikacji należy utworzyć plik **`.env`** (np komendą **`echo "" > .env `**) w którym zapisany zostanie klucz API od openai w formie **`OPENAI_API_KEY = sk...`**
5. Uruchamiamy aplikację komendą **`node .`**, która zgodnie z informacją w pliku package.json uruchomi główny plik aplikacji
6. Po uruchomieniu aplikacji generowane są dwa pliki **`artykul.html`** oraz **`szablon.html`** zgodnie z wytycznymi zadania rekrutacyjnego
7. Utworzony szablon odnosi się do przygotowanego arkusza stylów CSS **`style.css`**
8. Plik **`podglad.html`** jest ręcznie sklejonym przykładem efektu końcowego w celach wizualizacji
