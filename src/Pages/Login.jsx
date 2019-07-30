// React
import React from 'react'
import {
    Container,
    Alert,
    Card,
    CardBody,
    CardTitle,
    CardText,
    Form,
    FormGroup,
    Input,
    Button,
    Row,
    Col
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
        facebookLogo,
} from '../Components/Resources'

class Login extends React.Component {
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
    }

    onChange(event) {
        const target = event.target
        this.setState(prevState => ({
            userInput: { ...prevState, [target.name]: target.value }
        }))
    }

    login() {
        // TODO:    use fetchProvidersForEmail to check for existing provider
        //          attached to email
        const { signInWithEmailAndPassword } = this.props
        const { email, password } = this.state.userInput
        signInWithEmailAndPassword(email, password)
        .catch(error => console.log(error.message))
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
                                <CardTitle tag='h1'>Sign In</CardTitle>
                                <StyledButton color='light' signIn={signInWithGoogle} logo={googleLogo} text={'Sign in with Google'} />
                                <StyledButton color='primary' signIn={signInWithFacebook} logo={facebookLogo} text={'Sign in with Facebook'} />
                                <CardText className='hr-text m-0 my-2'><span>or</span></CardText>
                                <Form onSubmit={() => this.login()}>
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
                                    <Button className='w-100'>Log in</Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default withFirebaseAuth({
    providers,
    firebaseAppAuth
})(Login)