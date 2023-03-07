import React from 'react'

function ReplayButton({reset, buildPhase}) {
    return (
        <>
        {(buildPhase > 1) && (
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

