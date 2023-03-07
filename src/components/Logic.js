import { useEffect, useState, useCallback } from 'react'
import DifficultyDropdown from './DifficultyDropdown'
import StepDropdown from './StepDropdown'
import GameOverMessage from './GameOverMessage'
import InputField from './InputField'
import RangeIndicator from './RangeIndicator'
import ReplayButton from './ReplayButton'
import QuoteButton from './QuoteButton'
import TargetGuesses from './TargetGuesses'
import Title from './Title'

function Logic() {
    const [currentGuess, setCurrentGuess] = useState('')
    const [difficulty, setDifficulty] = useState('easy')
    const [invalidInputFooter, setInvalidInputFooter] = useState('')
    const [gameOver, setGameOver] = useState(false)
    const [hint, setHint] = useState(`What's my number?`)
    const [highGuesses, setHighGuesses] = useState(['10'])
    const [lowGuesses, setLowGuesses] = useState(['1'])
    const [guesses, setGuesses] = useState(0);
    const [secretNumber, setSecretNumber] = useState(undefined)
    const [victoryMessage, setVictoryMessage] = useState('')
    const [step, setStep] = useState(0);

    /*
     * The step setting in upper left of UI determines what logic is used.
     * This is intended for STEM presentation purposes as we step through the
     * app is 'creation'.
    */

    const customNumber = 562;

    const difficultyOptions = {
        easy: 10, // default
        average: 100,
        hard: 1000,
        harder: 10000,
        crazy: 100000,
        insane: 1000000,
        custom: customNumber,
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
        firstTry: `Amazing! You nailed it in 1 try! The target was ${targetGuesses[difficulty]}.`,
        excellent: `Impressive, you guessed it in only ${guesses} tries! The target was ${targetGuesses[difficulty]}.`,
        good: `${guesses} tries isn't bad. But try to take more risks. The target was ${targetGuesses[difficulty]}.`,
        average: `You got it in ${guesses} tries, just as expected. The target was ${targetGuesses[difficulty]}.`,
        poor: `Well, ${guesses} tries isn't that bad. The target was ${targetGuesses[difficulty]}.`,
        bad: `${guesses} tries...let's step it up a bit. The target was ${targetGuesses[difficulty]}.`,
        terrible: `${guesses} tries?  The target was ${targetGuesses[difficulty]}! Have you no strategy!? Better try again.`,
    }

    // Call this function to create a new randomly generated secret number
    function createSecretNumber(selectedDifficulty) {
        let secretNumber;
        if (step === 1) {
            // set the range based on difficulty selection
            const secretNumberMax = selectedDifficulty ? selectedDifficulty : difficultyOptions.easy || 10
            secretNumber = Math.floor(Math.random() * secretNumberMax) + 1
        } else {
            // hard code the range
            secretNumber = Math.floor(Math.random() * 10)
        }

        // TODO: add a 'custom' field where you can allow the user to enter any number

        console.log(`${Math.floor(Math.random() * 10000)}.${secretNumber}.${Math.floor(Math.random() * 1000)}`)
        setSecretNumber(secretNumber);
    }

    const selectVictoryMessage = () => {
        // Calculate how far above or below the target guesses we were.
        const guessAccuracy = guesses / targetGuesses[difficulty]

        //   If the target is 10 guesses but we solve it in 8 guesses,
        //   our guess accuracy is 20% below the target, so based on the following
        //   if/else statements, which message would we receive?
        if (guesses === 1) {
            return victoryMessages.firstTry
        } else if (guessAccuracy < 0.9) {
            return victoryMessages.excellent
        } else if (guessAccuracy >= 0.9 && guessAccuracy < 1) {
            return victoryMessages.good
        } else if (guessAccuracy === 1) {
            return victoryMessages.average
        } else if (guessAccuracy > 1 && guessAccuracy <= 1.1) {
            return victoryMessages.poor
        } else if (guessAccuracy > 1.1 && guessAccuracy <= 1.4) {
            return victoryMessages.bad
        } else if (guessAccuracy > 1.4) {
            return victoryMessages.terrible
        }
    }

    const handleKeyPress = useCallback(
        (event) => {
            // What is a web browser 'event' anyway?
            // console.log(`this is a browser keyPress event: `, event)

            setCurrentGuess(event.target.value) // if keypress is a number set its value to currentGuess

            setInvalidInputFooter(``) // remove error text after each keypress

            if (event.key === 'Enter') {
                onEnter(event); // run the logic that checks if we guessed the right number
            }

            if (isFinite(event.target.value)) { // verify presed key is a number
                setCurrentGuess(event.target.value) // if keypress is a number set its value to currentGuess
            } else if (!gameOver) {
                setInvalidInputFooter(`* numbers only`)
            }

        }, [currentGuess] // eslint-disable-line react-hooks/exhaustive-deps
    )

    const setRangeStyle = (style, value) => {

        // Guess is highest value in range, so show a little inidicator
        const element = document.documentElement.style;
        if (value === 'MAX') {
            element.setProperty('--too-high-percentage', '2%')
        } else if (value === 'RESET') {
            element.setProperty('--too-low-percentage', '0%')
            element.setProperty('--too-high-percentage', '0%')
        } else {
            element.setProperty(style, (value * difficultyOptions[difficulty]) < secretNumber
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
            document.removeEventListener('keydown', handleKeyPress); // stop listening for keyboard input
            setGuesses(guesses + 1)
            setGameOver(true)
            setVictoryMessage(selectVictoryMessage())

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

    function onStepSelect(event) {
        const selectedStep = event.target.value
        setStep(selectedStep)
        console.log('event.target.value:', event.target.value);

    }

    const onDifficultySelect = (event) => {
        const selectedDifficulty = event.target.value
        setDifficulty(selectedDifficulty)
        console.log('selectedDifficulty:', selectedDifficulty);
        setCurrentGuess('')
        setInvalidInputFooter('')
        setGameOver(false)
        setHint(`What's my number?`)
        setGuesses(0)
        createSecretNumber(difficultyOptions[selectedDifficulty])
        initializeHighLowGuesses(selectedDifficulty)
        setRangeStyle('--too-low-percentage', 'RESET')
        setRangeStyle('--too-high-percentage', 'RESET')
    }

    // Reset the game to default values
    const reset = () => {
        setCurrentGuess('')
        setInvalidInputFooter('')
        setGameOver(false)
        setHint(`What's my number?`)
        setGuesses(0)
        createSecretNumber(difficultyOptions[difficulty]);
        initializeHighLowGuesses(difficulty)
        setRangeStyle('--too-low-percentage', 'RESET')
        setRangeStyle('--too-high-percentage', 'RESET')
    }

    useEffect(() => {
        // Check if the user presses the Space bar during the game and disable it
        document.addEventListener('keydown', handleKeyPress);

        // While game is not over, prevent the space bar's default input
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

            <DifficultyDropdown
                difficulty={difficulty}
                onDifficultySelect={onDifficultySelect}
                step={step}
            />

            {!gameOver && (
                <>
                    <InputField
                        hint={hint}
                        currentGuess={currentGuess}
                        handleKeyPress={handleKeyPress}
                        invalidInputFooter={invalidInputFooter}
                    />

                    <RangeIndicator
                        difficulty={difficultyOptions[difficulty]}
                        lowGuesses={lowGuesses}
                        highGuesses={highGuesses}
                    />

                    <TargetGuesses
                        gameOver={gameOver}
                        guesses={guesses}
                        targetGuesses={targetGuesses}
                        difficulty={difficulty}
                    />
                </>
            )}

            {gameOver && (
                <>
                    <GameOverMessage
                        victoryMessage={victoryMessage}
                        currentGuess={currentGuess}
                    />

                    <ReplayButton
                        reset={reset}
                        step={step}
                    />

                    <QuoteButton/>
                </>
            )}

            <StepDropdown
                step={step}
                onStepSelect={onStepSelect}
            />
        </div>
    )
}

export default Logic