import React from 'react'

function InputField({gameOver, difficulty, hint, currentGuess, handleKeyPress, footer, guesses, selectVictoryMessage}) {
    return (
        <div className='input-field'>
            {!gameOver && difficulty && (
                <>
                    <p>{hint}</p>
                    <input
                        autoFocus
                        className='number-input'
                        name='number-input'
                        type='text'
                        placeholder='?'
                        value={currentGuess}
                        onChange={(event) => handleKeyPress(event)}
                        />
                    <p className='error'>{footer}</p>
                </>
            )}
        </div>
    )
}

export default InputField