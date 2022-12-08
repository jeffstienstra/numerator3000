import React from 'react'

function Title({gameOver, guesses}) {
    return (
        <div className='title'>
            <h1 className='green'>NUMERATOR | 3
                    <>
                        <span className={((!gameOver && guesses < 1)) || gameOver ? 'green' : 'red'}>◉</span>
                        <span className={((!gameOver && guesses < 2)) || gameOver ? 'green' : 'red'}>◉</span>
                        <span className={((!gameOver && guesses < 3)) || gameOver ? 'green' : 'red'}>◉</span>
                    </>
            </h1>
        </div>
    )
}

export default Title