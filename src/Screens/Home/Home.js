import React, { Component } from 'react'
import * as firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import CustomLoader from '../../Components/CustomLoader/CustomLoader';

export default class Home extends Component {
    constructor() {
        super();

        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            let isLogged = false;

            if (user) isLogged = true;

            this.setState({ isLoading: false, isLogged })
        })
    }

    render() {
        const { isLoading, isLogged } = this.state

        return (
            isLoading ? <CustomLoader /> :
                isLogged ?
                    <div>

                    </div>
                    :
                    <Redirect
                        to={{ pathname: '/login' }}
                    />
        )
    }
}
