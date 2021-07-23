/*
pozvati funkciju showAvatar i posalti name slike
return vraca link tako da se to postavlja za img src (ako ce tako biti)
ako treba moze da se vrati ceo "objekat" i da ima i name

Ovo bi trebalo da dodamo negde posto kao attribution jer su free
<div>Icons made by <a href="https://www.flaticon.com/authors/dighital" title="Dighital">Dighital</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
*/

export default class Avatar {
    constructor() {
        this.bat =
        {
            name: "bat",
            link: "https://drive.google.com/thumbnail?id=1MUP5CusGr_PNIGY5P7RB8LA1QXhhzxul"
        };

        this.bear =
        {
            name: "bear",
            link: "https://drive.google.com/thumbnail?id=1Fr1LUzaPj_jed2bCMYpIKjkOoQ20eIix"
        };

        this.cat = 
        {
            name: "cat",
            link: "https://drive.google.com/thumbnail?id=1M5RDihnrZpEPXxwFl-xEuBIMYWZdeVfn"
        };

        this.dog = 
        {
            name: "dog",
            link: "https://drive.google.com/thumbnail?id=1vxNfRIRiVu3iDYW15tqlKqExPVEYdijE"
        };

        this.fox = 
        {
            name: "fox",
            link: "https://drive.google.com/thumbnail?id=1i365SYwQCrME9fOywwjeaVsnYXrw3qgq"
        }

        this.giraffe = 
        {
            name: "giraffe",
            link: "https://drive.google.com/thumbnail?id=18K-mkzbUJbM4_wBVhTGHqHBm4jDk3aAb"
        }

        this.gorilla = 
        {
            name: "gorilla",
            link: "https://drive.google.com/thumbnail?id=1zd3lPYOy77oPx7QD7n-AzlHtiNFYCKWB"
        }

        this.parrot = 
        {
            name: "parrot",
            link: "https://drive.google.com/thumbnail?id=1ZRQwydDJDMU5Hn_BPi6-7NTel5b2uqHr"
        }

        this.penguin =
        {
            name: "penguin",
            link: "https://drive.google.com/thumbnail?id=1JGYZyh5kr0x1FI88NemdMeiGgzzxKn0d"
        }

        this.pufferFish = 
        {
            name: "pufferFish",
            link: "https://drive.google.com/thumbnail?id=1refZ2uqHRxuH5iyIe-cHn3nYwXR9pay8"
        }

        this.sloth = 
        {
            name: "sloth",
            link: "https://drive.google.com/thumbnail?id=1dKdiIqK4ioDRlF6Bq0RmMiXV1QAXFrft"
        }

        this.zebra = 
        {
            name: "zebra",
            link: "https://drive.google.com/thumbnail?id=1qKiVlDGphqDulvoPx-Js_DW0ul2OsS8l"
        }

        this.arrayOfAvatars = ["bat", "bear", "cat", "dog", "fox", "giraffe", "gorilla", "parrot", 
            "penguin", "pufferFish", "sloth", "zebra"];
    }

    showAvatar(name) {
        switch(name)
        {
            case "bat":
                return this.bat.link;
            case "bear":
                return this.bear.link;
            case "cat":
                return this.cat.link;
            case "dog":
                return this.dog.link;
            case "fox":
                return this.fox.link;
            case "giraffe":
                return this.giraffe.link;
            case "gorilla":
                return this.gorilla.link;
            case "parrot":
                return this.parrot.link;
            case "penguin":
                return this.penguin.link;
            case "pufferFish":
                return this.pufferFish.link;
            case "sloth":
                return this.sloth.link;
            case "zebra":
                return this.zebra.link;
            default:
                return null;
        }
    }
}