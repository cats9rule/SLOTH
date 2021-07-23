export class Card {
  constructor(id, questionSide, answerSide) {
    this.id = id;
    this.questionSide = questionSide;
    this.answerSide = answerSide;
  }

  updateCard(questionSide, answerSide)
  {
    fetch("https://localhost:5001/SLOTH/UpdateCard", {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify ({
        "id": this.id,
        "questionSide": questionSide,
        "answerSide": answerSide
      })
    }).then(p => {
      if(p.ok){
        //podaci se azuriraju nakon potvrde servera
        this.questionSide = questionSide;
        this.answerSide = answerSide;
      }
      else
      {
        //poruka o gresci
      }
    });
  }
}
