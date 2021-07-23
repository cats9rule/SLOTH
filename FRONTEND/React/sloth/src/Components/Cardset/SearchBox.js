import React, { Component } from "react";

import "./../../styles/searchbox.css";

/**
 * KOMPONENTA SEARCHBOX
 *
 * Služi za pretraživanje niza nečega na osnovu ukucanog stringa.
 * 
 * Komponenta uzima niz, filtrira ga na osnovu ukucane vrednosti, i vraća višoj komponenti. 
 * Ova komponenta služi samo za filtriranje niza, ne i za njegovo renderovanje na stranici.
 * Pošto postoji više mogućnosti u pogledu tipa elemenata koji se pretražuju, njihovo renderovanje je
 * prepušteno višoj komponenti.
 * 
 *    * * * * * * * * * * * * * * DODAVANJE FUNKCIONALNOSTI PLS READ ME   * * * * * * * * * * * * * * 
 *    *  Ako je potrebno dodati neku funkcionalnost (npr. novi element po kom se pretražuje),       *
 *    *  dodati novu funkciju koja će se pozivati u searchFilter funkciji u okviru switch naredbe.  *
 *    *  Dodati novi case za switch gde se ispituje da li je props.type novi tip za koji se dodaje  *
 *    *  pretraživanje. Tnx na saradnji hab fun.                                                    *
 *    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * ---------------------------------------------------------------------------------------------------------------------
 * PROPS:
 *   - array - niz stvari koje se pretražuju
 *   - type - tip elemenata koji se pretražuje
 *   - sendResults - funkcija iz više komponente koja preuzima rezultujući niz
 * ---------------------------------------------------------------------------------------------------------------------
 * STATE:
 *   - searchElements - niz prosleđenih elemenata (ne menjati)
 *   - searchResults - niz koji predstavlja rezultat pretrage
 *   - type - prosleđeni tip elemenata koji se filtriraju
 *   - keyword - uneta vrednost po kojoj se pretražuje
 * ---------------------------------------------------------------------------------------------------------------------
 */

export class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchElements: props.array,
      searchResults: [],
      type: props.type,
      keyword: "",
    };
  }

  searchInputHandler = (event) => {
    this.setState({ keyword: event.target.value });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.searchFilter(), 800);
  };


  //#region Search Types
  searchMaterial() {
    return this.state.searchElements.filter((data) => {
      if (this.state.keyword == "") {
        return data;
      } else if (
        data.title.toLowerCase().includes(this.state.keyword.toLowerCase()) ||
        data.category.name
          .toLowerCase()
          .includes(this.state.keyword.toLowerCase())
      ) {
        return data;
      } else {
        let indicator = false;
        data.tags.forEach((tag) => {
          if (tag.toLowerCase().includes(this.state.keyword.toLowerCase())) {
            indicator = true;
          }
        });
        if (indicator) return data;
      }
    });
  }

  searchUsers() {
    return this.state.searchElements.filter((data) => {
      if (this.state.keyword == "") {
        return data;
      } else if (
        data.username
          .toLowerCase()
          .includes(this.state.keyword.toLowerCase()) ||
        data.tag.toLowerCase().includes(this.state.keyword.toLowerCase()) ||
        data.firstName
          .toLowerCase()
          .includes(this.state.keyword.toLowerCase()) ||
        data.lastName.toLowerCase().includes(this.state.keyword.toLowerCase())
      ) {
        return data;
      }
    });
  }

  searchGroups() {
    return this.state.searchElements.filter((data) => {
      if (this.state.keyword == "") {
        return data;
      } else if (
        data.name.toLowerCase().includes(this.state.keyword.toLowerCase()) || data.teacherID === parseInt(this.state.keyword)
      ) {
        return data;
      }
    });
  }

  searchCards() {
    return this.state.searchElements.filter((data) => {
      if (this.state.keyword == "") {
        return data;
      } else if (
        data.questionSide.toLowerCase().includes(this.state.keyword.toLowerCase()) || 
        data.answerSide.toLowerCase().includes(this.state.keyword.toLowerCase())
      ) {
        return data;
      }
    });
  }

  searchNotes() {
    return this.state.searchElements.filter((data) => {
      if (this.state.keyword == "") {
        return data;
      } else if (
        data.title.toLowerCase().includes(this.state.keyword.toLowerCase()) ||
        data.text.toLowerCase().includes(this.state.keyword.toLowerCase())
      ) {
        return data;
      }
    });
  }

  searchMessages() {
    return this.state.searchElements.filter((data) => {
      if (this.state.keyword == "") {
        return data;
      } else if (
        data.name.toLowerCase().includes(this.state.keyword.toLowerCase()) ||
        data.message.toLowerCase().includes(this.state.keyword.toLowerCase())
      ) {
        return data;
      }
    });
  }

  searchPlans() {
    return this.state.searchElements.filter((data) => {
      if (this.state.keyword == "") {
        return data;
      } else if (
        data.name.toLowerCase().includes(this.state.keyword.toLowerCase())
      ) {
        return data;
      }
    });
  }
  //#endregion

  searchFilter() {
    let items;

    switch (this.props.type) {
      case "material":
        items = this.searchMaterial();
        break;
      case "users":
        items = this.searchUsers();
        break;
      case "groups":
        items = this.searchGroups();
        break;
      case "cards":
        items = this.searchCards();
        break;
      case "notes":
        items = this.searchNotes();
        break;
      case "messages":
        items = this.searchMessages();
        break;
      case "plans":
        items = this.searchPlans();
        break;
    }

    this.setState({ searchResults: items });
    this.props.sendResults(items);
  }

  componentDidUpdate(prevProps, prevState)
  {
    if(prevProps.array !== this.props.array)
    {
      this.setState({
        searchElements: this.props.array,
      })
    }
  }
  render() {
    return (
      <div>
        <input
          type="text"
          placeholder="Enter item to be searched"
          className="searchbox"
          onChange={this.searchInputHandler}
        />
      </div>
    );
  }
}

export default SearchBox;
