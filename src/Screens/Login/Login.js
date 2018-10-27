import React, { Component } from 'react'
import { Row, Col, Button } from 'reactstrap';
import * as firebase from 'firebase';
import CustomLoader from '../../Components/CustomLoader/CustomLoader';
import { loginWithFacebook, readUserFirestore } from '../../config/Firebase';

export default class Login extends Component {
    constructor() {
        super();

        this.state = {
            isLoading: true
        }

        this.login = this.login.bind(this);
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            let isLogged = false;

            if (user) {
                isLogged = true;
                this.redirectAfterLogin();
            }
            else{
                this.setState({ isLoading: false, isLogged });
            }
        })
    }

    async login() {
        await loginWithFacebook()
            .catch(err => console.log("err -->", err));

        this.redirectAfterLogin();
    }

    async redirectAfterLogin() {
        let user = await readUserFirestore();
        user = user.data();

        if (user && user.isRegistered) {
            this.props.history.push("/");
        }
        else {
            this.props.history.push("/profilesetup");
        }
    }

    render() {
        const { isLoading } = this.state

        return (
            isLoading ? <CustomLoader /> :
                <div className="login-container">
                    <Row className="no-padding full-width-height">
                        <Col className="no-padding" md={8}>
                            <div className="login-background"></div>
                        </Col>
                        <Col className="no-padding perfectly-centered flex-col theme-light-background" md={4}>
                            <h2 className="my-3 text-center">Meet People nearby</h2>
                            <Button className="fb-btn" onClick={this.login}>Login with facebook</Button>
                        </Col>
                    </Row>
                </div>
        )
    }
}
