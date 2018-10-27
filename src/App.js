import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from './Components/Header/Header';
import Home from './Screens/Home/Home';
import Login from './Screens/Login/Login';
import ProfileSetup from './Screens/ProfileSetup/ProfileSetup';

class App extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true
    }
  }

  render() {
    return (
        <BrowserRouter>
          <div className="app-container">
            <Header />
            <div className="app">
              <Container className="no-padding" fluid>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/profilesetup" component={ProfileSetup} />
              </Container>
            </div>
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
