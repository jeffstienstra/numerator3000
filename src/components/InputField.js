import React from 'react'

function InputField({hint, currentGuess, handleKeyPress, footer, guesses, selectVictoryMessage}) {
    return (
        <div className='input-field'>
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
        </div>
    )
}

export default InputField