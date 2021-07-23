export class Group
{
    constructor(id, teacherID, name)
    {
        this.id = id;
        this.teacherID = teacherID;
        this.name = name;
        this.users = [];
    }

    addUser(user)
    {
        if(!this.users.includes(user))
            this.users.push(user);
    }
}