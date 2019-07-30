import React from 'react'
import WorkoutCard from './workoutCard/workoutCard'
import Avatar from 'react-avatar'

const Home = () => {
    const totalDist = 59.2
    const date = 'June 2019'

    return (
        <div className='home-container bg-primary-9'>
            <div className='text-center text-light title'>Welcome Back to Knighty Fit</div>
                <div className='sub-container'>
                <div className='user-container'>
                  <Avatar className='avatar-container' name='Loren Meuller' size='150' color='#e2c239'/>
                  <h1 className='text-center home-text'>Member Since: {date}</h1>
                  <h2 className='text-center home-text'>Total Distance: {totalDist} miles</h2>
                </div>
                <div className='test'><WorkoutCard /></div>
                </div>
        </div>
    )
}

export default Home
