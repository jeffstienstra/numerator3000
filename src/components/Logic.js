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
        good: `Good guessing! You got it in ${guesses} tries.`,
        average: `${guesses} tries, not bad! But try to take more risks.`,
        poor: `Yipes, ${guesses} guesses is a bit rough.`,
        terrible: `Have you no strategy!? ${guesses} guesses takes forever!`,
    }

    const selectVictoryMessage = () => {
        if (guesses === targetGuesses) {
            return victoryMessages.average
        } else if (guesses === 1) {
            return victoryMessages.firstTry
        } else if (guesses > 1 && guesses < 3) {
            return victoryMessages.excellent
        } else if (guesses >= 3 && guesses < 5) {
            return victoryMessages.good
        } else if (guesses >= 5 && guesses < 12) {
            return victoryMessages.poor
        } else if (guesses >= 12) {
            return victoryMessages.terrible
        }
    }

    // Call this function to create a new randomly generated secret number
    const createSecretNumber = (selectedDifficulty) => {
        console.log('6. selectedDifficulty', selectedDifficulty)
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

                // Number(currentGuess).toLocaleString("en-US")
                setCurrentGuess(event.target.value) // if keypress is a number set its value to currentGuess
            } else {
                setFooter(`* numbers only`)
                // console.log('currentGuess: ', currentGuess)
            }

        }, [currentGuess] // eslint-disable-line react-hooks/exhaustive-deps
    )


    const onEnter = (event) => {

        if (currentGuess === "") return

        const clearInputField = () => {
            // Clear the input field each time Enter is pressed
            if (event.target.value === currentGuess){
                event.target.value= "";
            }
        }

        // Check if our current guess equals the secret number
        if(currentGuess.toString() === secretNumber.toString()) {
            setGuesses(guesses + 1)
            setGameOver(true)
            // selectVictoryMessage()

        } else if (currentGuess < secretNumber) {
            setHint(`${currentGuess} is too low`)
            setGuesses(guesses + 1)
            setLowGuesses([...lowGuesses, currentGuess].sort((a, b) => {return b-a}))
            clearInputField()
            // console.log('lowGuesses: ', [...lowGuesses, currentGuess].sort((a, b) => {return b-a}))

        } else if (currentGuess > secretNumber) {
            setHint(`${currentGuess} is too high`)
            setGuesses(guesses + 1)
            setHighGuesses([...highGuesses, currentGuess].sort((a, b) => {return a-b}))
            clearInputField()
            // console.log('highGuesses: ', [...highGuesses, currentGuess].sort((a, b) => {return a-b}))

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


    useEffect(() => {
        // Generate initial secret number
        createSecretNumber()
        // console.log('useEffect: difficulty', difficulty)
        // console.log('useEffect: targetGuesses.difficulty', targetGuesses.difficulty)
        // console.log('useEffect: targetGuesses.easy', targetGuesses.easy)

        // console.log('useEffect: difficultyOptions.easy', difficultyOptions.easy)
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
                {guesses > 3 && (
                    [...Array(guesses - 3)].map((span, i) => <span className={!gameOver ? 'red' : 'green'} key={i}>◉</span>)
                )}
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
            {!gameOver && difficulty && (
                <div className='input-field'>
                    <p>Range: {lowGuesses[0]} - {highGuesses[0]}</p>
                    <p>Target: {targetGuesses.easy} Tries</p>
                    <p>{hint}</p>
                    <input
                        autoFocus
                        className='number-input'
                        name="number-input"
                        type='text'
                        placeholder='?'
                        value={currentGuess}
                        onChange={(event) => handleKeyPress(event)}
                        />
                    <p className='error'>{footer}</p>
                    {guesses > 0 && (
                        <p>Attemps: {guesses}</p>
                    )}
                </div>
            )}
            {gameOver && (
                <div className='replay-button'>
                    <p>{Number(currentGuess).toLocaleString()} is correct</p>
                    <button
                        onClick={reset}
                    ><div className='replay'>▶</div></button>
                    <p>{selectVictoryMessage()}</p>
                </div>
            )}
        </div>
    )
}

export default Logic