import { useEffect, useState, useCallback } from 'react'

function Logic() {

const [currentEntry, setCurrentEntry] = useState('')
const [digits, setDigits] = useState(10)
const [footer, setFooter] = useState('')
const [gameOver, setGameOver] = useState(false)
const [hint, setHint] = useState(`What's my number?`)
const [strikes, setStrikes] = useState(0);
const [secretNumber, setSecretNumber] = useState(undefined)


    const createTargetNumber = (maxDigits) => {
        const digitRange = maxDigits ? maxDigits : digits
        const secretNumber = Math.floor(Math.random() * digitRange) + 1
        setSecretNumber(secretNumber);
    }

    const handleKeyPress = useCallback(

        (event) => {

            // What is a web browser 'event' anyway?
            console.log(`this is a browser keyPress event: `, event)

            setFooter(``)

            if (event.key === 'Enter') {

                // Go to the logic that checks if we guess the right number
                onEnter();
            }

            if (isFinite(event.target.value)) {

                // If the key pressed is a number, set its value to our currentEntry variable
                setCurrentEntry(event.target.value)

            } else {

                setFooter(`numbers only plz FR FR no cap`)
                console.log('currentEntry: ', currentEntry)
            }

            // validateCurrentKey(event)

        }, [currentEntry] // eslint-disable-line react-hooks/exhaustive-deps
    )

    const onEnter = () => {

        // A little hint for testing purposes...
        console.log('secretNumber: ', secretNumber)


        // Check if our current guess equals the secret number
        if(currentEntry.toString() === secretNumber.toString()) {
            console.log('YOU WIN!!')
            setGameOver(true)

        } else if (currentEntry < secretNumber) {
            setHint(`${currentEntry} is too low`)
            setStrikes(strikes + 1)

        } else if (currentEntry > secretNumber) {
            setHint(`${currentEntry} is too high`)
            setStrikes(strikes + 1)

        }
    }

    const validateCurrentKey = (event) => {

        // Check if the key pressed is a number
        if (isFinite(event.target.value)) {

            // If the key pressed is a number, set its value to our currentEntry variable
            setCurrentEntry(event.target.value)

        } else {

            setFooter(`numbers only plz FR FR no cap`)
            console.log('currentEntry: ', currentEntry)
        }
    }

    const onDifficultySelect = (event) => {
        console.log('difficulty value: ', event.target.value)
        createTargetNumber(event.target.value)
        // const secretNumber = Math.floor(Math.random() * event.target.value) + 1
        // console.log('secretNumber: ', secretNumber)
        // setSecretNumber(secretNumber);

        setDigits(event.target.value)

        setCurrentEntry('')

        setGameOver(false)
    }

    const reset = () => {
        setCurrentEntry('')
        setDigits(10)
        setFooter('')
        setGameOver(false)
        setHint(`What's my number?`)
        setStrikes(0)
        setSecretNumber(undefined)

        createTargetNumber();
        // window.location.reload(false);
    }

    // Check if the user presses the Space bar and disable it
    useEffect(() => {
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
        createTargetNumber()
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className='logic'>
            <div>
                <h1 className='green'>NUMERATOR | 3
                {strikes <= 3 && (
                    <>
                        <span className={(!gameOver && strikes < 1) ? 'green' : 'red'}>◉</span>
                        <span className={(!gameOver && strikes < 2) ? 'green' : 'red'}>◉</span>
                        <span className={(!gameOver && strikes < 3) ? 'green' : 'red'}>◉</span>
                    </>
                )}
                {strikes > 3 && (
                    [...Array(strikes)].map((span, i) => <span className={!gameOver ? 'red' : 'green'} key={i}>◉</span>)
                )}
                </h1>
            </div>
                <div className='difficulty'>
                    {/* <p className='label'>Range</p> */}
                    <select value={digits} onChange={onDifficultySelect} disabled={gameOver} >
                        <option value='10'>Easy: 1-10</option>
                        <option value='100'>Normal: 1-100</option>
                        <option value='1000'>Hard: 1-1,000</option>
                        <option value='10000'>Silliness: 1-10,000</option>
                    </select>
                </div>
            {!gameOver && (
                <div className='input-field'>
                    <p>{hint}</p>
                    <input
                        className='number-input'
                        name="number-input"
                        type='text'
                        autoFocus
                        placeholder='?'
                        value={currentEntry}
                        onChange={(event) => handleKeyPress(event)}
                        />
                    <p className='error'>{footer}</p>
                    {strikes > 0 && (
                        <p>Attemps: {strikes}</p>
                    )}
                </div>
            )}
            {gameOver && (

                // A container to hold the replay button
                <div className='replay-button'>
                    <p>{currentEntry} is correct</p>
                    <button
                        onClick={reset}
                    ><div className='replay'>▶</div></button>
                    {strikes === 0 && (
                        <p>You did it in {strikes + 1} try, amazing!</p>
                    )}
                    {strikes > 0 && strikes < 3 &&(
                        <p>You did it in {strikes + 1} tries, nice!</p>
                    )}
                    {strikes >= 3 && strikes < 12 &&(
                        <p>You did it in {strikes + 1} tries, not bad.</p>
                    )}
                    {strikes >= 12 &&(
                        <>
                        <p>{strikes + 1} tries!? That took forever!</p>
                        <p>I wonder if you need a better strategy...</p>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default Logic