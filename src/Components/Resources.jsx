// React
import React from 'react'
import {
    Button,
    Input,
    InputGroupText
} from 'reactstrap'
import facebookLogo from '../media/facebookLogo.png'
import knightyFit from '../media/knighty_fit_logo_no_border.png'
import knightyFitBorder from '../media/knighty_fit_logo.png'
import knightro from '../media/knightro.png'
import searchBlack from '../media/search.png'
import fancyBackground from '../media/fancy_bg.jpg'
const googleLogo = 'https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-512.png'

// Media
export {
    googleLogo,
    facebookLogo,
    knightyFit,
    knightyFitBorder,
    knightro,
    searchBlack,
    fancyBackground
}

// Style components
export const StyledButton = ({color='dark', signIn, logo, text}) => {
    return <Button className='d-flex align-items-center'
        color={color} onClick={signIn}>
        <img width='25rem' src={logo} alt='' />
        <span className='w-100'>{text}</span>
    </Button>
}


export class CustomDatePickerButton extends React.Component {
    render() {
        return (
            <Button style={{backgroundColor: 'transparent', paddingTop: '6.5px', paddingBottom: '6px', paddingLeft: '1em', paddingRight: '1rem', color: 'black', border: '1px solid gray', borderRadius: '4px 0 0 4px', borderWidth: '1px 0 1px 1px'}} onClick={(e) => {
                e.preventDefault()
                this.props.onClick()
            }}>
                {this.props.value}
            </Button>
        )
    }
}

export const CustomTag = ({checked, tag, onChange:onChangeTags}) => {
    return (
        <InputGroupText style={{border: (checked ? '1px solid black' : '1px solid gray'), backgroundColor: 'transparent', color: (checked ? 'black' : 'gray')}}>
            <Input addon type='checkbox' checked={checked} name={tag} onChange={onChangeTags} />
            <div className='ml-2'>{tag}</div>
        </InputGroupText>
    )
}