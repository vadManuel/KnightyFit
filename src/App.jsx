// React
import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom';

// Firebase
import 'firebase/auth'
import {
    withFirebaseAuth,
    providers,
    firebaseAppAuth
} from './Firebase/Firebase'

// Components
import Dashboard from './Pages/Dashboard'
import Login from './Pages/Login'
import Register from './Pages/Register'
import AddActivity from './Pages/AddActivity'
import Loading from './Pages/Loading'
import Navigation from './Components/Navigation'
import Footer from './Components/Footer'
import Home from './Components/milly/Home'
import Workouts from './Components/milly/Workouts'

// Style
import './App.css'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            authed: false,
            isLoading: true
        }
    }

    componentDidMount() {
        this.removeFirebaseEvent = firebaseAppAuth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ authed: true })
            } else {
                this.setState({ authed: false })
            }
            this.setState({ isLoading: false })
        })
    }

    componentWillUnmount() {
        this.removeFirebaseEvent()
    }

    render() {
        if (this.state.isLoading) {
            return <Loading />
        }

        const DefaultRoute = () => { return <Redirect to='/' /> }
        const PublicRoute = ({path, component:Component, redirectPath='/dashboard'}) =>
        { return <Route exact path={path} render={() => this.state.authed ? <Redirect to={redirectPath} /> : <Component />} /> }
        const PrivateRoute = ({path, component:Component}) =>
        { return <Route exact path={path} render={() => this.state.authed ? <Component /> : <DefaultRoute />} /> }

        return (
            <div style={{backgroundColor: 'rgb(255,255,252)'}}>
                <Navigation />
                <div style={{margin: '1rem 0'}} />
                <Switch>
                    <PublicRoute exact path='/' component={Register} />
                    <PublicRoute exact path='/login' component={Login} />
                    <PrivateRoute exact path='/dashboard' component={Dashboard} />
                    <PrivateRoute exact path='/create-activity' component={AddActivity} />
                    <PrivateRoute exact path='/home' component={Home} />
                    <PrivateRoute exact path='/workouts' component={Workouts} />
                    <DefaultRoute />
                </Switch>
                <Footer />
            </div>
        )
    }
}

export default withFirebaseAuth({
    providers,
    firebaseAppAuth
})(App)
