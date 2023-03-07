import React from 'react'

function ReplayButton({reset, step}) {
    return (
        <>
        {(step > 3) && (
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

