// React
import React from 'react'
import {
    Container,
    Row,
    Col,
    Alert,
    Card,
    CardBody,
    CardTitle,
    CardText,
    Form,
    FormGroup,
    Input,
    Button
} from 'reactstrap'

// Firebase
import {
    withFirebaseAuth,
    providers,
    firebaseAppAuth
} from '../Firebase/Firebase'

// Components
import {
    StyledButton,
    googleLogo,
    facebookLogo
} from '../Components/Resources'

class Register extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            userInput: {
                email: '',
                password: ''
            },
            errorMessage: ''
        }

        this.onChange = this.onChange.bind(this)
        // this.register = this.register.bind(this)
    }

    onChange(event) {
        const target = event.target
        this.setState(prevState => ({ userInput: { ...prevState.userInput, [target.name]: target.value }}))
    }

    register() {
        // fetchSignInMethodsForEmail

        const { createUserWithEmailAndPassword } = this.props
        const { email, password } = this.state.userInput
        console.log(email, password)
        createUserWithEmailAndPassword(email, password).then(() => {
            console.log('email sent')
        })
            // .then((user) => {
            //     const thisUser = users.child(user.uid)
            //     const userdetail = thisUser.child('userdetail')
            //     const dataToInsert = { email: user.email, userid: user.uid }
            //     userdetail.set(dataToInsert)
            // })
            .catch(error => this.setState({ errorMessage: error }))
    }

    render() {
        const {
            signInWithGoogle,
            signInWithFacebook
        } = this.props
        const {
            userInput: {
                email,
                password
            },
            errorMessage
        } = this.state

        return (
            <Container className='cmw'>
                <Row className=''>
                    <Col sm='12' md={{size: '6', offset: '0'}} lg={{size: '4', offset: '4'}}>
                        <Card className='px-0-sm px-3-md'>
                            <CardBody className='d-flex flex-column'>
                                <CardTitle tag='h1'>Sign Up</CardTitle>
                                <StyledButton color='light' signIn={signInWithGoogle} logo={googleLogo} text={'Sign up with Google'} />
                                <StyledButton color='primary' signIn={signInWithFacebook} logo={facebookLogo} text={'Sign up with Facebook'} />
                                <CardText className='hr-text m-0 my-2'><span>or</span></CardText>
                                <Form onSubmit={() => this.register()}>
                                    <FormGroup>
                                        <Input
                                            name='email'
                                            type='email'
                                            placeholder='Your email'
                                            value={email}
                                            onChange={this.onChange}
                                            required
                                        />
                                        <Input
                                            name='password'
                                            type='password'
                                            placeholder='Password'
                                            value={password}
                                            onChange={this.onChange}
                                            required
                                            minLength='7'
                                        />
                                        { !!errorMessage ? <Alert color='danger'>{errorMessage}</Alert> : null }
                                    </FormGroup>
                                    <Button className='w-100'>Register</Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            // <Container className='d-flex align-items-center justify-content-center h-100' style={{maxWidth: '400px'}}>
            // <Card color='light' className='px-3'><CardBody>
            //     <CardTitle tag='h1'>Sign Up</CardTitle>
            //     <StyledButton color='light' signIn={signInWithGoogle} logo={googleLogo} text={'Sign up with Google'} />
            //     <StyledButton color='primary' signIn={signInWithFacebook} logo={facebookLogo} text={'Sign up with Facebook'} />
            //     <CardText className='hr-text m-0 my-2'><span>or</span></CardText>
            //     <Form onSubmit={() => this.login()}>
            //         <FormGroup>
            //             <Input
            //                 name='email'
            //                 type='email'
            //                 placeholder='Your Email'
            //                 value={email}
            //                 onChange={this.onChange}
            //                 required
            //             />
            //             <Input
            //                 name='password'
            //                 type='password'
            //                 placeholder='Password'
            //                 value={password}
            //                 onChange={this.onChange}
            //                 required
            //                 minLength='7'
            //             />
            //             { !!errorMessage ? <Alert color='danger'>{errorMessage}</Alert> : null }
            //         </FormGroup>
            //         <Button>Login</Button>
            //     </Form>
            // </CardBody></Card>
            // </Container>
        )
    }
}
        
export default withFirebaseAuth({
    providers,
    firebaseAppAuth
})(Register)