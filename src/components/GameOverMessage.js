import React from 'react'

function GameOverMessage({guesses, selectVictoryMessage, gameOver, currentGuess, reset}) {
    return (
        <>
            {gameOver && (
                <>
                    <div>
                        <p>{Number(currentGuess).toLocaleString()} is correct!</p>
                    </div>
                    <p>{selectVictoryMessage()}</p>
                </>
            )}
        </>
    )
}

export default GameOverMessage