/** 
 *  Error 0
    Natural Sciences 1
    Technology and Engineering 2
    Medical Sciences 3 
    Social Sciences 4 
    Humanities 5
    Other 6
 * 
*/

export class Category
{
    static naturalScience = new Category('Natural Science');
    static technologyAndEngineering = new Category('Technology And Engineering');
    static medicalSciences = new Category('Medical Sciences');
    static socialSciences = new Category('Social Sciences');
    static humanities = new Category('Humanities');
    static other = new Category('Other');

    constructor(name){
        this.name = name;
        switch(name)
        {
            case 'Natural Science':
                this.value = 1;
                break;
            case 'Technology And Engineering':
                this.value = 2;
                break;
            case 'Medical Sciences':
                this.value = 3;
                break;
            case 'Social Sciences':
                this.value = 4;
                break;
            case 'Humanities':
                this.value = 5;
                break;
            case 'Other':
                this.value = 6;
                break;
            default:
                this.value = 0;
                break;
        }
    }

   
}