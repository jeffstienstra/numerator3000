import { useEffect, useState, useCallback } from 'react'

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
        excellent: `Impressive! You guessed it in ${guesses} tries.`,
        good: `You got it in ${guesses} tries, just as expected`,
        average: `${guesses}'s not bad. But try to take more risks.`,
        poor: `Well, ${guesses} guesses isn't that bad.`,
        bad: `${guesses} guesses...let's step it up a bit.`,
        terrible: `${guesses} guesses? Have you no strategy! Better try again.`,
    }

    const selectVictoryMessage = () => {
        const guessesToTarget = guesses / targetGuesses[difficulty]
        if (guessesToTarget < 0.9) {
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
        console.log('6. selectedDifficulty value', selectedDifficulty)
        console.log('7. difficultyOptions[selectedDifficulty]', difficultyOptions[selectedDifficulty])
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
        console.log('setRange value: ', value)

        // Guess is highest value in range, so show a little inidicator
        if (value === 'MAX') {
            console.log('setRange IF BLOCK: ', value)
            document.documentElement.style.setProperty('--too-high-percentage', '5%')
        } else if (value === 'RESET') {
            console.log('setRange IF ELSE BLOCK: ', value)
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
            setLowIndicatorValues(currentGuess)
            setHint(`${currentGuess} is too low`)
            setGuesses(guesses + 1)
            const lowGuessesSorted = ([...lowGuesses, currentGuess].sort((a, b) => {return b-a}))
            setLowGuesses(lowGuessesSorted)
            setLowIndicatorValues(lowGuessesSorted[0])
            clearInputField()

        } else if (currentGuess > secretNumber) {
            setHint(`${currentGuess} is too high`)
            setGuesses(guesses + 1)
            const highGuessesSorted = [...highGuesses, currentGuess].sort((a, b) => {return a-b})
            console.log('highGuessesSorted: ', highGuessesSorted)
            setHighGuesses(highGuessesSorted)
            setHighIndicatorValues(highGuessesSorted[0])
            clearInputField()
        }
    }

    const initializeHighLowGuesses = (selectedDifficulty) => {
        console.log('5. selectedDifficulty: ', selectedDifficulty)
        setLowGuesses([1])
        setHighGuesses(selectedDifficulty ? [difficultyOptions[selectedDifficulty]] : [difficultyOptions.easy])
    }

    const onDifficultySelect = (event) => {
        const selectedDifficulty = event.target.value
        console.log('1. event.target.value: ', event.target.value)
        console.log('2. selectedDifficulty: ', selectedDifficulty)
        console.log('3. difficultyOptions.value: ', difficultyOptions[selectedDifficulty])
        console.log('4. difficultyOptions.hard: ', difficultyOptions.hard)

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
            <div>
                <h1 className='green'>NUMERATOR | 3
                    <>
                        <span className={((!gameOver && guesses < 1)) || gameOver ? 'green' : 'red'}>◉</span>
                        <span className={((!gameOver && guesses < 2)) || gameOver ? 'green' : 'red'}>◉</span>
                        <span className={((!gameOver && guesses < 3)) || gameOver ? 'green' : 'red'}>◉</span>
                    </>
                {/* {guesses > 3 && (
                    [...Array(guesses - 3)].map((span, i) => <span className={!gameOver ? 'red' : 'green'} key={i}>◉</span>)
                )} */}
                </h1>
            </div>
            <div className='difficulty'>
                <select value={difficulty} onChange={onDifficultySelect} >
                    <option value={'easy'}>Easy</option>
                    <option value={'average'}>Average</option>
                    <option value={'hard'}>Hard</option>
                    <option value={'harder'}>Harder</option>
                    <option value={'crazy'}>Crazy</option>
                    <option value={'insane'}>Insane</option>
                </select>
            </div>
            {!gameOver && (
                <>
                    <p>Target Guesses</p>
                    <div className='target-guesses-container'>
                        <div className='target-guesses'>
                            {guesses > 0 && (
                                [...Array(guesses)].map((span, i) => <span className='red' key={i}>◉</span>)
                            )}
                            {(targetGuesses[difficulty] - guesses > 0) && (
                                [...Array(targetGuesses[difficulty] - guesses)].map((span, i) => <span className='grey' key={i}>◉</span>)
                            )}
                        </div>
                    </div>
                </>
            )}
            <div className='input-field'>
            {!gameOver && difficulty && (
                <div className='range-container'>
                    <p>Range: 1 - {difficultyOptions[difficulty]}</p>
                    <div className='range-indicator-container'>
                        <div className='low-guess'>{lowGuesses[0]} &#60;</div>
                        <div className='range-indicator'>
                            <div className='too-low'></div>
                            <div className='green-zone' id='green-zone'></div>
                            <div className='too-high' id='too-high'></div>
                        </div>
                        <div className='high-guess'>&#60; {highGuesses[0]}</div>
                    </div>
                </div>
            )}
            {!gameOver && difficulty && (
                <>
                    <p>{hint}</p>
                    <input
                        autoFocus
                        className='number-input'
                        name='number-input'
                        type='text'
                        placeholder='?'
                        value={currentGuess}
                        onChange={(event) => handleKeyPress(event)}
                        />
                    <p className='error'>{footer}</p>
                </>
            )}
            {guesses > 0 && (
                <p>Guesses: {guesses}</p>
            )}
            {gameOver && (
                <p>{selectVictoryMessage()}</p>
            )}
            </div>
            {gameOver && (
                <div className='replay-button'>
                    <p>{Number(currentGuess).toLocaleString()} is correct</p>
                    <button
                        onClick={reset}
                    ><div className='replay'>▶</div></button>
                </div>
            )}
        </div>
    )
}

export default Logic