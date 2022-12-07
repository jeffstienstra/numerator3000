import React from 'react'

function GameOverMessage({selectVictoryMessage, currentGuess}) {
    return (
        <>
            <p>{Number(currentGuess).toLocaleString()} is correct!</p>
            <p className='victory-message'>{selectVictoryMessage()}</p>
        </>
    )
}

export default GameOverMessage