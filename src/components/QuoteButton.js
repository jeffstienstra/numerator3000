import React from 'react'
import {useState} from 'react'

function QuoteButton() {
    const [randomQuote, setRandomQuote] = useState(undefined)

    const handleGetRandomQuote = async () => {
        await fetch("https://type.fit/api/quotes")

        .then(function(response) {
            return response.json();
        })

        .then(function(data) {
            const randomNumber = Math.floor(Math.random() * data.length);
            console.log(data[randomNumber])
            setRandomQuote(data[randomNumber]);

            // console.log('data', data)
        });
    }

    return (
        <div>
            <button className='quote-button' onClick={handleGetRandomQuote}>Quote</button>

            {randomQuote && (
                <div className='quote-text-container' >
                    <div className='quote-text'>
                        <p>{randomQuote.text}</p>
                        <p>{randomQuote.author ? `~ ${randomQuote.author}` : '~ author unknown'}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuoteButton

