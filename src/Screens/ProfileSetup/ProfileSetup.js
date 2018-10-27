import React, { Component } from 'react'
import { Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import * as firebase from 'firebase';
import Steps from 'rc-steps';
import CustomLoader from '../../Components/CustomLoader/CustomLoader';
import Map from '../../Components/Map/Map';
import { readUserFirestore, writeUserFirestore } from '../../config/Firebase';
import CoffeeIcon from '../../assets/images/coffee.svg';
import JuiceIcon from '../../assets/images/juice.svg';
import CocktailIcon from '../../assets/images/cocktail.svg';

export default class ProfileSetup extends Component {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            currentStep: 3,
            nickname: '',
            phonenumber: '',
            imageIndex: null,
            images: [null, null, null, null],
            beverages: [],
            meetTime: []
        }

        this.nextStep = this.nextStep.bind(this);
        this.prevStep = this.prevStep.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.navigateToDashboard = this.navigateToDashboard.bind(this);
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition((location) => {
            console.log(location)
        });
        firebase.auth().onAuthStateChanged(async user => {
            let isLogged = false;

            if (user) {
                isLogged = true;
                let user = await readUserFirestore();
                if (user.exists) {
                    user = user.data();

                    this.setState({ ...user.data })
                }

            }
            else {
                this.props.history.push('/login');
            }

            this.setState({ isLoading: false, isLogged })
        })
    }

    async updateProfile() {
        const data = { ...this.state };

        delete data.isLoading
        delete data.currentStep;
        delete data.imageIndex;

        await writeUserFirestore(data);

        this.nextStep();
    }

    nextStep() {
        let { currentStep } = this.state;
        if (currentStep < 3) {
            this.setState({ currentStep: ++currentStep });
        }
    }

    prevStep() {
        let { currentStep } = this.state;
        if (currentStep > 0) {
            this.setState({ currentStep: --currentStep });
        }
    }

    onFileClick(imageIndex) {
        this.setState({ imageIndex });
    }

    removeImage(index) {
        const { images } = this.state;
        images.splice(index, 1, null);
        this.setState({ images });
    }

    uploadImage(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        const { images, imageIndex } = this.state;
        
        reader.addEventListener("load", () => {
            images.splice(imageIndex, 1, reader.result);
            this.setState({ images })
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    renderStep0() {
        const { nickname, phonenumber } = this.state
        return (
            <div className="my-2">
                <Row form>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="nickname">Nickname</Label>
                            <Input type="text" name="nickname" id="nickname" value={nickname} placeholder="Enter your nickname..." onChange={(text) => this.setState({ nickname: text.target.value })} />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="phonenumber">Phone number</Label>
                            <Input type="number" name="phonenumber" value={phonenumber} id="phonenumber" placeholder="Enter you phone number..." onChange={(text) => this.setState({ phonenumber: text.target.value })} />
                        </FormGroup>
                    </Col>
                </Row>
            </div>
        )
    }

    renderStep1() {
        const { images } = this.state;

        return (
            <div className="my-2">
                <Row className="justify-content-center">
                    <input type="file" id="file" style={{ display: 'none' }} onChange={this.uploadImage} />
                    <Col xs={5} md={3} className="my-2">
                        <div className="mx-auto image-placeholder" style={{ backgroundImage: `url(${images[0]})` }}>
                            {
                                !images[0] ?
                                    <span className="text-center">
                                        <span className="text-placeholder">Choose image</span>
                                        <label htmlFor="file" onClick={this.onFileClick.bind(this, 0)} className="custom-file-button">+</label>
                                    </span>
                                    :
                                    <label onClick={this.removeImage.bind(this, 0)} className="custom-file-button-cross">x</label>
                            }
                        </div>
                    </Col>
                    <Col xs={5} md={3} className="my-2">
                        <div className="mx-auto image-placeholder" style={{ backgroundImage: `url(${images[1]})` }}>
                            {
                                !images[1] ?
                                    <span className="text-center">
                                        <span className="text-placeholder">Choose image</span>
                                        <label htmlFor="file" onClick={this.onFileClick.bind(this, 1)} className="custom-file-button">+</label>
                                    </span>
                                    :
                                    <label onClick={this.removeImage.bind(this, 1)} className="custom-file-button-cross">x</label>
                            }
                        </div>
                    </Col>

                    <Col xs={5} md={3} className="my-2">
                        <div className="mx-auto image-placeholder" style={{ backgroundImage: `url(${images[2]})` }}>
                            {
                                !images[2] ?
                                    <span className="text-center">
                                        <span className="text-placeholder">Choose image</span>
                                        <label htmlFor="file" onClick={this.onFileClick.bind(this, 2)} className="custom-file-button">+</label>
                                    </span>
                                    :
                                    <label onClick={this.removeImage.bind(this, 2)} className="custom-file-button-cross">x</label>
                            }
                        </div>
                    </Col>

                    <Col xs={5} md={3} className="my-2">
                        <div className="mx-auto image-placeholder" style={{ backgroundImage: `url(${images[3]})` }}>
                            {
                                !images[3] ?
                                    <span className="text-center">
                                        <span className="text-placeholder">Choose image</span>
                                        <label htmlFor="file" onClick={this.onFileClick.bind(this, 3)} className="custom-file-button">+</label>
                                    </span>
                                    :
                                    <label onClick={this.removeImage.bind(this, 3)} className="custom-file-button-cross">x</label>
                            }
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

    selectBeverage(bev) {
        const { beverages } = this.state;
        if (beverages.includes(bev)) {
            beverages.splice(beverages.indexOf(bev), 1)
        }
        else {
            beverages.push(bev);
        }
        this.setState({ beverages });
    }

    selectTime(time) {
        const { meetTime } = this.state;
        if (meetTime.includes(time)) {
            meetTime.splice(meetTime.indexOf(time), 1)
        }
        else {
            meetTime.push(time);
        }
        this.setState({ meetTime });
    }

    renderStep2() {
        const { beverages, meetTime } = this.state;

        return (
            <div className="my-2">
                <h4>Select Beverages</h4>
                <Row className="justify-content-center">
                    <Col sm={4}>
                        <div className="meetup-placeholder mx-auto" style={{ background: beverages.includes("coffee") ? "#2ecc71" : "white" }} onClick={this.selectBeverage.bind(this, "coffee")}>
                            <img src={CoffeeIcon} className="mx-auto" alt="coffee" width="70%" />
                            <span className="bev-span" style={{ color: beverages.includes("coffee") ? "white" : "black" }}>Coffee</span>
                        </div>
                    </Col>
                    <Col sm={4}>
                        <div className="meetup-placeholder mx-auto" style={{ background: beverages.includes("juice") ? "#2ecc71" : "white" }} onClick={this.selectBeverage.bind(this, "juice")}>
                            <img src={JuiceIcon} className="mx-auto" alt="juice" width="70%" />
                            <span className="bev-span" style={{ color: beverages.includes("juice") ? "white" : "black" }}>Juice</span>
                        </div>
                    </Col>

                    <Col sm={4}>
                        <div className="meetup-placeholder mx-auto" style={{ background: beverages.includes("cocktail") ? "#2ecc71" : "white" }} onClick={this.selectBeverage.bind(this, "cocktail")}>
                            <img src={CocktailIcon} className="mx-auto" alt="cocktail" width="70%" />
                            <span className="bev-span" style={{ color: beverages.includes("cocktail") ? "white" : "black" }}>Cocktail</span>
                        </div>
                    </Col>
                </Row>
                <h4>Select Time</h4>
                <Row className="justify-content-center">
                    <Col sm={4}>
                        <div className="meetup-placeholder mx-auto perfectly-centered" style={{ background: meetTime.includes(20) ? "#2ecc71" : "white" }} onClick={this.selectTime.bind(this, 20)}>
                            <span className="time-span" style={{ color: meetTime.includes(20) ? "white" : "#2ecc71" }}>20 Min</span>
                        </div>
                    </Col>
                    <Col sm={4}>
                        <div className="meetup-placeholder mx-auto perfectly-centered" style={{ background: meetTime.includes(40) ? "#2ecc71" : "white" }} onClick={this.selectTime.bind(this, 40)}>
                            <span className="time-span" style={{ color: meetTime.includes(40) ? "white" : "#2ecc71" }}>40 Min</span>
                        </div>
                    </Col>
                    <Col sm={4}>
                        <div className="meetup-placeholder mx-auto perfectly-centered" style={{ background: meetTime.includes(60) ? "#2ecc71" : "white" }} onClick={this.selectTime.bind(this, 60)}>
                            <span className="time-span" style={{ color: meetTime.includes(60) ? "white" : "#2ecc71" }}>60 Min</span>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

    renderStep3() {
        return (
            <div className="my-2">
                <Map
                    isMarkerShown
                    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `400px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                />
            </div>
        )
    }

    navigateToDashboard() { }

    render() {
        const { isLoading, currentStep } = this.state

        return (
            isLoading ? <CustomLoader /> :
                <div className="profle-setup-container custom-container">
                    <h2 className="text-center">Profile Set up</h2>
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <Steps current={currentStep} labelPlacement="vertical">
                                <Steps.Step title="Basic information" />
                                <Steps.Step title="Pictures" />
                                <Steps.Step title="Meetup" />
                                <Steps.Step title="Location" />
                            </Steps>
                        </Col>
                    </Row>
                    {
                        currentStep === 0 &&
                        this.renderStep0()
                    }
                    {
                        currentStep === 1 &&
                        this.renderStep1()
                    }
                    {
                        currentStep === 2 &&
                        this.renderStep2()
                    }
                    {
                        currentStep === 3 &&
                        this.renderStep3()
                    }
                    <Row>
                        <Col sm={4}>
                            <Button onClick={this.prevStep} className="custom-green-btn" disabled={currentStep === 0}>Back</Button>
                        </Col>
                        <Col sm={4}>
                            <Button onClick={this.updateProfile} className="custom-green-btn" block>Save Changes</Button>
                        </Col>
                        {
                            currentStep === 3 ?
                                <Col sm={4} className="text-right">
                                    <Button onClick={this.navigateToDashboard} className="custom-green-btn">Finish</Button>
                                </Col>
                                :
                                <Col sm={4} className="text-right">
                                    <Button onClick={this.nextStep} className="custom-green-btn">Next</Button>
                                </Col>
                        }
                    </Row>
                </div>
        )
    }
}
