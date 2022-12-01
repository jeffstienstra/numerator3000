import React from 'react'

function GameOver({guesses, selectVictoryMessage, gameOver, currentGuess, reset}) {
    return (
        <>
            {guesses > 0 && (
                <p>Guesses: {guesses}</p>
            )}
            {gameOver && (
                <p>{selectVictoryMessage()}</p>
            )}
            {/* {gameOver && (
                <div className='replay-button'>
                    <p>{Number(currentGuess).toLocaleString()} is correct</p>
                    <button
                        onClick={reset}
                    ><div className='replay'>▶</div></button>
                </div>
            )} */}
        </>
    )
}

export default GameOver