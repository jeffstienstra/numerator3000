import { useEffect, useState, useCallback } from 'react'
import DifficultyDropdown from './DifficultyDropdown'
import GameOver from './GameOver'
import InputField from './InputField'
import RangeIndicator from './RangeIndicator'
import TargetGuesses from './TargetGuesses'
import Title from './Title'

function Logic() {

    const [currentGuess, setCurrentGuess] = useState('')
    const [difficulty, setDifficulty] = useState('easy')
    const [footer, setFooter] = useState('')
    const [gameOver, setGameOver] = useState(false)
    const [hint, setHint] = useState(`What's my number?`)
    const [highGuesses, setHighGuesses] = useState(['10'])
    const [lowGuesses, setLowGuesses] = useState(['1'])
    const [guesses, setGuesses] = useState(0);
    const [secretNumber, setSecretNumber] = useState(undefined)

    const difficultyOptions = {
        easy: 10, // default
        average: 100,
        hard: 1000,
        harder: 10000,
        crazy: 100000,
        insane: 1000000,
    }

    // TODO: calculate victoryMessage based on % away from target guesses on current difficulty
    const targetGuesses = {
        easy: 3, // default
        average: 6,
        hard: 10,
        harder: 12,
        crazy: 15,
        insane: 21,
    }

    const victoryMessages = {
        firstTry: `Amazing! You nailed it in 1 try!`,
        excellent: `Impressive! You guessed it in only ${guesses} tries.`,
        good: `You got it in ${guesses} tries, just as expected`,
        average: `${guesses}'s not bad. But try to take more risks.`,
        poor: `Well, ${guesses} guesses isn't that bad.`,
        bad: `${guesses} guesses...let's step it up a bit.`,
        terrible: `${guesses} guesses? Have you no strategy! Better try again.`,
    }

    const selectVictoryMessage = () => {
        const guessesToTarget = guesses / targetGuesses[difficulty]
        if (guesses === 1) {
            return victoryMessages.firstTry
        } else if (guessesToTarget < 0.9) {
            return victoryMessages.excellent
        } else if (guessesToTarget >= 0.9 && guessesToTarget < 1) {
            return victoryMessages.good
        } else if (guessesToTarget === 1) {
            return victoryMessages.average
        } else if (guessesToTarget > 1 && guessesToTarget <= 1.1) {
            return victoryMessages.poor
        } else if (guessesToTarget > 1.1 && guessesToTarget <= 1.4) {
            return victoryMessages.bad
        } else if (guessesToTarget > 1.4) {
            return victoryMessages.terrible
        } else if (guesses === 1) {
            return victoryMessages.firstTry
        }
    }

    // Call this function to create a new randomly generated secret number
    const createSecretNumber = (selectedDifficulty) => {
        const secretNumberMax = selectedDifficulty ? selectedDifficulty : difficultyOptions.easy
        const secretNumber = Math.floor(Math.random() * secretNumberMax) + 1

        console.log('secretNumber: ', secretNumber)
        setSecretNumber(secretNumber);
    }

    const handleKeyPress = useCallback(
        (event) => {
            // What is a web browser 'event' anyway?
            // console.log(`this is a browser keyPress event: `, event)
            setFooter(``) // remove error text after each keypress

            if (event.key === 'Enter') {
                onEnter(event); // run the logic that checks if we guessed the right number
            }

            if (isFinite(event.target.value)) { // verify presed key is a number

                // Number(currentGuess).toLocaleString('en-US')
                setCurrentGuess(event.target.value) // if keypress is a number set its value to currentGuess
            } else if (!gameOver) {
                setFooter(`* numbers only`)
            }

        }, [currentGuess] // eslint-disable-line react-hooks/exhaustive-deps
    )

    const setRangeStyle = (style, value) => {
        // console.log('setRange value: ', value)

        // Guess is highest value in range, so show a little inidicator
        if (value === 'MAX') {
            // console.log('setRange IF BLOCK: ', value)
            document.documentElement.style.setProperty('--too-high-percentage', '5%')
        } else if (value === 'RESET') {
            // console.log('setRange IF ELSE BLOCK: ', value)
            document.documentElement.style.setProperty('--too-low-percentage', '0%')
            document.documentElement.style.setProperty('--too-high-percentage', '0%')
        } else {
            document.documentElement.style.setProperty(style, (value * difficultyOptions[difficulty]) < secretNumber
                ? `${Math.round(value * 100)}%`
                : `${Math.round(100 - (value * 100))}%`);
        }
    }

    const setLowIndicatorValues = (highestLowGuess) => {
        const tooLowPercent = +highestLowGuess / +difficultyOptions[difficulty];
        setRangeStyle('--too-low-percentage', tooLowPercent)
    }

    const setHighIndicatorValues = (lowestHighGuess) => {
        if (+lowestHighGuess === +difficultyOptions[difficulty]) {
            setRangeStyle('--too-high-percentage', 'MAX')
        } else {
            const tooHighPercent = +lowestHighGuess / +difficultyOptions[difficulty];
            setRangeStyle('--too-high-percentage', tooHighPercent)
        }
    }

    const onEnter = (event) => {

        if (currentGuess === '') return

        const clearInputField = () => {
            // Clear the input field each time Enter is pressed
            if (event.target.value === currentGuess){
                event.target.value= '';
            }
        }

        // Check if our current guess equals the secret number
        if(currentGuess.toString() === secretNumber.toString()) {
            setGuesses(guesses + 1)
            setGameOver(true)
            // selectVictoryMessage()

        } else if (currentGuess < secretNumber) {
            setHint(`${currentGuess} is too low`)
            setLowIndicatorValues(currentGuess)
            setGuesses(guesses + 1)
            const lowGuessesSorted = ([...lowGuesses, currentGuess].sort((a, b) => {return b-a}))
            setLowGuesses(lowGuessesSorted)
            setLowIndicatorValues(lowGuessesSorted[0])
            clearInputField()

        } else if (currentGuess > secretNumber) {
            setHint(`${currentGuess} is too high`)
            setGuesses(guesses + 1)
            const highGuessesSorted = [...highGuesses, currentGuess].sort((a, b) => {return a-b})
            setHighGuesses(highGuessesSorted)
            setHighIndicatorValues(highGuessesSorted[0])
            clearInputField()
        }
    }

    const initializeHighLowGuesses = (selectedDifficulty) => {
        setLowGuesses([1])
        setHighGuesses(selectedDifficulty ? [difficultyOptions[selectedDifficulty]] : [difficultyOptions.easy])
    }

    const onDifficultySelect = (event) => {
        const selectedDifficulty = event.target.value
        // console.log('1. event.target.value: ', event.target.value)
        // console.log('2. selectedDifficulty: ', selectedDifficulty)
        // console.log('3. difficultyOptions.value: ', difficultyOptions[selectedDifficulty])
        // console.log('4. difficultyOptions.hard: ', difficultyOptions.hard)

        setDifficulty(selectedDifficulty)
        createSecretNumber(difficultyOptions[selectedDifficulty])
        initializeHighLowGuesses(selectedDifficulty)
        setCurrentGuess('')
        setFooter('')
        setGameOver(false)
        setHint(`What's my number?`)
        setGuesses(0)
        setRangeStyle('--too-low-percentage', 'RESET')
        setRangeStyle('--too-high-percentage', 'RESET')
    }

    // Reset the game to default values
    const reset = () => {
        setCurrentGuess('')
        setFooter('')
        setGameOver(false)
        setHint(`What's my number?`)
        setGuesses(0)
        createSecretNumber(difficultyOptions[difficulty]);
        initializeHighLowGuesses()
        setRangeStyle('--too-low-percentage', 'RESET')
        setRangeStyle('--too-high-percentage', 'RESET')
    }

    useEffect(() => {
        // Check if the user presses the Space bar during the game and disable it
        document.addEventListener('keydown', handleKeyPress);

        // While game is not over, don't allow space button to be pressed
        var field = document.querySelector('[name="number-input"]');
        !gameOver && field.addEventListener('keypress', function ( event ) {
            if (event.keyCode === 32) {
            event.preventDefault();
            }
        });

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);  // eslint-disable-line react-hooks/exhaustive-deps


    // Generate initial secret number
    useEffect(() => {
        createSecretNumber()
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className='logic'>

            <Title
                gameOver={gameOver}
                guesses={guesses}
            />
{/*
            <DifficultyDropdown
                difficulty={difficulty}
                onDifficultySelect={onDifficultySelect}
            />

            <TargetGuesses
                gameOver={gameOver}
                guesses={guesses}
                targetGuesses={targetGuesses}
                difficulty={difficulty}
            />

            <RangeIndicator
                gameOver={gameOver}
                difficulty={difficulty}
                difficultyOptions={difficultyOptions}
                lowGuesses={lowGuesses}
                highGuesses={highGuesses}
            /> */}

            <InputField
                gameOver={gameOver}
                difficulty={difficulty}
                hint={hint}
                currentGuess={currentGuess}
                handleKeyPress={handleKeyPress}
                footer={footer}

            />

            <GameOver
                guesses={guesses}
                selectVictoryMessage={selectVictoryMessage}
                gameOver={gameOver}
                currentGuess={currentGuess}
                reset={reset}
            />
        </div>
    )
}

export default Logic