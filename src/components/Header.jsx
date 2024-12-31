import { useState } from "react";
import { clsx } from "clsx";
import { languages } from "../utils/languages";
import { getFarewellText } from "./utils";
import { words } from "./words";
import ReactConfetti from "react-confetti";

export default function Header() {
  const randWord = words[Math.floor(Math.random() * words.length)];
  // State Values
  const [currentWord, setCurrentWord] = useState(randWord);
  const [guess, setGuess] = useState([]);

  // Derived Values
  const wrongGuessCount = guess.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const isGameWon = currentWord
    .split("")
    .every((letter) => guess.includes(letter));
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;

  const lastGuessLetter = guess[guess.length - 1];
  const isLastGuessIncorrect =
    lastGuessLetter && !currentWord.split("").includes(lastGuessLetter);
  console.log(isLastGuessIncorrect);

  // Static Values
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function handleGuess(letter) {
    setGuess((prevLetters) => {
      return prevLetters.includes(letter)
        ? prevLetters
        : [...prevLetters, letter];
    });
  }

  const keyboardEl = alphabet.split("").map((el, index) => {
    const isGuessed = guess.includes(el);
    const isCorrect = isGuessed && currentWord.includes(el);
    const isWrong = isGuessed && !currentWord.includes(el);
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });
    return (
      <button
        disabled={isGameOver}
        className={className}
        key={index}
        onClick={() => handleGuess(el)}
      >
        {el}
      </button>
    );
  });

  const arrLetters = currentWord.split("");
  const letterEl = arrLetters.map((el, index) => {
    const shouldRevealLetter = isGameLost || guess.includes(el);
    const letterClass = clsx(
      isGameLost && !guess.includes(el) && "missed-letter"
    );
    return (
      // <span key={index}>{guess.includes(el) ? el : " "}</span>
      <span key={index} className={letterClass}>
        {isGameLost ? el : guess.includes(el) ? el : " "}
      </span>
    );
  });
  const lang = languages.map((eachLang, index) => {
    const isLangLost = index < wrongGuessCount;
    const className = clsx("chip", isLangLost && "lost");
    return (
      <span
        key={eachLang.name}
        className={className}
        style={{
          backgroundColor: `${eachLang.backgroundColor}`,
          color: `${eachLang.color}`,
        }}
      >
        {eachLang.name}
      </span>
    );
  });

  const gameStatus = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect,
  });

  function newGame() {
    setCurrentWord(randWord);
    setGuess([]);
  }

  return (
    <>
      {isGameWon && <ReactConfetti />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word in under 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section className={gameStatus}>
        {!isGameOver && isLastGuessIncorrect ? (
          <p>{getFarewellText(lang[wrongGuessCount - 1].key)}</p>
        ) : null}
        {/* {wrongGuessCount > 0
          ? !isGameOver
            ? getFarewellText(lang[wrongGuessCount - 1].key)
            : null
          : null} */}
        {isGameOver ? (
          isGameWon ? (
            <>
              <h2>You Win!</h2>
              <p>Well done</p>
            </>
          ) : (
            <>
              <h2>You Lose!</h2>
              <p>Better Start Learning Assembly</p>
            </>
          )
        ) : null}
      </section>
      <section className="lang-chips">{lang}</section>
      <section className="letter-boxes">{letterEl}</section>
      <section className="keyboard-boxes">{keyboardEl}</section>
      {isGameOver && (
        <button className="new-game" onClick={newGame}>
          New Game
        </button>
      )}
    </>
  );
}
