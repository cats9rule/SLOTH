import React, { Component } from "react";

import HomePanel from "./Home/HomePanel";
import ProfilePanel from "./Profile/ProfilePanel";
import CardsetPanel from "./Cardset/CardSetPanel";
import NotebookPanel from "./Notebook/NotebookPanel";
import StudyPanel from "./Study/StudyPanel";
import TestPanel from "./ComponentsTests/TestPanel";
import GroupsPanel from "./Groups/GroupsPanel";
import CalendarPanel from "./Calendar/CalendarPanel";
import Navigation from "./Navigation";
import StatusComponent from "./StatusComponent";
import AdminPanel from "./ComponentsAdmin/AdminPanel";
import HelpPanel from "./HelpPanel";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import "./../styles/global.css";

/**TODO: pri kreiranju odgovarajućih panela doraditi funkcije za njihovo otvaranje u smislu
 *       prosleđivanja odgovarajućih props-a.
 */

/** KOMPONENTA SLOTHOVERLORD
 *
 * Komponenta predstavlja osnovu aplikacije. U ovoj komponenti se čuvaju osnovna stanja aplikacije.
 * Stanja aplikacije se menjaju klikom na odgovarajući nav element.
 * ---------------------------------------------------------------------------------------------------------------------
 * STANJA:
 *   - home
 *   - profile
 *   - public material (cardsets + notebooks)
 *   - my material (cardsets + notebooks)
 *   - study
 *   - testing
 *   - calendar
 *   - help
 *
 * Izgled objekta stanja:
 *   { view: stanje,
 *     who: user/guest
 *     inner: stanje unutar komponente koja se renderuje
 *     isStudying: true/false }
 * ---------------------------------------------------------------------------------------------------------------------
 * HOME: Guest može da radi log in, sign up, ili pregled javnih beleški (PUBLIC MATERIAL).
 * User (postaje nakon sign up ili log in) može da pristupa ostalim delovima navbara.
 *
 * PROFILE: user može da menja svoje korisničko ime, password, ime i prezime i avatar.
 *
 * PUBLIC MATERIAL: user/guest mogu da pretražuju javne beleške i kartice.
 *
 * MY MATERIAL: user može da vrši CRUD svog materijala.
 *
 * STUDY: user može da kreira i izvršava study sessions.
 * Treba zabraniti pristup HOME, CALENDAR, i PROFILE panelima.
 *
 * TESTING: user može da radi test ili igra memo game.
 *
 * GROUPS: user može da obavlja akcije vezane za grupe.
 *
 * CALENDAR: user može da CRUD eventove.
 *
 * HELP: opis aplikacije i kako se koristi.
 *
 * ADMIN: administratorske funkcije
 * ---------------------------------------------------------------------------------------------------------------------
 * WHO:
 *   - guest - može da vidi samo Home, Public Material i Help. U Home mu se prikazuju samo Login i Signup.
 *   - user - može da vidi sve
 *   - admin - ima i Admin panel
 * ---------------------------------------------------------------------------------------------------------------------
 */

class SlothOverlord extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: "home",
      who: "guest",
      user: null, 
      isAdmin: false,
      inner: "login",
      isStyding: false,
      dbMMChanged: false // kad se iz admin panela desi izmena u bazi za motivacione poruke,
    // ovaj atribut se setuje na true
    // kad MotivationalMessageController pokupi izmene, setuje se na false
    };

    this.colours = [
      { key: "home", value: "#d9d4d4ff" },
      { key: "profile", value: "#9ee7ffff" },
      { key: "publicmaterial-cardsets", value: "#ffd296ff" },
      { key: "publicmaterial-notebooks", value: "#b5c5ffff" },
      { key: "mymaterial-cardsets", value: "#ffd296ff" },
      { key: "mymaterial-notebooks", value: "#b5c5ffff" },
      { key: "study", value: "#bafff8ff" },
      { key: "testing", value: "#e5c2ffff" },
      { key: "groups", value: "#fffac2ff" },
      { key: "calendar", value: "#c2ffccff" },
      { key: "help", value: "#ffebfbff" },
      { key: "admin", value: "#b2bfd6ff" },
    ];

    this.changeState = this.changeState.bind(this);
    this.userLogin = this.userLogin.bind(this);
    this.userLogout = this.userLogout.bind(this);

    this.setMMChanged = this.setMMChanged.bind(this); // setuje dbMMChanged na true
    this.setMMChanged = this.setMMChanged.bind(this); // resetuje dbMMChanged na false
    this.startStudyPlan = this.startStudyPlan.bind(this);
    this.studySessionEnded = this.studySessionEnded.bind(this);
  }

  //#region Helper Functions
  setMMChanged = () => {
    this.setState({dbMMChanged: true})
  };
  resetMMChanged = () => {
    this.setState({dbMMChanged: false})
  };
  //#endregion

  //#region State Changers
  changeState = (view, inner) => {
    this.setState({
      view: view,
      inner: inner,
    });
  };
  userLogin = (user) => {
    console.log(user);
    this.setState({
      who: "user",
      view: "home",
      user: user,
      isAdmin: user.isAdmin,
    });
  };
  userLogout = () => {
    confirmAlert({
      title: 'Confirm',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          label: 'Yup',
          onClick: () => {this.setState({
            view: "home",
            who: "guest",
            user: null,
            isAdmin: false,
            isStudying: false,
          })}
        },
        {
          label: 'Nope'
        }
      ]
    });
    
  }

  updateUser = (u) => {
    this.setState({
      user: u
    })
  }

  startStudyPlan(workTime, breakTime)
  {
      this.setState({
          isStudying: true,
          workTime: workTime,
          breakTime: breakTime
      });
  }

  studySessionEnded()
  {
    this.setState({
      isStudying: false,
      workTime: null,
      breakTime: null
    })
  }
  //#endregion

  //#region Open Panel
  openHomePanel = () => {
    return (
      <HomePanel
        view={this.state.who}
        inner={this.state.inner}
        changeOverlordState={this.changeState}
        userLogin={this.userLogin}
      ></HomePanel>
    );
  };
  openProfilePanel = () => {
    return (
      <ProfilePanel
        user={this.state.user}
        updateUser={this.updateUser}
      ></ProfilePanel>)
    ;
  };
  openPublicCardsets() {
    return <CardsetPanel whose="public"></CardsetPanel>;

    let cardsets = [];
  }
  openPublicNotebooks = () => {
    return <NotebookPanel whose="public"></NotebookPanel>;
  };
  openMyCardSets = () => {
    return <CardsetPanel whose="user" user={this.state.user}></CardsetPanel>;
  };
  openMyNotebooks = () => {
    return <NotebookPanel whose="user" user={this.state.user}></NotebookPanel>;
  };
  openStudyPanel = () => {
    return <StudyPanel startStudyPlan={this.startStudyPlan} user={this.state.user}></StudyPanel>;
  };
  openTestPanel = () => {
    return <TestPanel user={this.state.user}></TestPanel>;
  };
  openGroupsPanel = () => {
    return <GroupsPanel user={this.state.user}></GroupsPanel>;
  };
  openCalendarPanel = () => {
    return <CalendarPanel user={this.state.user}></CalendarPanel>;
  };
  openHelpPage = () => {
    return <HelpPanel></HelpPanel>
  };
  openAdminPanel = () => {
    return (
      <AdminPanel
        admin={this.state.user}
        setMMChanged={this.setMMChanged}
      ></AdminPanel>
    );
  };
  //#endregion

  render() {
    let element;


    switch (this.state.view) {
      case "home":
        element = this.openHomePanel();
        break;

      case "profile":
        element = this.openProfilePanel();
        break;

      case "publicmaterial-cardsets":
        element = this.openPublicCardsets();
        break;

      case "publicmaterial-notebooks":
        element = this.openPublicNotebooks();
        break;

      case "mymaterial-cardsets":
        element = this.openMyCardSets();
        break;

      case "mymaterial-notebooks":
        element = this.openMyNotebooks();
        break;

      case "study":
        element = this.openStudyPanel();
        break;

      case "testing":
        element = this.openTestPanel();
        break;

      case "groups":
        element = this.openGroupsPanel();
        break;

      case "calendar":
        element = this.openCalendarPanel();
        break;

      case "help":
        element = this.openHelpPage();
        break;

      case "admin":
        element = this.openAdminPanel();
        break;

      default:
        element = <div>Došlo je do greške. Sowwyy...</div>;
        break;
    }

    let colour;
    this.colours.forEach(c => {
      if(c.key === this.state.view) {
        colour = c.value;
      }
    })

    let status = null;
    if (this.state.who !== "user") {
      return (
        <div className="overlord">
          <Navigation
            view={this.state.view}
            color={colour}
            who={this.state.who}
            isAdmin={this.state.isAdmin}
            changeOverlordState={this.changeState}
          ></Navigation>
          <div className="flex-row">
            <div className="container-fluid">{element}</div>
          </div>
        </div>
      );
    }
    return (
      <div className="overlord">
        <Navigation
          userLogout={this.userLogout}
          view={this.state.view}
          color={colour}
          who={this.state.who}
          isAdmin={this.state.isAdmin}
          changeOverlordState={this.changeState}
        ></Navigation>
        
        <div className="overlord-big">
          <div className="col-10">{element}</div>
          <div className="col-2">
            <StatusComponent theEnd={this.studySessionEnded} isStudying={this.state.isStudying} workTime={this.state.workTime} 
            breakTime={this.state.breakTime} resetMMChanged={this.resetMMChanged} dbMMChanged={this.state.dbMMChanged} user={this.state.user}></StatusComponent>
          </div>
        </div>

        <div className="overlord-small">
          <div className="col-10">{element}</div>
          <div className="col-2">
            <StatusComponent theEnd={this.studySessionEnded} isStudying={this.state.isStudying} workTime={this.state.workTime} 
            breakTime={this.state.breakTime} resetMMChanged={this.resetMMChanged} dbMMChanged={this.state.dbMMChanged} user={this.state.user}></StatusComponent>
          </div>
        </div>
      </div>
    );
  }
}

export default SlothOverlord;
