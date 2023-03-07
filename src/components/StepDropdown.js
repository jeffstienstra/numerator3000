import React from 'react'

function StepDropdown({step, onStepSelect}) {
    const stepOptions = [
        {value: '1', text: '1'},
        {value: '2', text: '2'},
        {value: '3', text: '3'},
        {value: '4', text: '4'},
        {value: '5', text: '5'},
        {value: '6', text: '6'},
    ]
    return (
        <div className='step-dropdown'>
            <select
                className='step-options'
                value={step}
                onChange={onStepSelect} >
                {stepOptions.map((option) => {
                    return <option key={option.value} value={option.value}>{option.text}</option>
                })}
            </select>
        </div>
    )
}

export default StepDropdown