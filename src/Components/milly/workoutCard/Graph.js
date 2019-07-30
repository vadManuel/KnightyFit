import React from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Legend
} from 'recharts'

// Firebase
import {
    db
} from '../../../Firebase/Firebase'
import {
    getUserId
} from '../../../Firebase/functions'

class Graph extends React.Component {
    constructor(props) {
        super(props)
        this.state = { posts: [] }
    }

    componentDidMount() {
        db.collection('activities').where('uid', '==', getUserId()).onSnapshot(snapshot => {
            let posts = []
            snapshot.forEach(doc => {
                posts.push(doc.data())
            })
            this.setState({ posts })
        })
    }

    render() {
        const { posts } = this.state

        let lines = []
        posts.map(post => (
            lines.push({ 'distance': post.distanceValue, 'unit': post.distanceValue, 'date': post.date_month + 1 + '/' + post.date_day + '/' + post.date_year })
        ))

        return (
            <LineChart
                width={900}
                height={480}
                data={lines}
                margin={{
                    top: 5, right: 50, left: 50, bottom: 5,
                }}>
                <XAxis dataKey='date' />
                <YAxis />
                <Legend />
                <Line type='monotone' dataKey='distance' stroke='#000000' activeDot={{ r: 8 }} />
                {/* <Line type='monotone' dataKey='' stroke='#ffffff' /> */}
            </LineChart>
        )
    }
}

export default Graph