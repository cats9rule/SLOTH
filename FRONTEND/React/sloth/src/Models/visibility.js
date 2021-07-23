/* 
    let visibility = Visibility.public;
    console.log(visibility.name); -> Public
    console.log(visibility.value); -> 1

    Error 0
    Public 1
    Private 2
    Group 3
*/

export class Visibility
{
    static public = new Visibility('Public');
    static private = new Visibility('Private');
    static group = new Visibility('Group');

    constructor(name){
        this.name = name;
        switch(name)
        {
            case 'Public':
                this.value = 1;
                break;
            case 'Private':
                this.value = 2;
                break;
            case 'Group':
                this.value = 3;
                break;
            default:
                this.value = 0;
                break;
        }
    }

    // toString(){
    //     return `Visibility.${this.name}`;
    // }
}