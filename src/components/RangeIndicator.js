import React from 'react'

function RangeIndicator({gameOver, difficulty, difficultyOptions, lowGuesses, highGuesses}) {
    return (
        <div className='input-field'>
            {!gameOver && difficulty && (
                <div className='range-container'>
                    <p>Range: 1 - {difficultyOptions[difficulty]}</p>
                    <div className='range-indicator-container'>
                        <div className='low-guess'>{lowGuesses[0]}</div>
                        <div className='range-indicator'>
                            <div className='too-low'></div>
                            <div className='green-zone' id='green-zone'></div>
                            <div className='too-high' id='too-high'></div>
                        </div>
                        <div className='high-guess'>{highGuesses[0]}</div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RangeIndicator