import React from 'react'

function ReplayButton({gameOver, reset}) {
    return (
        <>
            {gameOver && (
                <div className='replay-button'>
                    <button onClick={reset}>
                        <div className='replay'>▶</div>
                    </button>
                </div>
            )}
        </>
    )
}

export default ReplayButton

