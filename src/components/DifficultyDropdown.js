import React from 'react'

function DifficultyDropdown({difficulty, onDifficultySelect, step}) {
    const difficultyOptions = [
        {value: 'easy', text: 'Easy'},
        {value: 'average', text: 'Average'},
        {value: 'hard', text: 'Hard'},
        {value: 'harder', text: 'Harder'},
        {value: 'crazy', text: 'Crazy'},
        {value: 'insane', text: 'Insane'},
    ]

    if (step > 3) {
        difficultyOptions.push({value: 'custom', text: 'Custom'})
    }
    return (
        <div className='difficulty'>
            <select value={difficulty} onChange={onDifficultySelect} >
                {difficultyOptions.map((option) => {
                    return <option key={option.value} value={option.value}>{option.text}</option>
                })}
            </select>
        </div>
    )
}

export default DifficultyDropdown