// React
import React from 'react'
import { Spinner } from 'reactstrap'

class Loading extends React.Component {
    render() {
        return (
            <div className='vh-100 vw-100 d-flex align-items-center justify-content-center'>
                <Spinner style={{ width: '15rem', height: '15rem' }} type='grow' color='warning' />
            </div>
        )
    }
}

export default Loading