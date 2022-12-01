import React from 'react'

function DifficultyDropdown({difficulty, onDifficultySelect}) {
    return (
        <div className='difficulty'>
                <select value={difficulty} onChange={onDifficultySelect} >
                    <option value={'easy'}>Easy</option>
                    <option value={'average'}>Average</option>
                    <option value={'hard'}>Hard</option>
                    <option value={'harder'}>Harder</option>
                    <option value={'crazy'}>Crazy</option>
                    <option value={'insane'}>Insane</option>
                </select>
            </div>
    )
}

export default DifficultyDropdown