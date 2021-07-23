import { Visibility } from "./visibility.js"
import { Card } from "./card.js"
import { Category} from "./category.js"

export class CardSet {
    constructor(id, title, color, tags, groupID, grade) {
        this.id = id;
        this.title = title;
        this.color = color; //should start with #
        this.tags = tags; 
        this.category = null; //zbog funkcija
        this.visibility = null; //^^^
        this.cards = [];
        this.groupID = groupID;
        this.grade = grade;
    }

    setVisibility(value){
        switch(value)
        {
            case 1:
                this.visibility = Visibility.public;
                break;
            case 2:
                this.visibility = Visibility.private;
                break;
            case 3:
                this.visibility = Visibility.group;
                break;
            default:
                this.visibility = null;
                break;
        }
    }

    setCategory(value){
        switch(value)
        {
            case 1:
                this.category = Category.naturalScience;
                break;
            case 2:
                this.category = Category.technologyAndEngineering;
                break;
            case 3:
                this.category = Category.medicalSciences;
                break;
            case 4:
                this.category = Category.socialSciences;
                break;
            case 5:
                this.category = Category.humanities;
                break;
            case 6:
                this.category = Category.other;
                break;
            default:
                this.category = null;
                break;

        }
    }

    /*addCard(card) {
        card.setAttributes(this.color, this.tags, this.category, this.visibility)
        this.cards.push(card);
    }*/

    //metoda umesto addCard
    //trenutno addCard ostaje za proveru jer nemaju svi pristup bazi
    createCard(card)
    {
        //proveriti parametre
        fetch("https://localhost:5001/SLOTH/CreateCard/" + this.id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": card.id, //proveriti da li treba da se salje
                "questionSide": card.questionSide,
                "answerSide": card.answerSide,
                "color": this.color,
                "tags": this.tags,
                "category": this.category.value,
                "visibility": this.visibility.value

            })
        }).then(p => {
            if(p.ok){
                //dodavanje kartice nakon potvrde servera
                card.setAttributes(this.tags, this.category, this.visibility, this.color);
                this.cards.push(card);
            }
            else
            {
                //poruka o gresci
            }
        })
    }

    //brisanje kartice
    deleteCard(card)
    {
        fetch("https://localhost:5001/SLOTH/DeleteCard/" + card.id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
               
            })
        }).then(p => {
            if(p.ok)
            {
                //kartica se brise nakon potvrde servera
                this.cards = this.cards.filter(c => c.id !== card.id);
            }
            else
            {
                //poruka o gresci
            }
        });

    }


    //Preuzimanje kartica iz baze
    getCards()
    {
        this.cards.splice(0, this.cards.length);
        fetch("https://localhost:5001/SLOTH/GetCards/" + this.id).then(p=>{
            p.json().then(data => {
                data.forEach(card => {
                    const newCard = new Card (card.id, card.questionSide, card.answerSide);
                    newCard.setAttributes(this.tags, this.category, this.visibility, this.color);

                    this.cards.push(newCard);
                });
            });
        });

    }

    updateCardSet(title, color, tags, category, visibility)
    {
        fetch("https://localhost:5001/SLOTH/UpdateCardSet", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify ({
                "title": title,
                "color": color,
                "tags": tags,
                "category": category.value, 
                "visibility": visibility.value
            })
        }).then(p => {

            if(p.ok){
                //azuriranje nakon potvrde servera
                this.title = title;
                this.color = color;
                this.tags = tags;
                this.category = category;
                this.visibility = visibility;
            }
            else
            {
                //poruka o gresci
            }
        })
    }




}