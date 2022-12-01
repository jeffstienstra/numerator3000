import React from 'react'

function TargetGuesses({gameOver, guesses, targetGuesses, difficulty}) {
    return (
        <>
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
        </>
    )
}

export default TargetGuesses