// React
import React from 'react'
import {
    Card,
    Form,
    Label,
    Input,
    Button,
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Row,
    Col,
    Modal,
    Alert
} from 'reactstrap'

// Firebase
import {
    withFirebaseAuth,
    providers,
    firebaseAppAuth,
    db
} from '../Firebase/Firebase'
import {
    getUserName,
    getProfilePicUrl,
    getUserId,
    createProfile
} from '../Firebase/functions'


class Dashboard extends React.Component {
    constructor(props) {
        super(props)

        // Initializing first and last names
        const fullName = getUserName().split(' ')
        let newFirstName = ''
        let newLastName = ''
        if (fullName.length === 1) {
            newFirstName = fullName[0]
        } else {
            newFirstName = fullName[0]
            newLastName = fullName[fullName.length-1]
        }

        this.state = {
            userInput: {
                firstName: newFirstName,
                lastName: newLastName,
                birthMonth: '',
                birthDay: '',
                birthYear: '',
                gender: ''
            },
            followers: [],
            following: [],
            followingPosts: [],
            followingPostsIDs: [],
            posts: [],
            unit: 'mi',
            isAllPosts: true,
            isLoading: true,
            isOpen: false,
            alert: ''
        }
        
        this.onChange = this.onChange.bind(this)
        this.toggle = this.toggle.bind(this)
        this.onSortMouseLeave = this.onSortMouseLeave.bind(this)
        this.toggleAllPosts = this.toggleAllPosts.bind(this)
        this.cycleUnits = this.cycleUnits.bind(this)
    }

    // added listener for live updates from db
    componentDidMount() {
        const userQuery = db.collection('users').doc(getUserId())
        const activitiesQuery = db.collection('activities')
        userQuery.get().then(outerSnapshot => {
            if (!outerSnapshot.exists) {
                return this.setState({ isLoading: false, isOpen: true })
            }
            this.removeListenerFollowing = userQuery.collection('following')
                .onSnapshot(snapshot => {
                    let following = []
                    snapshot.forEach(doc => {
                        following.push(doc.id)

                        activitiesQuery.where('uid', '==', doc.id)
                            .onSnapshot(innerSnapshot => {
                                let followingPosts = this.state.followingPosts
                                let followingPostsIDs = this.state.followingPostsIDs
                                innerSnapshot.forEach(innerDoc => {
                                    if (followingPostsIDs.includes(innerDoc.id)) {
                                        const temp = followingPosts
                                        followingPosts = []
                                        temp.map(t => {
                                            followingPostsIDs.includes(t[0]) && followingPosts.push(t)
                                        })
                                        followingPosts.push([innerDoc.id, innerDoc.data()])
                                    } else {
                                        followingPosts.push([innerDoc.id, innerDoc.data()])
                                        followingPostsIDs.push(innerDoc.id)
                                    }
                                })
                                this.setState({ followingPosts, followingPostsIDs })
                            }, e => console.log('Error', e)
                        )
                    })
                    this.setState({ following })
                }, e => console.log('Error', e)
            )

            this.removeListenerFollowers = userQuery.collection('followers')
                .onSnapshot(snapshot => {
                    let followers = []
                    snapshot.forEach(doc => followers.push([doc.id, doc.data()]))
                    this.setState({ followers })
                }, e => console.log('Error', e)
            )

            this.removeListenerPosts = activitiesQuery.where('uid', '==', getUserId())
                .onSnapshot(snapshot => {
                    let posts = []
                    snapshot.forEach(doc => posts.push([doc.id, doc.data()]))
                    this.setState({ posts })
                }, e => console.log('Error', e)
            )

            // this.removeListenerYouLiked = userQuery.collection('youLiked').where('uid', '==', getUserId())
            //     .onSnapshot(snapshot => {
            //         let youLiked = []
            //         snapshot.forEach(doc => youLiked.push(doc.id))
            //         this.setState({ youLiked })
            //     }, e => console.log('Error', e)
            // )
        })
        .finally(() => this.setState({ isLoading: false }))
        .catch(e => console.log('Error', e))
    }

    // Use state as ground truth
    onChange(event) {
        const target = event.target
        this.setState(prevState => ({ userInput: { ...prevState.userInput, [target.name]: target.value }}))
    }

    toggleAllPosts() { this.setState({ isAllPosts: !this.state.isAllPosts }) }
    toggle() { this.setState({ isOpen: !this.state.isOpen }) }
    onSortMouseLeave() { this.setState({ isSortOpen: false }) }
    cycleUnits() {
        const { unit } = this.state
        if (unit === 'mi') {
            this.setState({ unit: 'km' })
        }
        // if (unit === 'km') {
        //     this.setState({ unit: 'm' })
        // }
        // if (unit === 'm') {
        //     this.setState({ unit: 'yd' })
        // }
        // if (unit === 'yd') {
        //     this.setState({ unit: 'mi' })
        // }
        if (unit === 'km') {
            this.setState({ unit: 'mi'})
        }
    }

    render() {
        const {
            userInput: {
                firstName,
                lastName,
                birthMonth,
                birthDay,
                birthYear,
                gender
            },
            followers,
            following,
            followingPosts,
            posts,
            isAllPosts,
            isLoading,
            isOpen,
            unit,
            alert
        } = this.state

        const convertToMi = (distance, unit) => {
            if (unit === 'km') {
                return distance/1.609
            }
            if (unit === 'm') {
                return distance/1609.344
            }
            if (unit === 'yd') {
                return distance/1760
            }
            return distance
        }
        const convertToKm = (distance, unit) => {
            if (unit === 'mi') {
                return distance*1.609
            }
            if (unit === 'm') {
                return distance/1000
            }
            if (unit === 'yd') {
                return distance/1093.613
            }
            return distance
        }
        const convertToM = (distance, unit) => {
            if (unit === 'km') {
                return distance*1000
            }
            if (unit === 'mi') {
                return distance*1609.344
            }
            if (unit === 'yd') {
                return distance/1.094
            }
            return distance
        }
        const convertToYd = (distance, unit) => {
            if (unit === 'km') {
                return distance*1093.613
            }
            if (unit === 'm') {
                return distance*1.094
            }
            if (unit === 'mi') {
                return distance*1760
            }
            return distance
        }

        const convertDistance = (distance, fromUnit, toUnit) => {
            if (toUnit === 'km') {
                return convertToKm(distance, fromUnit)
            }
            if (toUnit === 'm') {
                return convertToM(distance, fromUnit)
            }
            if (toUnit === 'yd') {
                return convertToYd(distance, fromUnit)
            }
            return convertToMi(distance, fromUnit)
        }

        const getAvgPace = (distance, hr, min, s, fromUnit, toUnit) => {
            hr = parseInt(hr)
            min = parseInt(min)
            s = parseInt(s)
            return convertDistance(distance, fromUnit, toUnit)/(hr + min/60 + s/3600)
        }

        const getAvgPaceStr = (avgPace, unit) => {
            let retString = avgPace.toString().split('.')
            if (retString.length > 1) {
                return retString[0] + '.' + retString[1].substr(0,2) + ' ' + unit + '/hr'
            }
            return retString + '.00 ' + unit + '/hr'
        }

        let allPosts = posts.concat(followingPosts)
        
        const sort = (sortThis) => {
            return sortThis.sort(function(a, b) {
                a = a[1].timestamp ? new Date(a[1].timestamp.toDate()) : new Date()
                b = b[1].timestamp ? new Date(b[1].timestamp.toDate()) : new Date()
                // a = new Date(a[1] && a[1].timestamp.toDate())
                // b = new Date(b[1] && b[1].timestamp.toDate())
                return a>b ? -1 : a<b ? 1 : 0
            })
        }
        // if (allPosts.length > 1) {
        //     allPosts = allPosts.sort(function(a, b) {
        //         a = new Date(a[1] && a[1].timestamp.toDate())
        //         b = new Date(b[1] && b[1].timestamp.toDate())
        //         return a>b ? -1 : a<b ? 1 : 0
        //     })
        // }

        let top5 = allPosts.sort(function(a, b) {
            a = getAvgPace(convertToMi(a[1].distanceValue, a[1].distanceUnit), a[1].hours, a[1].minutes, a[1].seconds)
            b = getAvgPace(convertToMi(b[1].distanceValue, b[1].distanceUnit), b[1].hours, b[1].minutes, b[1].seconds)
            return a>b ? -1 : a<b ? 1 : 0
        })

        let temp = []
        let tempUID = []
        top5.map(contender => {
            if (!tempUID.includes(contender[1].uid)) {
                temp.push(contender)
                tempUID.push(contender[1].uid)
            } 
        })

        top5 = temp
        top5 = top5.slice(0, top5.length < 5 ? top5.length : 5)

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const genders = ['Male', 'Female', 'Other']
        const numGenerator = (a,b) => {
            let A = []
            for (let i = a; i < b; i++) {
                A.push(i)
            }
            return A
        }

        const ActivityCard = ({post}) => {
            return (
                <Card body className='border-0 mb-3' style={{boxShadow: '0 0 30px 2px rgb(233,233,233)'}}>
                    <div className='d-flex flex-row'>
                        <div>
                            <img style={{width: '2.1rem', height: '2.1rem', borderRadius: 999}} src={post.profilePicUrl} alt={''} />
                        </div>
                        <div className='ml-3 w-100' style={{marginTop: '-1px'}}>
                            <Row>
                                <Col xs='auto'>
                                    <p className='font-weight-bold m-0' style={{fontSize: '.7rem'}}>{post.name}</p>
                                    <p className='text-secondary m-0' style={{fontSize: '.6rem'}}>
                                        {months[parseInt(post.date_month)] + ' ' + post.date_day + ', ' + post.date_year
                                        + ' at ' + (post.date_hour === 0 ? '12' : (post.date_hour > 12 ? post.date_hour-12 : post.date_hour))
                                        + ':' + post.date_minute.toString().padStart(2,'0') + (post.date_hour >= 12 ? ' PM' : ' AM')}
                                    </p>
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col xs='auto'>
                                    <p className='font-weight-bold' style={{fontSize: '1.1rem'}}>{post.title}</p>
                                </Col>
                            </Row>
                            {post.description && <Row className=''>
                                <Col xs='auto'>
                                    <p style={{fontSize: '.6rem'}} className='mt-n3'>{post.description}</p>
                                </Col>
                            </Row>}
                            <Row className='mt-n3 d-flex align-items-center justify-content-start flex-row flex-wrap'>
                                <Col xs='auto'>
                                    <Label for='distance' className='text-secondary m-0' style={{fontSize: '.65rem'}}>Distance</Label>
                                    <div className='m-0 mt-n1' id='distance'>{post.distanceValue + ' ' + post.distanceUnit}</div>
                                </Col>
                                <div className='d-none d-sm-block' style={{height: '1.3rem', width: '1px', marginTop: '5px', backgroundColor: 'rgb(211,211,211)'}}></div>
                                <Col xs='auto'>
                                    <Label for='time' className='text-secondary m-0' style={{fontSize: '.65rem'}}>Time</Label>
                                    <div className='m-0 mt-n1' id='distance'>{
                                        (parseInt(post.hours) !== 0 ?
                                            parseInt(post.hours) + 'h'
                                                    + (parseInt(post.minutes) !== 0 ?
                                                        ' ' + parseInt(post.minutes) + 'm'
                                                    : '')
                                        : (parseInt(post.minutes) !== 0 ?
                                            parseInt(post.minutes) + 'm'
                                                    + (parseInt(post.seconds) !== 0 ?
                                                        ' ' + parseInt(post.seconds) + 's'
                                                    : '')
                                        : parseInt(post.seconds)+'s'))
                                    }</div>
                                </Col>
                                <div className='d-none d-sm-block' style={{height: '1.3rem', width: '1px', marginTop: '5px', backgroundColor: 'rgb(211,211,211)'}}></div>
                                <Col xs='auto'>
                                    <Label for='speed' className='text-secondary m-0' style={{fontSize: '.65rem'}}>Avg. Velocity</Label>
                                    <div className='m-0 mt-n1' id='speed'>{
                                        (parseFloat(post.distanceValue) / (parseFloat(post.hours) + parseFloat(post.minutes)/60 + parseFloat(post.seconds)/3600)).toString().substr(0,5)
                                        + ' ' + post.distanceUnit + '/hr'
                                    }</div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    {post.image && <div className='w-100 bg-warning rounded my-2' style={{height: '150px', overflow: 'hidden'}}>
                                    {/* TODO: add image */}
                    </div> }
                    {/* {post.image ? <div className='w-100 bg-warning rounded my-2' style={{height: '150px', overflow: 'hidden'}}>
                    </div> : <Row><Col xs='12'><hr /></Col></Row>}
                    <div className='w-100'>
                        <Row>
                            <Col xs='12' className='d-flex justify-content-end'>
                                <Button className='text-secondary border-0' style={{fontSize: '.8rem', backgroundColor: 'rgb(235,235,230)'}}>Like</Button>
                                <Button className='ml-2 text-secondary border-0' style={{fontSize: '.8rem', backgroundColor: 'rgb(235,235,230)'}}>Comment</Button>
                            </Col>
                        </Row>
                    </div> */}
                </Card>
            )
        }

        const UserCard = () => {
            return (
                <Card body className='border-0 mb-3' style={{boxShadow: '0 0 30px 2px rgb(233,233,233)'}}>
                    <div className='d-flex mx-auto' style={{marginTop: '-2.95rem'}}>
                        <img style={{width: '3.4rem', height: '3.4rem', borderRadius: 999, boxShadow: '0 0 30px 2px rgb(233,233,233)'}} src={getProfilePicUrl()} alt={''} />
                    </div>
                    <Row className='mt-2'>
                        <Col xs='12' className='text-center'>
                            <p className='font-weight-bold' style={{fontSize: '1.1rem'}}>{getUserName()}</p>
                        </Col>
                    </Row>
                    <Row className='mt-n3 mb-n2'>
                        <Col xs='12' className='d-flex align-items-center justify-content-around flex-row flex-nowrap'>
                            <div>
                                <Label for='following' className='text-secondary m-0' style={{fontSize: '.65rem'}}>Following</Label>
                                <div className='m-0 mt-n1 text-center' id='following'>{following.length}</div>
                            </div>
                            <div style={{height: '1.3rem', width: '1px', marginTop: '5px', backgroundColor: 'rgb(211,211,211)'}}></div>
                            <div>
                                <Label for='followers' className='text-secondary m-0' style={{fontSize: '.65rem'}}>Followers</Label>
                                <div className='m-0 mt-n1 text-center' id='followers'>{followers.length}</div>
                            </div>
                            <div style={{height: '1.3rem', width: '1px', marginTop: '5px', backgroundColor: 'rgb(211,211,211)'}}></div>
                            <div>
                                <Label for='activities' className='text-secondary m-0' style={{fontSize: '.65rem'}}>Activities</Label>
                                <div className='m-0 mt-n1 text-center' id='activities'>{posts.length}</div>
                            </div>
                        </Col>
                    </Row>
                    <div style={{width: '100%'}}><hr /></div>
                    {posts.length !== 0 && <Row className='mt-n3'>
                        <Col xs='12'>
                            <Label for='latestActivity' className='m-0' style={{fontSize: '.65rem'}}>Latest Activity</Label>
                            <div className='m-0 mt-n1' style={{fontSize: '.65rem'}} id='latestActivity'><span className='font-weight-bold'>{posts[0][1].title + ' '}</span>
                            &bull;{' ' + months[parseInt(posts[0][1].date_month)] + ' ' + posts[0][1].date_day + ', ' + posts[0][1].date_year}
                            </div>
                        </Col>
                    </Row>}
                </Card>
            )
        }

        const InfoCard = ({header, subheader, body, footer, line=false}) => {
            return (
                // <Card body className='border-0 mb-3' style={{boxShadow: '0 0 30px 2px rgb(233,233,233)'}}>
                // <Card body className='border-0 mb-3' style={{boxShadow: '0 0 30px 2px rgb(0,0,0)'}}>
                <Card body className='rounded-0 mb-0' style={{background: 'transparent', border: 'none', borderBottom: (line ? '1px solid rgb(211,211,211)' : 'none')}}>
                    <Row>
                        <Col xs='12'>
                            <p className='font-weight-bold my-0' style={{fontSize: '.9rem'}}>{header}</p>
                            {subheader ? <p className='text-secondary mt-n1 mb-2' style={{fontSize: '.7rem'}}>{subheader}</p> : <div className='my-1'/>}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='12'>
                            <p className='my-0' style={{fontSize: '.65rem'}}>{body}</p>
                        </Col>
                    </Row>
                    {footer && <Row>
                        <Col xs='12'>
                            <p className='mb-0 mt-2' style={{fontSize: '.65rem'}}>{footer}</p>
                        </Col>
                    </Row>}
                </Card>
            )
        }

        const LeaderboardFriends = () => {
            return <Card body className='border-0 mb-3' style={{boxShadow: '0 0 30px 2px rgb(233,233,233)'}}>
                <Row className='d-flex align-items-center'>
                    <Col xs='9'>Top 5 Runners</Col>
                    <Col xs='3' className='d-flex justify-content-end'>
                        <Button onClick={this.cycleUnits} style={{fontSize: '.7rem', backgroundColor: 'transparent', border: 'none', color: 'black'}} className='m-0 p-0'>
                            {unit}<span className='font-weight-bold'>&#8642;</span>
                        </Button>
                    </Col>
                </Row>
                {top5.map((topUser, index) => {
                    return (
                        <div className='m-0 d-flex justify-content-between' style={{fontSize: '.7rem'}} id='latestActivity'>
                            <div className='font-weight-bold d-flex flex-row'>
                                <div className='pr-1'>{index+1}{'.'}</div>{topUser[1].name}
                            </div>
                            <div className='d-none d-md-inline'>
                                {getAvgPaceStr(getAvgPace(topUser[1].distanceValue, topUser[1].hours, topUser[1].minutes, topUser[1].seconds, topUser[1].distanceUnit, unit), unit)}
                            </div>
                        </div>
                    )
                })}
            </Card>
        }

        return (
            <div style={{paddingTop: '3.2rem', marginBottom: '1rem'}}>
                <Modal centered isOpen={isOpen}>
                    <Form className='m-3' onSubmit={e => {
                        e.preventDefault()

                        if (firstName && lastName && birthMonth && birthDay && birthYear && gender) {
                            createProfile(firstName, lastName, birthMonth, birthDay, birthYear, gender)
                            this.toggle()
                        } else {
                            // TODO: check if age is 13 or older
                            this.setState({ alert: 'Please fill out all fields.' })
                            setTimeout(() => this.setState({ alert: '' }), 5000)
                        }
                    }}>
                        <Row>
                            <Col xs='12'>
                                <p className='font-weight-bold' style={{fontSize: '1.1rem'}}>Create your profile</p>
                                <p className='mt-n3' style={{fontSize: '.9rem'}}>This will store your activities and help us personalize your experience.</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs='12' md='6'>
                                <Label for='firstName' style={{fontSize: '.7rem'}}>First Name</Label>
                                <Input
                                    id='firstName'
                                    name='firstName'
                                    value={firstName}
                                    onChange={this.onChange}
                                    style={{border: '1px solid black'}}
                                    required
                                />
                            </Col>
                            <Col xs='12' md='6'>
                            <Label for='firstName' style={{fontSize: '.7rem'}}>Last Name</Label>
                                <Input
                                    id='lastName'
                                    name='lastName'
                                    value={lastName}
                                    onChange={this.onChange}
                                    style={{border: '1px solid black'}}
                                    required
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs='12' md='6'>
                                <Label for='birthday' style={{fontSize: '.7rem'}}>Birthday</Label>
                                <div className='d-flex flex-row flex-nowrap' id='birthday'>
                                    <select required onChange={this.onChange} name='birthMonth' className='custom-select' style={{border: '1px solid black', borderRight: 'none', borderRadius: '4px 0 0 4px', minWidth: '70px'}}>
                                        {!birthMonth && <option selected>MM</option>}
                                        {shortMonths.map((month, index) => {return <option value={index+1}>{month}</option>})}
                                    </select>  
                                    <select required onChange={this.onChange} name='birthDay' className='custom-select rounded-0' style={{border: '1px solid black'}}>
                                        {!birthDay && <option selected>DD</option>}
                                        {numGenerator(1,32).map((day) => {return <option value={day}>{day}</option>})}
                                    </select>  
                                    <select required onChange={this.onChange} name='birthYear' className='custom-select' style={{border: '1px solid black', borderLeft: 'none', borderRadius: '0 4px 4px 0', minWidth: '80px'}}>
                                        {!birthYear && <option selected>YYYY</option>}
                                        {numGenerator(1940, parseInt((new Date()).getFullYear())-12).reverse().map((year) => {return <option value={year}>{year}</option>})}
                                    </select>  
                                </div>
                            </Col>
                            <Col xs='12' md='6'>
                                <Label for='selectGender' style={{fontSize: '.7rem'}}>Gender</Label>
                                <select required onChange={this.onChange} name='gender' className='custom-select' style={{border: '1px solid black'}} id='selectGender'>
                                    {!gender && <option selected></option>}
                                    {genders.map((gen, index) => {return <option value={index}>{gen}</option>})}
                                </select> 
                            </Col>
                        </Row>
                        <Row className='mt-3 d-flex align-items-center'>
                            <Col xs='12' sm='9'>
                                {alert && <Alert style={{fontSize: '.9rem', paddingTop: '5px', paddingBottom: '5px'}} className='m-0' color='warning'>{alert}</Alert>}
                            </Col>
                            <Col xs='12' sm='3' className='d-flex justify-content-center justify-content-sm-end mt-3 mt-sm-0'>
                                <Button className='border-0 font-weight-bold w-100' style={{color: 'white', backgroundColor: 'rgb(225,193,71)', fontSize: '.9rem'}} type='submit'>Continue</Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <Container className='cmw'>
                    <Row>
                        {/* <Col md='4' lg='3' className='d-none d-md-inline position-fixed'> */}
                        <Col  md='4' className='d-none d-md-inline d-lg-none'>
                            <div style={{width: 'calc(33.33% - 2rem)', position: 'fixed'}}>
                                <UserCard />
                                <LeaderboardFriends />
                            </div>
                        </Col>
                        <Col lg='3' className='d-none d-lg-inline d-xl-none'>
                            <div style={{width: 'calc(25% - 2rem)', position: 'fixed'}}>
                                <UserCard />
                                <LeaderboardFriends />
                            </div>
                        </Col>
                        <Col xl='3' className='d-none d-xl-inline'>
                            <div style={{width: 'calc(256.25px - 1.75rem)', position: 'fixed'}}>
                                <UserCard />
                                <LeaderboardFriends />
                            </div>
                        </Col>
                        <Col xs='12' md={{size:'8', offset: '0'}} lg={{size:'6', offset: '0'}}>
                            <Button style={{color: 'black', position: 'absolute', marginTop: '-2.5rem', borderRadius: '4px 4px 0 0', border: 'none', backgroundColor: 'transparent'}} onClick={this.toggleAllPosts}>
                                {isAllPosts ? 'All Posts' : 'Just Me'}<span className='font-weight-bold'>&#8642;</span>
                            </Button>
                            { isAllPosts && !isLoading && allPosts.length !== 0 && sort(allPosts).map(post => {
                                return <ActivityCard post={post[1]} />
                            }) }
                            { !isAllPosts && !isLoading && posts.length !== 0 && sort(posts).map(post => {
                                return <ActivityCard post={post[1]} />
                            }) }
                            { !isLoading && allPosts.length === 0 && <div className='text-center' style={{color: 'rgb(155,155,150)', position: 'relative'}}>:( Make some friends or go for a run!</div> }
                        </Col>
                        <Col lg='3' className='d-none d-lg-inline ml-0'>
                            <InfoCard
                                header='Challenges'
                                subheader='Make it your goal!'
                                body='Join a run Challenge to stay on top of your game, earn new achievements and see how you stack up.'
                                footer='Have fun!'
                                line
                            />
                            <InfoCard
                                header='Friends'
                                body={'To follow your friends just look them up in our search bar. Input your friend\'s first or last name to find them, then go for a run together!'}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default withFirebaseAuth({
    providers,
    firebaseAppAuth
})(Dashboard)