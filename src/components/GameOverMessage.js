import React from 'react'

function GameOverMessage({victoryMessage, currentGuess}) {
    return (
        <div>
            <p>{Number(currentGuess).toLocaleString()} is correct!</p>
            <p className='victory-message'>{victoryMessage}</p>
        </div>
    )
}

export default GameOverMessage