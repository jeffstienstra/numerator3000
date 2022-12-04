import React from 'react'

function GameOverMessage({selectVictoryMessage, gameOver, currentGuess}) {
    return (
        <>
            {gameOver && (
                <>
                    <p>{Number(currentGuess).toLocaleString()} is correct!</p>
                    <p>{selectVictoryMessage()}</p>
                </>
            )}
        </>
    )
}

export default GameOverMessage