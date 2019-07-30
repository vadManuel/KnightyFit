import React from 'react'
import { animateScroll as scroll } from 'react-scroll'

const WorkoutCard = () => {
    const miles = 3.2
    const pace = '8:42.0'
    const duration = '23:46.8'
    const steps = '12,924'

    return (
        <div className='workout-container bg-primary-7'>
            <header class='text-center text-light'>Date:</header>
            <div className='sub-container'>
                <div className='stats-container'>
                    <h1 className='workout-text'>Distance:</h1>
                    <pre>   {miles} miles</pre>
                    <h2 className='workout-text'>Avg Pace:</h2>
                    <pre>   {pace} mile/min</pre>
                    <h3 className='workout-text'>Duration:</h3>
                    <pre>   {duration} min</pre>
                    <h6 className='workout-text'>Steps:</h6>
                    <pre>   {steps}</pre>
                </div>
                <div className='map-container flot-right'>
                </div>
            </div>
            <a class='text-center text-light' onClick={() => scroll.scrollTo(650)}>
                View Workout Statistics >
          </a>
        </div>
    )
}


export default WorkoutCard
