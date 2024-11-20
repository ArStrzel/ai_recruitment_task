// index.mjs
// plik główny aplikacji w ramach zadania rekrutacyjnego dla Oxido
// autor: Arkadiusz Strzelczyk

import OpenAI from "openai";
import fetch from "node-fetch";
import { promises as fsPromises } from "fs";
import "dotenv/config";

// korzystam z własnego klucza api, dlatego użyłem dotenv, żeby każdy w prosty sposób mógł załączyć swój własny klucz w pliku `.env` (nie żebym był nieufny ;) )

// na wypadek gdyby ktoś przegapił dołączenie pliku `.env` z własnym kluczem
if (!process.env.OPENAI_API_KEY) {
  console.error(
    "API key is missing. Please set OPENAI_API_KEY in your `.env` file."
  );
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//
async function main() {
  // kilka stałych w jednym miejscu, prompty, adresy
  const systemRole =
    "You are an assistant analysing text for further formatting using html language tags. Do not use css styling or javascript code. Do not add any additional formatting tags or code blocks. Return only the pure HTML code. In your replies, omit any comments on the task at hand.";

  const firstPrompt =
    "Structure the attached content so that it can be nested inside the already existing body tag of the html document. Define paragraphs, title and subheadings. " +
    "Place several img tags where you think the image will fit, a maximum of one image each inside a paragraph. Use the src attribute with the value image_placeholder.jpg. " +
    'Use the alt attribute, the value of which will be used as a prompt to AI-chat in the form of a question asking like "generate image...", to generate a matching image. ' +
    "Using the figcaption html tag, place a matching caption under each image. Each pair: image and caption, must be placed inside the parent figure html block. " +
    'Make every single word "AI" bold using b tag.';

  const secondPrompt =
    "Generate a simple html template leaving body block of the code empty. Template is for the website with content in polish language. " +
    'Give the template the title "Oxido recruitment task". Use the word "AI" as a keyword in the metadata section. Let the template refer to the stylesheet at "style.css"';

  const sourceFileUrl =
    "https://cdn.oxido.pl/hr/Zadanie%20dla%20JJunior%20AI%20Developera%20-%20tresc%20artykulu.txt";
  const resultFilePath = "artykul.html";
  const templateFilePath = "szablon.html";

  try {
    // odczyt pliku z nieformatowanym artykułem
    const sourceFileText = await readArticle(sourceFileUrl);
    if (!sourceFileText) {
      throw new Error("Failed to retrieve source file content.");
    }

    // konwersacja z chatem-gpt
    const [htmlArticle, htmlTemplate] = await Promise.all([
      sendPrompt(
        systemRole,
        firstPrompt + "Content to be structured: " + sourceFileText
      ),
      sendPrompt(systemRole, secondPrompt),
    ]);
    if (!htmlArticle || !htmlTemplate) {
      throw new Error("Unexpected response from api openai.");
    }

    // zapis otrzymanych odpowiedzi w formie plików html
    await Promise.all([
      writeToFile(resultFilePath, htmlArticle),
      writeToFile(templateFilePath, htmlTemplate),
    ]);
  } catch (err) {
    console.error(err);
  }
}

// odczyt pliku spod podanego url
async function readArticle(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch the source file.");
    return response.text();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// komunikacja z gpt
async function sendPrompt(systemRole, userPrompt) {
  try {
    const response = await openai.chat.completions.create({
      // według billing planu najmniej skubią za poniższy model
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemRole,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });
    if (
      !response.choices[0].message ||
      response.choices[0].message.content.length === 0
    ) {
      throw new Error("Unexpected response from OpenAI API");
    }
    return response.choices[0].message.content;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// zapis plików
async function writeToFile(path, result) {
  try {
    await fsPromises.writeFile(path, result, "utf-8");
    console.log("... saving " + path + " file completed successfully");
  } catch (err) {
    console.error(err);
  }
}

// zapiąć pasy, ale jakby coś poszło nie tak to pod tym linkiem jest mapa schronów na terenie Krakowa: https://arcg.is/11rWya0
main();
