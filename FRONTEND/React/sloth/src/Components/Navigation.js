import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import NavDropdown from "react-bootstrap/NavDropdown";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import logo from "../logo.svg";
import "./../styles/global.css";

const Navigation = (props) => {
  /**
   * who: iz props - može biti guest ili user
   * changeOverlordState: iz props - funkcija koja menja stanje Overlord komponente u zavisnosti od kliknutog elementa
   * isAdmin - da li je logovani korisnik admin ili ne
   *
   * GUEST: enabled su HOME, PUBLIC MATERIAL I HELP
   * USER: sve je enabled
   */

  /*
  logoutConfirm = () => {
  confirmAlert({
    title: 'Confirm to log out',
    message: 'You sure you want to log out?',
    buttons: [
      {
        label: 'Yup',
        onClick: () => {
            props.userLogout()
        }
      },
      {
        label: 'Nope'
      }
    ]
  });
}
  */
  let element;

  let admin = null;
  if (props.isAdmin) {
    admin = (
      <Nav.Item>
        <Nav.Link
          eventKey="admin"
          onClick={() => props.changeOverlordState("admin")}
        >
          Admin
        </Nav.Link>
      </Nav.Item>
    );
  }

  if (props.who === "user") {
    element = (
      <Navbar style={{ background: `${props.color}` }} expand="lg">
        {/*<Navbar.Brand onClick={() => props.changeOverlordState("home")}>
          SLOĆ
        </Navbar.Brand>*/}
      <Navbar.Brand>
        <img
          src={logo}
          width="40"
          height="40"
          alt="SLOĆ"
          onClick={() => props.changeOverlordState("home")}
        />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            activeKey={props.view}
            style={{ background: `${props.color}` }}
            variant="tabs"
            defaultActiveKey="home"
            className="mr-auto"
            expand="lg"
          >
            <Nav.Item>
              <Nav.Link
                eventKey="home"
                onClick={() => props.changeOverlordState("home")}
              >
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="profile"
                onClick={() => props.changeOverlordState("profile")}
              >
                Profile
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <NavDropdown title="Public Material" id="basic-nav-dropdown">
                <NavDropdown.Item
                  eventKey="publicmaterial-cardsets"
                  onClick={() =>
                    props.changeOverlordState("publicmaterial-cardsets")
                  }
                >
                  Cardsets
                </NavDropdown.Item>
                <NavDropdown.Item
                  eventKey="publicmaterial-notebooks"
                  onClick={() =>
                    props.changeOverlordState("publicmaterial-notebooks")
                  }
                >
                  Notebooks
                </NavDropdown.Item>
              </NavDropdown>
            </Nav.Item>
            <Nav.Item>
              <NavDropdown title="My Material" id="basic-nav-dropdown">
                <NavDropdown.Item
                  eventKey="mymaterial-cardsets"
                  onClick={() =>
                    props.changeOverlordState("mymaterial-cardsets")
                  }
                >
                  Cardsets
                </NavDropdown.Item>
                <NavDropdown.Item
                  eventKey="mymaterial-notebooks"
                  onClick={() =>
                    props.changeOverlordState("mymaterial-notebooks")
                  }
                >
                  Notebooks
                </NavDropdown.Item>
              </NavDropdown>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="study"
                onClick={() => props.changeOverlordState("study")}
              >
                Study
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="testing"
                onClick={() => props.changeOverlordState("testing")}
              >
                Testing
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="groups"
                onClick={() => props.changeOverlordState("groups")}
              >
                Groups
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="calendar"
                onClick={() => props.changeOverlordState("calendar")}
              >
                Calendar
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="help"
                onClick={() => props.changeOverlordState("help")}
              >
                Help
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>{admin}</Nav.Item>
          </Nav>
          <Button
            className="padding-5"
            variant="dark"
            onClick={() => props.userLogout()}
          >
            Log Out
          </Button>
        </Navbar.Collapse>
      </Navbar>
    );
  } else {
    element = (
      <Navbar style={{ background: `${props.color}` }} expand="lg">
        {/*<Navbar.Brand onClick={() => props.changeOverlordState("home")}>
          SLOĆ
        </Navbar.Brand>*/}
        <Navbar.Brand>
        <img
          src={logo}
          width="40"
          height="40"
          alt="SLOĆ"
          onClick={() => props.changeOverlordState("home")}
        />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav activeKey={props.view} className="mr-auto">
            <Nav.Item>
              <Nav.Link
                eventKey="home"
                onClick={() => props.changeOverlordState("home")}
              >
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <NavDropdown title="Public Material" id="basic-nav-dropdown">
                <NavDropdown.Item
                  eventKey="publicmaterial-cardsets"
                  onClick={() =>
                    props.changeOverlordState("publicmaterial-cardsets")
                  }
                >
                  Cardsets
                </NavDropdown.Item>
                <NavDropdown.Item
                  eventKey="publicmaterial-notebooks"
                  onClick={() =>
                    props.changeOverlordState("publicmaterial-notebooks")
                  }
                >
                  Notebooks
                </NavDropdown.Item>
              </NavDropdown>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => props.changeOverlordState("help")}>
                Help
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }

  return element;
};

export default Navigation;
