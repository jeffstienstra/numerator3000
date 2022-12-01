import React from 'react'

function Title({gameOver, guesses}) {
    return (
        <div>
            <h1 className='green'>NUMERATOR | 3
                    <>
                        <span className={((!gameOver && guesses < 1)) || gameOver ? 'green' : 'red'}>◉</span>
                        <span className={((!gameOver && guesses < 2)) || gameOver ? 'green' : 'red'}>◉</span>
                        <span className={((!gameOver && guesses < 3)) || gameOver ? 'green' : 'red'}>◉</span>
                    </>
                {/* {guesses > 3 && (
                    [...Array(guesses - 3)].map((span, i) => <span className={!gameOver ? 'red' : 'green'} key={i}>◉</span>)
                )} */}
            </h1>
        </div>
    )
}

export default Title