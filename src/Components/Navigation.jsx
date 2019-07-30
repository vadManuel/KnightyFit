// React
import React from 'react'
import { Link } from 'react-router-dom'
import {
    Collapse,
    Button,
    Navbar,
    NavbarToggler,
    InputGroupAddon,
    InputGroup,
    Modal,
    Row,
    Col,
    Nav,
    NavItem,
    Input,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Container,
    Form
} from 'reactstrap'

// Firebase
import {
    withFirebaseAuth,
    providers,
    firebaseAppAuth,
    db
} from '../Firebase/Firebase'
import {
    getProfilePicUrl,
    getUserName,
    getUserId,
    follow,
    unfollow
} from '../Firebase/functions'

// Media
import {
    knightyFit,
    knightro,
    searchBlack,
    fancyBackground
} from './Resources'

class Navigation extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            userInput : {
                search: ''
            },
            searchResults: [],
            following: [],
            sharedFollowing: [],
            isAuthed: false,
            isNavOpen: false,
            isPicOpen: false,
            isPicHover: false,
            isAddOpen: false,
            isAddHover: false,
            isDashHover: false,
            isDashOpen: false,
            isMobile: false,
            isSearchModalOpen: false
        }

        this.onClick = this.onClick.bind(this)
        this.toggleSearchModal = this.toggleSearchModal.bind(this)
        this.togglePic = this.togglePic.bind(this)
        this.toggleNav = this.toggleNav.bind(this)
        this.onPicMouseLeave = this.onPicMouseLeave.bind(this)
        this.onPicMouseOver = this.onPicMouseOver.bind(this)
        this.toggleAdd = this.toggleAdd.bind(this)
        this.onAddMouseLeave = this.onAddMouseLeave.bind(this)
        this.onAddMouseOver = this.onAddMouseOver.bind(this)
        this.toggleDash = this.toggleDash.bind(this)
        this.onDashMouseLeave = this.onDashMouseLeave.bind(this)
        this.onDashMouseOver = this.onDashMouseOver.bind(this)
        this.updateWindowWidth = this.updateWindowWidth.bind(this)
        this.onChange = this.onChange.bind(this)
        this.processSearch = this.processSearch.bind(this)
    }

    toggleSearchModal() {
        this.setState(prevState => ({
            userInput: {
                ...prevState.userInput,
                search: this.state.isSearchModalOpen ? '' : this.state.userInput.search
            },
            isSearchModalOpen: !this.state.isSearchModalOpen
        }))
    }
    toggleNav() { this.setState({isNavOpen: !this.state.isNavOpen }) }
    togglePic() { this.setState({ isPicOpen: (this.state.isPicHover ? this.state.isPicOpen : !this.state.isPicOpen) }) }
    onPicMouseOver() { this.setState({ isPicHover: true, isPicOpen: true }) }
    onPicMouseLeave() { this.setState({ isPicHover: false, isPicOpen: false }) }
    toggleAdd() { this.setState({ isAddOpen: (this.state.isAddHover ? this.state.isAddOpen : !this.state.isAddOpen) }) }
    onAddMouseOver() { this.setState({ isAddHover: true, isAddOpen: true }) }
    onAddMouseLeave() { this.setState({ isAddHover: false, isAddOpen: false }) }
    toggleDash() {
        this.setState({ isDashOpen: (this.state.isDashHover ? this.state.isDashOpen : !this.state.isDashOpen) })
    }
    onDashMouseOver() { this.setState({ isDashHover: true, isDashOpen: true }) }
    onDashMouseLeave() {
        this.setState({ isDashHover: false, isDashOpen: false })
    }
    onChange(event) {
        const target = event.target
        if (target.name === 'search' && this.state.searchResults[0] === 'no-results') {
            this.setState(prevState => ({ userInput: { ...prevState.userInput, [target.name]: '' }, searchResults: []}))
        } else {
            this.setState(prevState => ({ userInput: { ...prevState.userInput, [target.name]: target.value }}))
        }
    }

    onClick() {
        // dirty work around to trigger re-render
        this.setState({})
    }

    updateWindowWidth() { this.setState({ isMobile: window.innerWidth < 768 }) }
    componentWillMount() { this.updateWindowWidth() }
    componentDidMount() {
        window.addEventListener('resize', this.updateWindowWidth)

        this.removeFirebaseEvent = firebaseAppAuth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ isAuthed: true })
                const query = db.collection('users').doc(getUserId())
                query.collection('following').onSnapshot(snapshot => {
                    let following = []
                    snapshot.forEach(doc => {
                        following.push(doc.id)
                    })
                    this.setState({ following })
                })
            } else {
                this.setState({ isAuthed: false })
            }
        })
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowWidth)
        this.removeFirebaseEvent()
    }

    processSearch(search) {
        const query = db.collection('users')
        query.get().then(snapshot => {
            let searchResults = []
            snapshot.forEach(doc => {
                if (doc.data().firstName && doc.data().lastName) {
                    if (doc.data().firstName.toLowerCase() === search.toLowerCase() || doc.data().lastName.toLowerCase() === search.toLowerCase()) {
                        searchResults.push([doc.id, doc.data()])
                    }
                }
            })
            if (searchResults.length !== 0) {
                this.setState({ searchResults, isSearchModalOpen: true })
            } else {
                this.setState({ searchResults: ['no-results'] })
            }
        }).catch((error) => console.error('Error', error))
    }

    getSharedFollowing(followID) {
        const query = db.collection('users').doc(followID).collection('following').limit(5)
        query.get().then(snapshot => {
            let sharedFollowing = []
            snapshot.forEach(doc => {
                sharedFollowing.push(doc.data())
            })
            this.setState({ sharedFollowing })
        }).catch((error) => console.error('Error', error))
    }

    render() {
        const {
            signOut
        } = this.props
        const {
            userInput: {
                search
            },
            isAuthed,
            following,
            sharedFollowing,
            isSearchModalOpen,
            searchResults,
            isNavOpen,
            isPicOpen,
            isPicHover,
            isAddOpen,
            isAddHover,
            isDashOpen,
            isDashHover,
            isMobile
        } = this.state

        const guest = (
            <Nav className='ml-auto'
                style={{paddingTop: '.375rem', paddingBottom: '.375rem'}}
            >
                { window.location.pathname === '/' ?
                    <Link to='/login'><Button light='true' color='light' onClick={this.onClick}>Sign In</Button></Link>
                    : <Link to='/'><Button light='true' color='light' onClick={this.onClick}>Sign Up</Button></Link>
                }
            </Nav>
        )

        const authed = (
            isAuthed && <Collapse isOpen={isNavOpen} navbar>
                { isMobile ?
                    <Nav navbar>
                        {/* University upgrade button */}
                        <NavItem>
                            <Button light color='light' className='px-4 font-weight-bold' style={{padding: '2px'}}>University</Button>
                        </NavItem>
                        <hr/>
                        <DropdownToggle className='d-flex align-items-center' nav>
                            <img style={{width: '1.9rem', height: '1.9rem', borderRadius: 999}} src={isAuthed ? getProfilePicUrl() : knightro} alt={''} />
                            <div style={{marginLeft: '1rem'}}>{isAuthed && getUserName()}</div>
                        </DropdownToggle>
                        <NavItem className='py-2 hover-mobile-menu-link' style={{paddingLeft: '2.9rem'}}><Link to='/workouts'>My Profile</Link></NavItem>
                        <NavItem className='py-2 hover-mobile-menu-link' style={{paddingLeft: '2.9rem'}}><Link>Settings</Link></NavItem>
                        <NavItem onClick={signOut}>Log out</NavItem>
                        <hr style={{}}/>
                        <NavItem><Link to='/create-activity'>&#10010; Manual Entry</Link></NavItem>
                    </Nav>
                    :
                    <Nav className='ml-auto d-flex align-items-center justify-content-end' style={{padding: '0 0'}} navbar>
                        {/* University upgrade button */}
                        <Dropdown onMouseOver={this.onDashMouseOver} onMouseLeave={this.onDashMouseLeave} isOpen={isDashHover || isDashOpen} toggle={this.toggleDash} nav inNavbar>
                            {isDashOpen ? <DropdownToggle className='bg-white m-0' style={{padding: '12px 1rem', color: 'black', border: 'none', borderBottom: '2px solid white'}} nav>Dashboard</DropdownToggle>
                                : <DropdownToggle className='text-white m-0' style={{padding: '12px 1rem', border: 'none', borderBottom: '2px solid rgb(225,193,71)'}} nav>Dashboard</DropdownToggle>}
                            <DropdownMenu right style={{marginTop: '0', borderRadius: '0 0 4px 4px', border: 'none', boxShadow: '0 5px 10px 0 rgb(233,233,233)'}}>
                                <DropdownItem style={{color: 'black', background: 'white'}}>
                                    <Form onSubmit={(e) => {
                                        e.preventDefault()
                                        this.processSearch(search)
                                    }}>
                                        <Input
                                            name='search'
                                            value={search}
                                            placeholder='Search'
                                            invalid={searchResults[0] === 'no-results' && true}
                                            style={{border: '1px solid rgb(211,211,211)', height: '1.75rem', width: '12rem'}}
                                            onChange={this.onChange}
                                        />
                                    </Form>
                                </DropdownItem>
                                <DropdownItem><Link to='/dashboard' style={{textDecoration: 'none', color: 'black'}}>Activity Feed</Link></DropdownItem>
                                <DropdownItem onClick={this.toggleSearchModal}>Friends</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown onMouseOver={this.onPicMouseOver} onMouseLeave={this.onPicMouseLeave} isOpen={isPicHover || isPicOpen} toggle={this.togglePic} nav inNavbar>
                            { isPicOpen ? 
                                <DropdownToggle className='d-flex justify-content-center align-items-center bg-white border-0' style={{paddingLeft: '1rem', paddingRight: '.75rem'}} nav>
                                    <img style={{width: '1.9rem', height: '1.9rem', borderRadius: 999}} src={isAuthed ? getProfilePicUrl() : knightro} alt={knightro} />
                                    <div style={{fontSize: '1.4rem', color: 'black'}}>&#8638;</div>
                                </DropdownToggle>
                                :
                                <DropdownToggle className='d-flex justify-content-center align-items-center border-0' style={{paddingLeft: '1rem', paddingRight: '.75rem', backgroundColor: 'black'}} nav>
                                    <img style={{width: '1.9rem', height: '1.9rem', borderRadius: 999}} src={isAuthed ? getProfilePicUrl() : knightro} alt={knightro} />
                                    <div className='text-white' style={{fontSize: '1.4rem'}}>&#8642;</div>
                                </DropdownToggle>
                            }
                            <DropdownMenu right style={{marginTop: '0', borderRadius: '0 0 4px 4px', border: 'none', boxShadow: '0 5px 10px 0 rgb(233,233,233)'}}>
                                <DropdownItem style={{color: 'black'}}><Link to='/workouts' style={{textDecoration: 'none', color: 'black'}}>My Profile</Link></DropdownItem>
                                <DropdownItem style={{color: 'black'}}>Settings</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem onClick={signOut} style={{color: 'black'}}>Log Out</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        
                        <Dropdown onMouseOver={this.onAddMouseOver} onMouseLeave={this.onAddMouseLeave} isOpen={isAddHover || isAddOpen} toggle={this.toggleAdd} className='rounded-0 border-0' nav inNavbar>
                            { isAddOpen ? 
                                <DropdownToggle className='bg-white' style={{borderRadius: 0, border: 'none', padding: '12px 1rem 12px 1rem'}}>
                                    <div style={{padding: '0 5px', borderRadius: 999, backgroundColor: 'black', borderColor: 'black'}} className='text-white border'>&#10010;</div>
                                </DropdownToggle>
                                :
                                <DropdownToggle style={{borderRadius: 0, border: 'none', padding: '12px 1rem 12px 1rem', backgroundColor: 'black'}}>
                                    <div style={{padding: '0 5px', borderRadius: 999}} className='text-white border border-light'>&#10010;</div>
                                </DropdownToggle>
                            }
                            <DropdownMenu right style={{marginTop: '0', borderRadius: '0 0 4px 4px', border: 'none', boxShadow: '0 5px 10px 0 rgb(233,233,233)'}}>
                                <DropdownItem><Link to='/create-activity' style={{textDecoration: 'none', color: 'black'}}>&#10010; Manual Entry</Link></DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Nav>
                }
            </Collapse>
        )

        // const graph = () => {
        //     let lines = []
        //         posts.map(post => (
        //         lines.push({'distance': post.distanceValue, 'unit': post.distanceValue, 'date': post.date_month +1+ '/' + post.date_day + '/' + post.date_year})
        //     ))

        //     return <LineChart
        //         width={900}
        //         height={480}
        //         data={lines}
        //         margin={{
        //             top: 5, right: 50, left: 50, bottom: 5,
        //         }}>
        //         <XAxis dataKey='date' />
        //         <YAxis />
        //         <Legend />
        //         <Line type='monotone' dataKey='distance' stroke='#000000' activeDot={{ r: 8 }} />
        //     </LineChart>
        // }

        return (
            <div className='sticky-top'>
                <Navbar className='m-0 p-0 navbar-dark' style={{ backgroundColor: 'black', boxShadow: '0 0 10px 2px rgb(133,133,133)'}} expand='md'>
                    <Container className='d-flex align-items-center justify-content-between w-100 py-2 px-3 px-md-0 py-md-0 cmw'>
                        <Link to='/' className='ml-md-3 d-flex align-items-center text-secondary' style={{textDecoration: 'none'}}>
                            <img style={{width: '7rem'}} src={knightyFit} alt='KnightyFit' />
                            <span style={{fontSize: '1rem', marginLeft: '.2rem'}}>Beta</span>
                        </Link>
                        { isMobile && isAuthed && <NavbarToggler onClick={this.toggleNav} /> }
                        { isAuthed ? authed : guest }
                    </Container>
                </Navbar>
                { isAuthed && <Modal centered isOpen={isSearchModalOpen} toggle={this.toggleSearchModal}>
                    <div className='d-flex flex-row flex-nowrap' style={{minHeight: '200px'}}>
                        <div style={{overflow: 'hidden', width: '16.66666%'}} className='d-none d-md-inline'>
                            <img style={{borderRadius: '4px 0 0 4px', width: '100%', height: '100%'}} src={fancyBackground} alt=''/>
                        </div>
                        <Col className='pt-2 pb-3'>
                            <Row>
                                <Col xs='9'>
                                    <p className='font-weight-bold' style={{fontSize: '1.5rem'}}>Runner Search</p>
                                </Col>
                                <Col xs='3' className='d-flex justify-content-end align-items-start mt-n2'>
                                    <Button style={{color: 'black', border: 'none', backgroundColor: 'transparent'}} className='font-weight-bold align-center mr-n3' onClick={this.toggleSearchModal}>&#10005;</Button>
                                </Col>
                            </Row>
                            <Row className='mt-n2'>
                                <Col xs='12' className='py-2' style={{backgroundColor: 'rgb(235,235,230)'}}>
                                    <Form onSubmit={(e) => {
                                        e.preventDefault()
                                        this.processSearch(search)
                                    }}>
                                        <InputGroup>
                                            <Input
                                                name='search'
                                                value={search}
                                                placeholder='Search'
                                                invalid={searchResults[0] === 'no-results' && true}
                                                style={{border: '1px solid rgb(211,211,211)', height: '1.75rem'}}
                                                onChange={this.onChange}
                                            />
                                            <InputGroupAddon addonType='append'>
                                                <Button type='submit' style={{height: '1.75rem', background: 'white', border: '1px solid rgb(211,211,211)'}} className='d-flex align-items-center px-3'>
                                                    <img className='border-0' style={{color: 'black', height: '1rem'}} src={searchBlack} alt='Search' />
                                                </Button>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Form>
                                </Col>
                            </Row>
                            {(searchResults.length === 0 || searchResults[0] === 'no-results') && 
                            <Row className='mt-2'>
                                <Col xs='12'>
                                    <p className='text-secondary' style={{fontSize: '.9rem'}}>Nothing to see here.</p>
                                </Col>
                            </Row>}
                            {searchResults[0] !== 'no-results' && searchResults.map(result => {
                                if (result[0] !== getUserId()) {
                                    const isFollowed = !!following.includes(result[0])
                                    isFollowed && this.getSharedFollowing(result[0])
                                    return (
                                        <Row style={{ border: '1px solid rgb(211,211,211)', borderWidth: '0 0 1px 0', paddingTop: '.7rem', paddingBottom: '.6rem'}}>
                                            <Col xs='12'>
                                                <div className='d-flex flex-row align-items-center'>
                                                    <div>
                                                        <img style={{width: '2.5rem', height: '2.5rem', borderRadius: 999}} src={result[1].profilePicUrl} alt={''} />
                                                    </div>
                                                    <div className='ml-3 mt-n1 w-100'>
                                                        <Row>
                                                            <Col xs='12' md='7'>
                                                                <Link className='font-weight-bold' style={{textDecoration: 'none', fontSize: '.9rem'}}>{result[1].name}{' '}&#10548;</Link>
                                                                <Button type='submit' style={{border: '1px solid rgb(211,211,211)', backgroundColor: 'transparent', color: 'black', fontSize: '.65rem'}}
                                                                    className='d-flex align-middle px-3 py-1 font-weight-bold'
                                                                    onClick={() => {
                                                                        isFollowed ? unfollow(result[0]) :
                                                                        follow(result[0], result[1].name, result[1].profilePicUrl)
                                                                    }}>
                                                                        { isFollowed ? 'Unfollow' : 'Follow' }
                                                                    </Button>
                                                            </Col>
                                                            <Col md='5' className='d-none d-md-inline pt-1'>{ isFollowed && sharedFollowing.length > 0 && 
                                                                <div>
                                                                    <Row>
                                                                        <p style={{fontSize: '.7rem'}}>Both following</p>
                                                                    </Row>
                                                                    <Row className='mt-n3'>
                                                                        {sharedFollowing.map((shared, index)=> {
                                                                            return (
                                                                                <img style={{width: (index !== 0 ? '1.5rem' : 'calc(1.5rem - 6px)'), height: (index !== 0 ? '1.5rem' : 'calc(1.5rem - 6px)'), borderRadius: 999, border: (index !== 0 ? '3px solid white' : 'none'), marginRight: '-.6rem', marginTop: (index !== 0 ? '0' : '3px')}} src={shared.profilePicUrl} alt='' />
                                                                            )
                                                                        })}
                                                                    </Row>      
                                                                </div>
                                                            }</Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    )
                                } else { return {}}
                            })}
                        </Col>
                    </div>
                </Modal>}
            </div>
        )
    }
}

export default withFirebaseAuth({
    providers,
    firebaseAppAuth
})(Navigation)