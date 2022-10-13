import { useEffect, useState, useCallback } from 'react'

function Logic() {

    const [currentGuess, setCurrentGuess] = useState('')
    const [difficulty, setDifficulty] = useState(10)
    const [footer, setFooter] = useState('')
    const [gameOver, setGameOver] = useState(false)
    const [hint, setHint] = useState(`What's my number?`)
    const [highGuesses, setHighGuesses] = useState(['10'])
    const [lowGuesses, setLowGuesses] = useState(['1'])
    const [guesses, setGuesses] = useState(0);
    const [secretNumber, setSecretNumber] = useState(undefined)


    const difficultyOptions = {
        easy: 10,
        average: 100,
        hard: 1000,
        veryHard: 10000,
        crazy: 100000,
        insane: 1000000,
    }

    // Call this function to create a new randomly generated secret number
    const createSecretNumber = (selectedDifficulty) => {
        const digitRange = selectedDifficulty ? selectedDifficulty : difficulty
        const secretNumber = Math.floor(Math.random() * digitRange) + 1
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

            if (isFinite(event.target.value)) { // validate the currently pressed key

                // Number(currentGuess).toLocaleString("en-US")
                setCurrentGuess(event.target.value) // if keypress is a number set its value to currentGuess

            } else {

                setFooter(`numbers only plz FR FR no cap`)
                console.log('currentGuess: ', currentGuess)
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

        // A little hint for testing purposes...
        console.log('secretNumber: ', secretNumber)
        console.log('currentGuess: ', currentGuess)

        // Check if our current guess equals the secret number
        if(currentGuess.toString() === secretNumber.toString()) {
            console.log('YOU WIN!!')
            setGuesses(guesses + 1)
            setGameOver(true)

        } else if (currentGuess < secretNumber) {
            setHint(`${currentGuess} is too low`)
            setGuesses(guesses + 1)
            setLowGuesses([...lowGuesses, currentGuess].sort((a, b) => {return b-a}))
            clearInputField()
            console.log('lowGuesses: ', [...lowGuesses, currentGuess].sort((a, b) => {return b-a}))

        } else if (currentGuess > secretNumber) {
            setHint(`${currentGuess} is too high`)
            setGuesses(guesses + 1)
            setHighGuesses([...highGuesses, currentGuess].sort((a, b) => {return a-b}))
            clearInputField()
            console.log('highGuesses: ', [...highGuesses, currentGuess].sort((a, b) => {return a-b}))

        }

    }

    const initializeHighLowGuesses = (selectedDifficulty) => {
        setLowGuesses([1])
        setHighGuesses(selectedDifficulty ? [selectedDifficulty]: [difficulty])
    }

    const onDifficultySelect = (event) => {
        console.log('difficulty value: ', event.target.value)
const selectedDifficulty = event.target.value
        // Select a new secret number
        createSecretNumber(selectedDifficulty)

        setDifficulty(selectedDifficulty)
        initializeHighLowGuesses(selectedDifficulty)
        setCurrentGuess('')
        setFooter('')
        setGameOver(false)
        setHint(`What's my number?`)
        setGuesses(0)
    }

    // Reset the game to original values
    const reset = () => {
        setCurrentGuess('')
        setFooter('')
        setGameOver(false)
        setHint(`What's my number?`)
        setGuesses(0)
        createSecretNumber();
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
                        <option value={difficultyOptions.easy}>Easy</option>
                        <option value={difficultyOptions.average}>Avg</option>
                        <option value={difficultyOptions.hard}>Hard</option>
                        <option value={difficultyOptions.veryHard}>Harder</option>
                        <option value={difficultyOptions.crazy}>Crazy</option>
                        <option value={difficultyOptions.insane}>Insane</option>
                    </select>
                </div>
            {!gameOver && (
                <div className='input-field'>
                    <p>Range: {lowGuesses[0]} - {highGuesses[0]}</p>
                    <p>{hint}</p>
                    <input
                        className='number-input'
                        name="number-input"
                        type='text'
                        autoFocus
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
                    {guesses === 0 && (
                        <p>You did it in {guesses} try, amazing!</p>
                    )}
                    {guesses > 0 && guesses < 3 &&(
                        <p>You did it in {guesses} tries, nice!</p>
                    )}
                    {guesses >= 3 && guesses < 12 &&(
                        <p>You did it in {guesses} tries, not bad.</p>
                    )}
                    {guesses >= 12 &&(
                        <>
                        <p>{guesses} tries!? That took forever!</p>
                        <p>I wonder if you need a better strategy...</p>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default Logic