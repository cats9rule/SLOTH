export class Note {
    constructor(id, title, text) {
        this.id = id;
        this.title = title;
        this.text = text;
    }
    updateNote(text)
    {
        fetch("https://localhost:5001/SLOTH/UpdateNote", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify ({
                "id": this.id,
                "text": text
            })
        }).then(p => {
            if(p.ok){
                //podaci se azuriraju nakon potvrde servera
                this.text = text;
            }
            else
            {
                //poruke o gresci
            }
        });
    }
}