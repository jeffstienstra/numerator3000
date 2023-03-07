import React from 'react'

function BuildPhaseDropdown({buildPhase, onBuildPhaseSelect}) {
    const biuldPhaseOptions = [
        {value: '1', text: '1'},
        {value: '2', text: '2'},
        {value: '3', text: '3'},
        {value: '4', text: '4'},
        {value: '5', text: '5'},
        {value: '6', text: '6'},
    ]
    return (
        <div className='phase-dropdown'>
            <select
                className='phase-options'
                value={buildPhase}
                onChange={onBuildPhaseSelect} >
                {biuldPhaseOptions.map((option) => {
                    return <option key={option.value} value={option.value}>{option.text}</option>
                })}
            </select>
        </div>
    )
}

export default BuildPhaseDropdown