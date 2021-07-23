import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import Carousel from "react-bootstrap/Carousel";

import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

import "../../styles/animations.css";

/**
 * KOMPONENTA HOMEPANEL
 *
 * Renderuje početnu stranu aplikacije, sa login/signup formama.
 * ---------------------------------------------------------------------------------------------------------------------
 * Props:
 *   - view - ko pregleda aplikaciju (guest/user)
 *   - changeOverlordState - funkcija za setovanje stanja Overlord komponente
 */

class HomePanel extends Component {
  constructor(props) {
    super(props);

    let inner;
    if (props.view == "guest") {
      inner = "browse";
    } else {
      inner = "home";
    }

    this.animationlist = [
      "animation-fadeInUp",
      "animation-fadeInLeft",
      "animation-fadeOutLeft",
    ];

    this.state = {
      view: props.view,
      action: inner,
      animationHome: "animation-fadeInUp",
      animationLogin: "",
      animationSignup: "",
    };

    this.changeOverlordState = this.props.changeOverlordState;

    this.loginUser = this.loginUser.bind(this);
    this.signupLinkHandler = this.signupLinkHandler.bind(this);
    this.loginLinkHandler = this.loginLinkHandler.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.view !== this.props.view) {
      let inner;
      if (this.props.view == "guest") {
        inner = "browse";
      } else {
        inner = "home";
      }

      this.setState({
        view: this.props.view,
        action: inner,
      });
    }
  }

  loginUser(user) {
    this.setState({
      view: "user",
      action: "home",
      animationHome: this.animationlist[0],
    });

    this.props.userLogin(user);
    this.changeOverlordState("home", "browse");
  }

  signupLinkHandler() {
    if (this.state.action === "browse") {
      this.setState({
        animationHome: this.animationlist[2],
      });
    } else if (this.state.action === "login") {
      this.setState({
        animationLogin: this.animationlist[2],
      });
    }
    setTimeout(() => {
      this.setState({
        action: "signup",
        animationSignup: this.animationlist[1],
      });
    }, 500);
  }
  loginLinkHandler() {
    if (this.state.action === "browse") {
      this.setState({
        animationHome: this.animationlist[2],
      });
    } else if (this.state.action === "signup") {
      this.setState({
        animationSignup: this.animationlist[2],
      });
    }
    setTimeout(() => {
      this.setState({ action: "login", animationLogin: this.animationlist[1] });
    }, 500);
  }
  homeLinkHandler = () => {
    if (this.state.action === "login") {
      this.setState({
        animationLogin: this.animationlist[2],
      });
    } else if (this.state.action === "signup") {
      this.setState({
        animationSignup: this.animationlist[2],
      });
    }
    setTimeout(() => {
      this.setState({ action: "browse", animationHome: this.animationlist[1] });
    }, 500);
  };

  renderBrowse() {
    let welcome = <h1 className="display-2">Welcome to SLOTH!</h1>;
    return (
      <div className={this.state.animationHome}>
        <Jumbotron>
          <h1>Greetings, visitor!</h1>
          <p>
            Welcome to SLOTH, a helper app dedicated to making studying easier
            for people. Dive into user-made variety of study materials, or log
            in to make your own!
          </p>
          <p>
            <Button variant="primary" onClick={this.loginLinkHandler}>
              Log in
            </Button>
          </p>
          <p>
            Or, if you don't have a profile, but would like to join, sign up now
            by clicking on the button below:
          </p>
          <p>
            <Button variant="link" onClick={this.signupLinkHandler}>
              Sign up
            </Button>
          </p>
        </Jumbotron>
      </div>
    );
  }

  renderSignup() {
    let welcome = <h1 className="display-2">Welcome to SLOTH!</h1>;
    return (
      <div className="img-sloth container-fluid">
        <div className={`container home ${this.state.animationSignup}`}>
          <h1 className="display-2">Sign Up</h1>
          <SignUpForm userLogin={this.loginUser}></SignUpForm>
          <div className="bg-white">
            <h6 className="no-margin">Already have a profile?</h6>
            <Button
              variant="link"
              className="no-margin"
              onClick={() => this.loginLinkHandler()}
            >
              Log In
            </Button>
            <Button variant="link" onClick={this.homeLinkHandler}>
              Back To Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  renderLogin() {
    let welcome = <h1 className="display-2">Welcome to SLOTH!</h1>;
    return (
      <div className="img-sloth">
        <div className={`container home ${this.state.animationLogin}`}>
          {welcome}
          <LoginForm userLogin={this.loginUser}></LoginForm>
          <div className="bg-white">
            <h6 className="no-margin">Don't have a profile? Sign up now:</h6>
            <Button
              variant="link"
              className="no-margin"
              onClick={this.signupLinkHandler}
            >
              Sign Up
            </Button>
            <Button variant="link" onClick={this.homeLinkHandler}>
              Back To Home
            </Button>
          </div>
        </div>
        <div></div>
      </div>
    );
  }

  renderUserHome() {
    let welcome = <h1 className="display-2">Welcome to SLOTH!</h1>;
    return (
      <div className={this.state.animationHome}>
        <Jumbotron>
          <h1>Greetings, fellow student!</h1>
          <h3>How to get started:</h3>
          <p>
            To make your own cardset, click on My Material - Cardsets. For
            notebooks, it's My Material - Notebooks. You can browse all public
            material through Public Material page.
          </p>
          <h4>Or...</h4>
          <p>
            If you need a little help focusing on your studies, try the Studying
            Panel. Go make some cardsets!
          </p>
          <h4>And then...</h4>
          <p>
            If you're feeling bold, test your vast knowledge in the Testing
            panel!
          </p>
          <h5>Happy slothing!</h5>
        </Jumbotron>
      </div>
    );
  }

  render() {
    let element;
    let welcome;
    switch (this.state.view) {
      case "guest":
        // Welcome & Introduction
        
        if (this.state.action === "login") {
          // Login Form
          element = this.renderLogin();
        } else if (this.state.action === "signup") {
          // Sign Up Form
          element = this.renderSignup();
        } else if (this.state.action === "browse") {
          element = this.renderBrowse();
        }
        break;
      case "user":
        element = this.renderUserHome();
        break;
      default:
        element = (
          <div>
            <p className="display-3">This is Home Page. Welcome!</p>
          </div>
        );
    }
    return element;
  }
}

export default HomePanel;
