import React from 'react'
import DayPicker from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import Graph from '../workoutCard/Graph'
import WorkoutCard from '../workoutCard/workoutCard'

// Firebase
import {
    withFirebaseAuth,
    providers,
    firebaseAppAuth,
    db
} from '../../../Firebase/Firebase'
import {
    getUserName,
    getProfilePicUrl,
    getUserId,
    createProfile
} from '../../../Firebase/functions'

import { Container, Row, Col } from 'reactstrap'

const workoutStyle =
    `.DayPicker-Day--highlighted {
        background-color: rgb(226, 194, 57);
        color: white;
    }`

const modifiers = {
    highlighted: new Date(2019, 6, 19),
}


export default class Sample extends React.Component {
    constructor(props) {
        super(props)
        this.handleDayClick = this.handleDayClick.bind(this)
        this.state = {
            selectedDay: undefined,
        }
    }

    handleDayClick(day) {
        this.setState({ selectedDay: day })
    }

    render() {
        return (
            <Container className='cmw'>
                <Row>
                  <Col xs='12' className=''>
                    <h1 class='text-dark'>Select a Date to View a Workout</h1>
                  </Col>
                </Row>
                <Row>
                  <Col xs='4'>
                    <style>{workoutStyle}</style>
                    <DayPicker className='white-contianer' onDayClick={this.handleDayClick} modifiers={modifiers} />
                  </Col>
                  <Col xs='2'>
                    <div className='workout-card'><WorkoutCard /></div>
                  </Col>
                  <Col xs='12'>
                      <div className='' style={{maxWidth: '100px'}}><Graph /></div>
                  </Col>
                </Row>
            </Container>
        )
    }
}
