import React from 'react'

function InputField({hint, currentGuess, handleKeyPress, invalidInputFooter}) {
    return (
        <div className='input-field'>
                {/* the 'too high/too low' text above the input box */}
                <p>{hint}</p>

                {/* the input box */}
                <input
                    autoFocus
                    className='number-input'
                    name='number-input'
                    type='text'
                    placeholder='?'
                    value={currentGuess}
                    onChange={(event) => handleKeyPress(event)}
                    />

                {/* the '* numbers only' error text below the input box */}
                <p className='error'>{invalidInputFooter}</p>
        </div>
    )
}

export default InputField