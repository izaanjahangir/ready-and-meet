import React, { Component } from 'react'
import Loader from 'react-loader-spinner';

export default class CustomLoader extends Component {
    render() {
        return (
            <div style={{height: "100vh"}} className="perfectly-centered">
                <Loader
                    type="ThreeDots"
                    color="#27ae60"
                    height="100"
                    width="100"
                />
            </div>
        )
    }
}
