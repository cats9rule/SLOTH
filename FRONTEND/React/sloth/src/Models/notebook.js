import { Note } from "./note.js"
import {Visibility} from "./visibility.js"
import {Category} from "./category.js"

export class Notebook {
    constructor(id, title, tags, groupID, grade) {
        this.id = id;
        this.title = title;
        this.tags = tags;
        this.category = null; //zbog funkcija
        this.visibility = null; //^^^
        this.notes = [];
        this.groupID = groupID;
        this.grade = grade;
    }

    addNote(note) {
        this.notes.push(note);
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
    updateNotebook(title, tags, category, visibility)
    {
        fetch("https://localhost:5001/SLOTH/UpdateNotebook", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "title": title,
                "tags": tags, //proveriti da li se tako zove
                "category": category.value,
                "visibility": visibility.value
            })
        }).then(p => {
            if(p.ok){
                //azuriranje nakon potvrde servera
                this.title = title;              
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

    getNotes()
    {
        this.notes.splice(0, this.notes.length);
        fetch("https://localhost:5001/SLOTH/GetNotebooks/" + this.id).then (p=> {
            p.json().then(data => {
                data.forEach(note => {
                    const newNote = new Note (note.id, note.text);
                    newNote.setAttributes(this.tags, this.category, this.visibility);
                   

                    this.notes.push(newNote);

                });
            });
        });
    }

    //umesto addNote
    //trenutno addNote ostaje za proveru jer nemaju svi pristup bazi
    createNote(note)
    {
        //proveri parametre funkcije
        fetch("https://localhost:5001/SLOTH/CreateNote/" + this.id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": note.id, //proveriti da li treba da se salje
                "text": note.text,
                "tags": this.tags,
                "category": this.category.value,
                "visibility": this.visibility.value
            })
        }).then(p => {
            if(p.ok){
                //dodavanje beleske nakon potvrde servera
                note.setAttributes(this.tags, this.category, this.visibility);
                this.notes.push(note);
            }
            else
            {
                //poruka o gresci
            }
        })
    }

    deleteNote(note)
    {
        //proveriti parametre
        fetch("https://localhost:5001/SLOTH/DeleteNote/" + note.id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

            })
        }).then(p => {
            if(p.ok)
            {
                //beleska se brise nakon potvrde servera
                this.notes = this.notes.filter(n => n.id !== note.id);
            }
            else 
            {
                //poruka o gresci
            }
        })
    }
}