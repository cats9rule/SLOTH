import { CardSet } from "./cardSet.js"
import { Notebook } from "./notebook.js"
import { Calendar } from "./calendar.js"
import { Group } from "./studyPlan.js"

export class User {
    constructor(id, username, password, tag, firstName, lastName, avatar, calendar, isAdmin) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.tag = tag;
        this.firstName = firstName;
        this.lastName = lastName;
        this.avatar = avatar; //ovo treba da bude ime izabrane slike
        this.calendar = calendar;
        this.isAdmin = isAdmin;
        this.cardSet = [];
        this.notebooks = [];
        this.groups = [];
        this.studyPlans = [];
    }

    //trebalo je za proveru hardkodiranih podataka
    addCardSet(cs)
    {
        console.log(this.cardSet);
        if(!this.cardSet.includes(cs))
            this.cardSet.push(cs);
    }
    addNotebook(nb)
    {
        console.log(this.notebooks);
        if(!this.notebooks.includes(nb))
            this.notebooks.push(nb);
    }
    getCardSets()
    {
        this.cardSet.splice(0, this.cardSet.length);
        fetch("https://localhost:5001/SLOTH/GetCardSets/" + this.id).then(p => {
            p.json().then(data => {
                data.forEach(cardSet => {
                    const newCardSet = new CardSet(cardSet.id, cardSet.title, cardSet.color, cardSet.tags, cardSet.category, cardSet.visibility);
                    newCardSet.setVisibility(cardSet.visibility);

                    this.cardSet.push(newCardSet);
                })
            })
        })

        console.log(this.cardSet);
    }

    //proveriti parametre
    createCardSet(cardSet)
    {
        fetch("https://localhost:5001/SLOTH/CreateCardSet/" + this.id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": cardSet.id, //proveriti da li treba da se salje
                "title": cardSet.title,
                "color": cardSet.color,
                "tags": cardSet.tags,
                "category": cardSet.category.value,
                "visibility": cardSet.visibility.value
            })
        }).then(p => {
            if(p.ok){
                //dodavanje spila kartica nakon potvrde servera

                this.cardSet.push(cardSet);
            }
            else
            {
                //poruka o gresci
            }
        })
    }

    deleteCardSet(cardSet)
    {
        fetch("https://localhost:5001/SLOTH/DeleteCardSet/" + cardSet.id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

            })
        }).then(p => {
            if(p.ok)
            {
                //spil kartica se brise nakon potvrde servera

                //proveriti kako ide brisanje kartica

                this.cardSet = this.cardSet.filter(cs => cs.id !== cardSet.id);
            }
            else
            {
                //poruka o gresci
            }
        })
    }
    
    getNotebooks()
    {
        
        this.notebooks.splice(0, this.notebooks.length);
        fetch("https://localhost:5001/SLOTH/GetNotebooks/" + this.id).then(p => {
             p.json().then(data => {
                 data.forEach(notebook => {
                     const newNotebook = new Notebook(notebook.id, notebook.title, notebook.tags);
                     newNotebook.setVisibility(notebook.visibility);
                     newNotebook.setCategory(notebook.category);
                     this.addNotebook(newNotebook);
                 })
             })
         })
          
    }

    //proveriti parametre
    createNotebook(notebook)
    {
        fetch("https://localhost:5001/SLOTH/createNotebook/" + this.id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": notebook.id,
                "title": notebook.title,
                "tags": notebook.tag, //proveriti da li je tag/tags
                "category": notebook.category,
                "visibility": notebook.visibility.value
            })
        }).then(p => {
            if(p.ok){
                //dodavanje beleznice nakon potvrde servera

                this.notebooks.push(notebook);
            }
            else
            {
                //poruka o gresci
            }
        })
    }

    deleteNotebook(notebook)
    {
        fetch("https://localhost:5001/SLOTH/DeleteNotebook/" + notebook.id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

            })
        }).then(p => {
            if(p.ok)
            {
                //beleznica se brise nakon potvrde servera

                this.notebooks = this.notebooks.filter(nb => nb.id !== notebook.id);
            }
            else
            {
                //poruka o gresci
            }
        })
    }
}

