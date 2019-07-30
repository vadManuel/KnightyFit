import React, { PureComponent } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Legend
} from 'recharts'

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

import {
  Container,
  Row,
  Col
} from 'reactstrap'


class Graph extends React.Component{
  constructor(props)
  {
    super(props)
    this.state = {posts: []}
  }

  componentDidMount() {
    const query = db.collection('activities').where('uid','==',getUserId()).onSnapshot(snapshot => {
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
      lines.push({'distance': post.distanceValue, 'unit': post.distanceValue, 'date': post.date_month +1+ '/' + post.date_day + '/' + post.date_year})
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
            // <Line type='monotone' dataKey='' stroke='#ffffff' />
        </LineChart>
    )
  }
}

export default Graph



// db.collection('activities').get().then((snapshot) =>{
//   snapshot.docs.forEach(doc => {
//     console.log(doc.data());
//   });
// });
//
//
// const data = [
//     {
//         name: 'Mon', time: 4000, steps: 2400, amt: 2400,
//     },
//     {
//         name: 'Tues', time: 3000, steps: 1398, amt: 2210,
//     },
//     {
//         name: 'Wed', time: 2000, steps: 9800, amt: 2290,
//     },
//     {
//         name: 'Thurs', time: 2780, steps: 3908, amt: 2000,
//     },
//     {
//         name: 'Fri', time: 1890, steps: 4800, amt: 2181,
//     },
//     {
//         name: 'Sat', time: 2390, steps: 3800, amt: 2500,
//     },
//     {
//         name: 'Sun', time: 3490, steps: 4300, amt: 2100,
//     },
// ]
//
// export default class Example extends PureComponent {
//     static jsfiddleUrl = 'https://jsfiddle.net/alidingling/xqjtetw0/'
//
//     render() {
//         return (
//
//         )
//     }
// }
