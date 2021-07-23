using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WEBAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Newtonsoft.Json;

namespace WEBAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SLOTHController : ControllerBase
    {
        #region Attributes
        private const string alphaUppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        private const string alphaLowercase = "abcdefghijklmnopqrstuvwxyz";
        private Random random;
        private List<string> usedTags;
        public struct StructForIDs
        {
            [JsonProperty]
            public List<int> ids { set; get; }
        }
        private struct AnswerStruct
        {
            public string Answer { set; get; }
            public bool TrueFalse { set; get; }
        }

        #endregion
        public SLOTHContext Context { get; set; }

        public SLOTHController(SLOTHContext context)
        {
            random = new Random();
            usedTags = new List<string>();
            Context = context;
        }

        #region Methodes
        private char GetRandomUppercase()
        {
            return alphaUppercase[random.Next(0, 26)];
        }

        private char GetRandomLowercase()
        {
            return alphaLowercase[random.Next(0, 26)];
        }

        private string SALTGenerator()
        {
            string salt = "";

            for (int i =0; i < 12; i++) //neka za sad bude po 11 random karaktera
            {
                if(i%3 == 0)
                    salt += GetRandomUppercase();
                else if (i%3 == 1)
                    salt += GetRandomLowercase();
                else
                    salt += random.Next(0, 10).ToString();
            }
            
            return salt;
        }

        private string PasswordHashing(string password)
        {
            using(SHA256 sha256 = SHA256.Create())
            {
                var hashedPassword = new System.Text.StringBuilder();
                var bytePassword = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));

                foreach (var b in bytePassword)
                {
                    hashedPassword.Append(b.ToString("x2"));
                }

                return hashedPassword.ToString();
            }
        }
        #endregion

        #region Testing

        [Route("TestGenerator/{numberOfQs}")]
        [HttpPut]
        public async Task<IActionResult> TestGenerator(int numberOfQs, [FromBody] StructForIDs structForIDs)
        {
            List<CardSet> cardSets = new List<CardSet>();
            List<Card> cards = new List<Card>();

            var mappedQsAs = new Dictionary<string, List<AnswerStruct>>(); //map koja se salje frontendu, svaka stavka ima question kao key i listu odgovora kao answer
            string question = "";
            AnswerStruct trueAnswer = new AnswerStruct(); //svaka answerstructura ima string i bool koji oznacava da li je odgovarajuci odgovor ili ne
            AnswerStruct falseAnswer;
            List<AnswerStruct> answers;
            
            int side = random.Next(0, 2); //da li ce biti question == question ili question == answer
            int randomCard; //kartica koja ce da bude question i true answer
            List<int> usedQuestions = new List<int>();
            usedQuestions.Add(-1);
            int falseAnswerCard; //potrebni su i tri false answers
            List<int> falseAnswerCardList; //da se ne bi ponavljali isti false answers

            foreach (int i in structForIDs.ids)
            {
                cards.AddRange(Context.Cards.Where(c => c.CardSet.ID == i)); //selektovanje svih kartica koje su izabrane  
            }
            
            int amountOfCards = cards.Count; //ukupan broj kartica

            if (amountOfCards < numberOfQs)
                return StatusCode(406);

            if (numberOfQs == 1 || numberOfQs == 2 || numberOfQs == 3)
                if (amountOfCards < 4)    
                    return StatusCode(405);

            for (int i = 0; i < numberOfQs; i++) //generisanje pitanja
            {
                falseAnswerCardList = new List<int>(); //za svako pitanje treba nova lista za false fanswers
                falseAnswerCardList.Add(-1);

                randomCard = random.Next(0, amountOfCards);
                while(usedQuestions.Contains(randomCard))
                    randomCard = random.Next(0, amountOfCards);

                usedQuestions.Add(randomCard);

                if (side == 0) //question == question
                {
                    //postavljanje question i true answer
                    question = cards[randomCard].QuestionSide; 
                    trueAnswer.Answer = cards[randomCard].AnswerSide;
                    trueAnswer.TrueFalse = true;

                    answers = new List<AnswerStruct>(); //lista za sve answers
                    answers.Add(trueAnswer);

                    for(int j = 0; j < 3; j++) //generisanje false answers
                    {
                        falseAnswerCard = random.Next(0, amountOfCards);

                        while (falseAnswerCard == randomCard || falseAnswerCardList.Contains(falseAnswerCard)) //provera da nije ista kartica kao true answer i da nije vec izabran false answer
                            falseAnswerCard = random.Next(0, amountOfCards);                            
                        
                        falseAnswerCardList.Add(falseAnswerCard);

                        //postavljanje false answer i dodavanje u listu odgovora 
                        falseAnswer = new AnswerStruct();
                        falseAnswer.Answer = cards[falseAnswerCard].AnswerSide;
                        falseAnswer.TrueFalse = false;
                        answers.Add(falseAnswer);
                    }

                    mappedQsAs.Add(question, answers); //mapiranje
                }
                else //question == answer
                //ista logika stim da je answerside -> questionside, questionside -> answerside
                {
                    question = cards[randomCard].AnswerSide; 
                    trueAnswer.Answer = cards[randomCard].QuestionSide;
                    trueAnswer.TrueFalse = true;

                    answers = new List<AnswerStruct>();
                    answers.Add(trueAnswer);

                    for(int j = 0; j < 3; j++)
                    {
                        falseAnswerCard = random.Next(0, amountOfCards);

                        while (falseAnswerCard == randomCard || falseAnswerCardList.Contains(falseAnswerCard))
                            falseAnswerCard = random.Next(0, amountOfCards);                            
                        
                        falseAnswerCardList.Add(falseAnswerCard);

                        falseAnswer = new AnswerStruct();
                        falseAnswer.Answer = cards[falseAnswerCard].QuestionSide;
                        falseAnswer.TrueFalse = false;
                        answers.Add(falseAnswer);
                    }

                    mappedQsAs.Add(question, answers);
                }

                side = random.Next(0, 2); //potencijalna promena side-a u sledecem prolazu
            }
            
            
            return Ok(mappedQsAs); //frontednu se vraca mapa kroz ok jer ce se potencijalno ubacite provere za neke greske
        }

        [Route("MemoryGameGenerator/{numberOfCards}")]
        [HttpPut]
        public async Task<IActionResult> MemoryGameGenerator(int numberOfCards, [FromBody] StructForIDs structForIDs)
        {
            if(numberOfCards % 2 != 0)
                return StatusCode(406);

            List<Card> cards = new List<Card>();

            //selektovanje svih kartica iz spilova
            foreach (int id in structForIDs.ids)
            {
                cards.AddRange(Context.Cards.Where(c => c.CardSet.ID == id));
            }

            if(cards.Count < numberOfCards / 2)
                return StatusCode(405);

            //shuffle
            int n = cards.Count;

            while (n > 1)
            {
                n--;
                int k = random.Next(n+1);
                Card value = cards[k];
                cards[k] = cards[n];
                cards[n] = value;
            }

            List<Card> randomizedCards = new List<Card>();

            //prvih numberOfCards/2 se vraca kao odgovor
            for(int i = 0; i < numberOfCards / 2; i++)
            {
                randomizedCards.Add(cards[i]);
            }  
            
            return Ok(randomizedCards);
        }  

        #endregion

        #region User

        [Route("GetAllUsers")]
        [HttpGet]
        public async Task<List<User>> GetAllUsers()
        {
            var users = await Context.Users.ToListAsync();
            
            foreach (var u in users)
            {
                u.Password = null;
                u.Salt = null;
            }

            return users;
        }

        //Provereno -> radi
        //Fetch -> radi
        [Route("CreateUser")]
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            user.Salt = this.SALTGenerator();
            string passAndSalt = user.Password + user.Salt;
            user.Password = this.PasswordHashing(passAndSalt);

            int minNum = 0;
            int maxNum = 9999;

            String generatedTag = random.Next(minNum, maxNum).ToString("D4");
            
            while (this.usedTags.Contains(generatedTag))
            {
                User sameTagUser = (User)Context.Users.Where(u => u.Tag == generatedTag);
                
                if(sameTagUser.Username == user.Username)
                    generatedTag = random.Next(minNum, maxNum).ToString("D4");
            }

            usedTags.Add(generatedTag);
            
            user.Tag = generatedTag;

            Context.Users.Add(user);
            
            await Context.SaveChangesAsync();
                        
            user.Password = null;
            user.Salt = null;
            return Ok(user);
        }

        [Route("PromoteToAdmin/{userID}")]
        [HttpPut]
        public async Task<IActionResult> PromoteToAdmin(int userID)
        {
            var u = await Context.Users.FindAsync(userID);

            if (u == null)
                return BadRequest();

            u.IsAdmin = true;

            await Context.SaveChangesAsync();
            return Ok();
        }

        //Provereno -> radi
        [Route("UpdateUser/{userID}")]
        [HttpPut]
        public async Task<IActionResult> UpdateUser(int userID, [FromBody] User user)
        {
            var u = await Context.Users.FindAsync(userID);

            if (u == null)
                return BadRequest();

            u.FirstName = user.FirstName;
            u.LastName = user.LastName;
            
            await Context.SaveChangesAsync();
            return Ok();
        }

        //Provereno -> radi
        [Route("UpdateUserName/{userID}/{newUsername}")]
        [HttpPut]
        public async Task<IActionResult> UpdateUsername(int userID, String newUsername)
        {
            User user = (User)Context.Users.Where(u => u.ID == userID).FirstOrDefault();

            if (user == null)
                return BadRequest();

            if (user.Username.Equals(newUsername)) //ako je user toliko dumb
                return StatusCode(406);  //ili neki drugi
            
            List<User> usersWithUsername = await Context.Users.Where(u => u.Username.Equals(newUsername) && u != user ).ToListAsync<User>(); 

            if (usersWithUsername != null) //vec neko ima taj username
            {
                foreach (User u in usersWithUsername)
                {
                    if(u.Tag == user.Tag)
                        return StatusCode(405); //ili sta se dogovorimo ali ovo je da ima i username isti i tag (sanse su mnogo male ali da se osiguramo)
                }
            }

            //ako se nije vratilo u foru znaci da moze combo novi username sa tagom koji ima user
            user.Username = newUsername;

            await Context.SaveChangesAsync();
            return Ok();
        }

        //Provereno -> radi
        //Dodati za potvrdu i staru password ili nekakva potvrda
        [Route("UpdatePassword")]
        [HttpPut]
        public async Task<IActionResult> UpdatePassword([FromBody] User user) //u password new password
        {
            User u = (User)Context.Users.Where(u => u.ID == user.ID).FirstOrDefault();

            if (u == null)
                return BadRequest();

            string newPassAndSalt = user.Password + u.Salt;

            string hashedNewPassword = this.PasswordHashing(newPassAndSalt);

            if (u.Password == hashedNewPassword) //once again user dumb (or forgetful)
                return StatusCode(406); //or whatever
            
            u.Password = hashedNewPassword;

            await Context.SaveChangesAsync();
            return Ok();
        }

        //Provereno -> radi
        [Route("UpdateAvatar/{userID}/{newAvatar}")]
        [HttpPut]
        public async Task<IActionResult> UpdateAvatar(int userID, String newAvatar)
        {
            User u = (User)Context.Users.Where(u => u.ID == userID).FirstOrDefault();

            if (u == null)
                return BadRequest();

            u.Avatar = newAvatar;
            await Context.SaveChangesAsync();

            return Ok();
        }

        //Provereno -> radi
        [Route("DeleteUser/{userID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteUser(int userID)
        {
            var user = await Context.Users.FindAsync(userID);

            if (user == null)
                return BadRequest();

            //proveriti!!
            var userNotebooks = await Context.UserNotebook.Where(u => u.OwnerID == userID).ToListAsync();
            var userCardSets = await Context.UserCardSet.Where(u => u.OwnerID == userID).ToListAsync();

            foreach (var un in userNotebooks)
            {
                await this.DeleteNotebook(un.NotebookID);
            }

            foreach (var us in userCardSets)
            {
                await this.DeleteCardSet(us.CardSetID);
            }

            /*TRY THIS
            Context.RemoveRange(userNotebooks);
            Context.RemoveRange(userCardSets);
            */
            Context.Remove(user);

            await Context.SaveChangesAsync();
            return Ok();
        }

        //Provereno -> radi
        //proveriti zasto prihvata i sa razmacima
        [Route("UserValidating")] 
        [HttpPost]
        public async Task<IActionResult> UserValidating([FromBody] User user)
        {
            /*lozinka sa frontenda
            cita se SALT iz baze za korisnika
            SALT se nadovezuje na lozinku
            HASH nad novim stringom
            HASH vrednost se poredi sa HASH vrednoscu iz baze   
            ako se poklapaju onda je ispravna lozinka*/

            string un = user.Username.Substring(0, user.Username.Length-5); //samo username
            string tag = user.Username.Substring(user.Username.Length-4); //samo tag
            User u = (User)Context.Users.Where(u => u.Username.Equals(un) && u.Tag == tag).FirstOrDefault();
            if(u == null) //user ne postoji sa tim username i tag
            {
                return StatusCode(405); //ili sta se dogovorimo               
            }

            string passAndSalt = user.Password + u.Salt;
            string hashedPassword = this.PasswordHashing(passAndSalt);

            if (hashedPassword == u.Password)
            {
                u.Password = null;
                u.Salt = null;
                return Ok(u);
            }
            else
                return StatusCode(406); //ili sta se dogovorimo
        }

        #endregion
        
        #region Group

        [Route("GetAllGroups")]
        [HttpGet]
        public async Task<List<Group>> GetAllGroups()
        {
            return await Context.Groups.ToListAsync();
        }

        //Provereno -> radi (za jednu grupu)
        [Route("GetGroups/{userID}")]
        [HttpGet]
        public async Task<List<Group>> GetGroups(int userID)
        {
            return await Context.UserGroup.Where(userGroup => userGroup.UserID == userID).Select(userGroup => userGroup.Group).ToListAsync();
        }

        //Provereno -> radi 
        [Route("GetGroup/{groupID}")]
        [HttpGet]
        public async Task<Group> GetGroup(int groupID)
        {
            return await Context.Groups.FindAsync(groupID);
        }

        //Provereno -> radi
        [Route("CreateGroup")]
        [HttpPost]
        public async Task<IActionResult> CreateGroup([FromBody] Group group)
        {
            var u = await Context.Users.FindAsync(group.TeacherID);
            if(u == null)
                return BadRequest();

            Context.Groups.Add(group);
            await Context.SaveChangesAsync();

            var g = await Context.Groups.FindAsync(group.ID);
            
            UserGroup ug = new UserGroup();
            ug.Group = g;
            ug.GroupID = g.ID;
            ug.OwnerID = g.TeacherID;
            ug.User = u;
            ug.UserID = u.ID;

            Context.UserGroup.Add(ug);
            await Context.SaveChangesAsync();
            
            return Ok(g.ID);
        }

        //Provereno -> radi
        [Route("UpdateGroup")]
        [HttpPut]
        public async Task<IActionResult> UpdateGroup([FromBody] Group group)
        {
            var g = await Context.Groups.FindAsync(group.ID);

            if (g == null) //ne bi trebalo da se desi
                return StatusCode(406);

            g.Name = group.Name;
            
            Context.Update<Group>(g);
            await Context.SaveChangesAsync();

            return Ok();
        }

        //Provereno -> radi
        [Route("DeleteGroup/{groupID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteGroup(int groupID)
        {
            var g = await Context.Groups.FindAsync(groupID);

            if (g == null)
                return BadRequest();

            var cardSets = await Context.CardSets.Where(cs => cs.GroupID == groupID).ToListAsync();
            var notebooks = await Context.Notebooks.Where(nb => nb.GroupID == groupID).ToListAsync();
            Context.RemoveRange(cardSets);
            Context.RemoveRange(notebooks);

            Context.Remove(g);

            await Context.SaveChangesAsync();
            return Ok();
        }
        
        [Route("PendingInvitations/{groupID}")]
        [HttpGet]
        public async Task<List<User>> PendingInvitations(int groupID)
        {
            var g = await Context.Groups.FindAsync(groupID);
            List<User> users = new List<User>();
            
            if(g.SentInvites != "" && g.SentInvites != null)
            {
                List<int> invites = g.SentInvites?.Split(';').Select(Int32.Parse).ToList();
                foreach(int i in invites)
                {
                    User u = await Context.Users.FindAsync(i);
                    users.Add(u);

                }

                foreach(var u in users)
                {
                    u.Password = null;
                    u.Salt = null;
                }
            }
            return users;
        }
        //Provererno -> radi
        [Route("GetMembers/{groupID}")]
        [HttpGet]
        public async Task<List<User>> GetUsers(int groupID)
        {
            var members = await Context.UserGroup.Where(userGroup => userGroup.GroupID == groupID).Select(userGroup => userGroup.User).ToListAsync();
            
            foreach (var m in members)
            {
                m.Password = null;
                m.Salt = null;
            }
            
            return members;
        }

        //Provereno -> radi
        [Route("AddMembers/{groupID}")]
        [HttpPost]
        public async Task<IActionResult> AddMember(int groupID, [FromBody] StructForIDs jnzds)
        {
            var group = await Context.Groups.FindAsync(groupID);

            if (group == null)
                return BadRequest();

            string oldInvites = group.SentInvites;
            string newInvites = string.Join(";", jnzds.ids);
            string invites;
            if(oldInvites != "" && oldInvites != null)
                invites = oldInvites + ";" + newInvites;
            else
                invites = newInvites;

            group.SentInvites = invites;

            await Context.SaveChangesAsync();
            return Ok();
        }

        //Provereno -> radi
        [Route("RemoveMembers/{groupID}/{userID}")]
        [HttpDelete]
        public async Task<IActionResult> RemoveMember(int groupID, int userID)
        {
            var ug = await Context.UserGroup.Where(ug => ug.GroupID == groupID && ug.UserID == userID).FirstOrDefaultAsync();

            if (ug == null)
                return BadRequest();

            var cardSets = await Context.UserCardSet.Where(us => us.UserID == userID).ToListAsync();
            var notebooks = await Context.UserNotebook.Where(un => un.UserID == userID).ToListAsync();

            //proveriti da li brisu i iz UserCardSet/UserNotebook (za sve delete metode)
            Context.RemoveRange(cardSets);
            Context.RemoveRange(notebooks);
            
            Context.Remove(ug);

            await Context.SaveChangesAsync();
            return Ok();
        }

        //Proverno -> radi
        [Route("CheckInvites/{userID}")]
        [HttpGet]
        public async Task<List<Group>> CheckInvites(int userID)
        {
            //za svaku grupu ce da proverava da li je user u SentInvites
            //JsonNeZeliDaSaradjuje jnzds = new JsonNeZeliDaSaradjuje();
            List<Group> groups = new List<Group>();
            
            var gs = await Context.Groups.Where(g => g.SentInvites.Contains(userID.ToString())).ToListAsync(); //gde god je user pozvan u grupu

            foreach (var g in gs)
            {
                //jnzds.ids.Add(g.ID); //msm da treba cela grupa jer pored id-a, treba name i mozda teacher (zavisi sta ce sve da se renderuje kao invite)
                groups.Add(g); //svaka grupa za kojuj je user pozvan da se pridruzi
            }

            return groups;
        }

        //Provereno -> radi
        [Route("AcceptInvite/{userID}/{groupID}")]
        [HttpGet]
        public async Task<IActionResult> AcceptInvite(int userID, int groupID)
        {
            var g = await Context.Groups.FindAsync(groupID);
            var u = await Context.Users.FindAsync(userID);

            if(g == null || u == null)
                return BadRequest();

            //brise se iz poslatih zahteva
            List<int> invites = g.SentInvites?.Split(';').Select(Int32.Parse).ToList(); //? je da proveri da nije null
            invites.Remove(userID);
            g.SentInvites = string.Join(";", invites);

            //potrebno kreirati stavku u n:m tabeli
            UserGroup ug = new UserGroup();
            ug.Group = g;
            ug.GroupID = groupID;
            ug.OwnerID = g.TeacherID;
            ug.User = u;
            ug.UserID = userID;
            
            var groupCSs = await Context.CardSets.Where(cs => cs.GroupID == groupID).ToListAsync();
            if (groupCSs.Count > 0)
            {
                foreach (var cs in groupCSs)
                {
                    var ucs = await Context.UserCardSet.Where(usc => usc.CardSetID == cs.ID && usc.OwnerID == usc.UserID).ToListAsync(); //bice samo jedan element
                    var userCardSet = new UserCardSet();
                    userCardSet.CardSet = cs;
                    userCardSet.CardSetID = cs.ID;
                    userCardSet.User = u;
                    userCardSet.UserID = u.ID;
                    userCardSet.OwnerID =  ucs[0].OwnerID;
                    Context.UserCardSet.Add(userCardSet);
                }
            }

            var groupNbs = await Context.Notebooks.Where(nb => nb.GroupID == groupID).ToListAsync();
            if (groupNbs.Count > 0)
            {
                foreach (var nb in groupNbs)
                {
                    var unb = await Context.UserNotebook.Where(unb => unb.NotebookID == nb.ID && unb.OwnerID == unb.UserID).ToListAsync();
                    var userNotebook = new UserNotebook();
                    userNotebook.Notebook = nb;
                    userNotebook.NotebookID = nb.ID;
                    userNotebook.User = u;
                    userNotebook.UserID = u.ID;
                    userNotebook.OwnerID = unb[0].OwnerID;
                    Context.UserNotebook.Add(userNotebook);
                }
            }

            Context.UserGroup.Add(ug);
            await Context.SaveChangesAsync();
            
            return Ok();
        }

        //Provereno -> radi
        [Route("DeclineInvite/{userID}/{groupID}")]
        [HttpGet]
        public async Task<IActionResult> DeclineInvite(int userID, int groupID)
        {
            var g = await Context.Groups.FindAsync(groupID);
            var u = await Context.Users.FindAsync(userID);

            if(g == null || u == null)
                return BadRequest();

            //samo se brise iz poslatih zahteva ne treba nista drugo
            List<int> invites = g.SentInvites?.Split(';').Select(Int32.Parse).ToList(); //? je da proveri da nije null
            invites.Remove(userID);
            g.SentInvites = string.Join(";", invites);

            await Context.SaveChangesAsync();
            
            return Ok();
        }

        [Route("AddCardSetGrade/{cardSetID}/{grade}")] //update se svodi na isto tako da ne pisemo dve funkcije
        [HttpGet]
        public async Task<IActionResult> AddCardSetGrade(int cardSetID, int grade)
        {
            if (grade < 0)
                return StatusCode(406); //grade u minus is a nono

            var cs = await Context.CardSets.FindAsync(cardSetID);
            
            if (cs == null)
                return BadRequest();

            cs.Grade = grade;
            
            await Context.SaveChangesAsync();
            return Ok();
        }

        [Route("DeleteCardSetGrade/{cardSetID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteCardSetGrade(int cardSetID)
        {
            var cs = await Context.CardSets.FindAsync(cardSetID);
            
            if (cs == null)
                return BadRequest();
            
            cs.Grade = -1; //ili 0 

            await Context.SaveChangesAsync();
            return Ok();
        } 

        [Route("AddNotebookGrade/{notebookID}/{grade}")] //update se svodi na isto tako da ne pisemo dve funkcije
        [HttpGet]
        public async Task<IActionResult> AddNotebookGrade(int notebookID, int grade)
        {
            if (grade < 0)
                return StatusCode(406); //grade u minus is a nono

            var nb = await Context.Notebooks.FindAsync(notebookID);

            if (nb == null)
                return BadRequest();

            nb.Grade = grade;

            await Context.SaveChangesAsync();
            return Ok();
        }

        [Route("DeleteNotebookGrade/{notebookID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteNotebookGrade(int notebookID)
        {
            var nb = await Context.Notebooks.FindAsync(notebookID);

            if (nb == null)
                return BadRequest();

            nb.Grade = -1;

            await Context.SaveChangesAsync();
            return Ok();
        }

        #endregion

        #region CardSet
        
        [Route("GetAllCardSets")]
        [HttpGet]
        public async Task<List<CardSet>> GetAllCardSet()
        {
            return await Context.CardSets.ToListAsync();
        }

        //Provereno -> radi
        //Fetch -> radi
        [Route("GetPublicCardSets")]
        [HttpGet]
        public async Task<List<CardSet>> GetPublicCardSets()
        {
            return await Context.CardSets.Where(cardS => cardS.Visibility == 1).ToListAsync();
        }

        //Proverno -> radi
        //Fetch -> radi
        [Route("GetCardSets/{userID}")]
        [HttpGet]
        public async Task<List<UserCardSet>> GetCardSets(int userID)
        {
            return await Context.UserCardSet.Where(userCardSet => userCardSet.OwnerID == userID && userCardSet.UserID == userID).Select(userCardSet => new UserCardSet { CardSet = userCardSet.CardSet, OwnerID = userCardSet.OwnerID}).ToListAsync();
        }

        [Route("GetGroupCardSets/{groupID}")]
        [HttpGet]
        public async Task<List<CardSet>> GetGroupCardSets(int groupID)
        {
            return await Context.CardSets.Where(cs => cs.GroupID == groupID).ToListAsync();
        }

        [Route("GetUsersGroupCardSets/{groupID}/{userID}")]
        [HttpGet]
        public async Task<List<UserCardSet>> GetUsersGroupCardSets(int groupID, int userID)
        {
            return await Context.UserCardSet.Where(ucs => ucs.OwnerID == userID && ucs.CardSet.GroupID == groupID && ucs.UserID == userID).Select(userCardSet => new UserCardSet { CardSet = userCardSet.CardSet, OwnerID = userCardSet.OwnerID}).ToListAsync();
        }
        
        //Provereno -> radi
        //Fetch -> radi
        [Route("CreateCardSet/{userID}")]
        [HttpPost]
        public async Task<IActionResult> CreateCardSet(int userID, [FromBody] CardSet cardSet)
        {
            User user = await Context.Users.FindAsync(userID);
            UserCardSet userCardSet = new UserCardSet();
            userCardSet.UserID = userID;
            userCardSet.User = user;
            userCardSet.OwnerID = userID;
            userCardSet.CardSet = cardSet;

            Context.CardSets.Add(cardSet);
            await Context.SaveChangesAsync();
            
            var cs = await Context.CardSets.FindAsync(cardSet.ID);
            userCardSet.CardSetID = cs.ID;
            Context.UserCardSet.Add(userCardSet);

            await Context.SaveChangesAsync();
            return Ok(cs.ID);
        }

        [Route("CreateCardSetInGroup/{userID}")]
        [HttpPost]
        public async Task<IActionResult> CreateCardSetInGroup(int userID, [FromBody] CardSet cardSet)
        {
            //userID je onaj koji kreira cardSet odnosno ako on bude removed mora da se izbrise i sav njegov materijal
            User user = await Context.Users.FindAsync(userID);
            if(user == null)
                return BadRequest();

            UserCardSet userCardSet = new UserCardSet();
            userCardSet.UserID = userID;
            userCardSet.User = user;
            userCardSet.OwnerID = userID;
            userCardSet.CardSet = cardSet;

            Context.CardSets.Add(cardSet);
            await Context.SaveChangesAsync();
           
            var cs = await Context.CardSets.FindAsync(cardSet.ID);
            userCardSet.CardSetID = cs.ID;
            Context.UserCardSet.Add(userCardSet);
            
            var g = await Context.Groups.FindAsync(cardSet.GroupID);
            if(g == null)
                return BadRequest();

            //za svakog usera koji je u grupi treba dodati entry u n:m tabeli
            //id grupe ce biti poslat kroz objekat cardSet
            var userGroup = await Context.UserGroup.Where(ug => ug.GroupID == cardSet.GroupID).Include(ug => ug.User).ToListAsync();

            foreach (var ug in userGroup)
            {
                if (ug.UserID == userID)
                    continue;

                userCardSet = new UserCardSet();
                userCardSet.CardSet = cardSet;
                userCardSet.CardSetID = cs.ID;
                userCardSet.User = ug.User;
                userCardSet.UserID = ug.UserID;
                userCardSet.OwnerID =  userID;
                Context.UserCardSet.Add(userCardSet);
            }

            await Context.SaveChangesAsync();
            return Ok(cs.ID);
        }

        //PROVERITI
        //fetch - napisan
        [Route("UpdateCardSet")]
        [HttpPut]
        public async Task<IActionResult> UpdateCardSet([FromBody] CardSet cardSet)
        {
            var cs = await Context.CardSets.FindAsync(cardSet.ID);

            cs.Title = cardSet.Title;
            cs.Tags = cardSet.Tags;
            cs.Category = cardSet.Category;
            cs.Visibility = cardSet.Visibility;
            cs.Color = cardSet.Color;

            Context.Update<CardSet>(cs);
            await Context.SaveChangesAsync();
            return Ok();
        }

        //PROVERITI
        //fetch - napisan
        [Route("DeleteCardSet/{cardSetID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteCardSet(int cardSetID)
        {
            var cs = await Context.CardSets.FindAsync(cardSetID);
            if(cs == null)
                return BadRequest();

            //brisanje svih kartica koje postoje u spilu
            var cards = Context.Cards.Where(c => c.CardSet == cs);
            Context.Cards.RemoveRange(cards);

            //brisanje spila
            Context.Remove(cs);

            await Context.SaveChangesAsync();
            return Ok();
        }

        [Route("GetCardCount/{cardSetID}")]
        [HttpGet]
        public async Task<IActionResult> GetCardCount(int cardSetID)
        {
            var cs = await Context.CardSets.Include(set => set.Cards).Where(cs => cs.ID == cardSetID).FirstAsync();

            return Ok(cs.Cards.Count);
        }
        #endregion

        #region Card
        //fetch - napisan
        //Provereno -> radi
        [Route("GetCards/{cardSetID}")]
        [HttpGet]
        public async Task<List<Card>> GetCards(int cardSetID)
        {
            var cardSet = await Context.CardSets.FindAsync(cardSetID);

            return await Context.Cards.Where(card => card.CardSet == cardSet).ToListAsync();
        }

        //fetch - napisan
        //Provereno -> radi
        [Route("CreateCard/{cardSetID}")]
        [HttpPost]
        public async Task<IActionResult> CreateCard(int cardSetID, [FromBody] Card card)
        {
            var cardSet = await Context.CardSets.FindAsync(cardSetID);
            card.CardSet = cardSet;

            //ako treba neka provera za greske    

            Context.Cards.Add(card);
            await Context.SaveChangesAsync();
            return Ok(card.ID);
        }
        
        //fetch - napisan
        //Provereno -> radi
        [Route("UpdateCard")]
        [HttpPut]
        public async Task<IActionResult> UpdateCard([FromBody] Card card)
        {
            var cardToUpdate = await Context.Cards.FindAsync(card.ID);

            if(cardToUpdate == null)
                return BadRequest(); //proveriti da li da se vraca 406 ili bad request

            cardToUpdate.QuestionSide = card.QuestionSide;
            cardToUpdate.AnswerSide = card.AnswerSide;

            Context.Update<Card>(cardToUpdate);
            await Context.SaveChangesAsync();
            return Ok();
        }
        
        //fetch - napisan
        //Provereno -> radi
        [Route("DeleteCard/{cardID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteCard(int cardID)
        {
            var cardToDelete = await Context.Cards.FindAsync(cardID);
            
            if(cardToDelete == null)
                return BadRequest(); //proveriti da li da se vraca 406 ili bad request

            Context.Remove(cardToDelete);
            await Context.SaveChangesAsync();
            return Ok();
        }

        #endregion

        #region Notebook

        [Route("GetAllNotebooks")]
        [HttpGet]
        public async Task<List<Notebook>> GetAllNotebooks()
        {
            return await Context.Notebooks.ToListAsync();
        }
        //Provereno -> radi
        [Route("GetPublicNotebooks")]
        [HttpGet]
        public async Task<List<Notebook>> GetPublicNotebook()
        {
            return await Context.Notebooks.Where(notebook => notebook.Visibility == 1).ToListAsync();
        }

        //fetch - napisan
        //Provereno -> radi
        [Route("GetNotebooks/{userID}")]
        [HttpGet]
        public async Task<List<UserNotebook>> GetNotebooks(int userID)
        {
            return await Context.UserNotebook.Where(userNotebook => userNotebook.OwnerID == userID && userNotebook.UserID == userID).Select(userNotebook => new UserNotebook {Notebook = userNotebook.Notebook, OwnerID = userNotebook.OwnerID}).ToListAsync();
        }

        [Route("GetGroupNotebooks/{groupID}")]
        [HttpGet]
        public async Task<List<Notebook>> GetGroupNotebooks(int groupID)
        {
            return await Context.Notebooks.Where(nb => nb.GroupID == groupID).ToListAsync();
        }

        [Route("GetUsersGroupNotebooks/{groupID}/{userID}")]
        [HttpGet]
        public async Task<List<UserNotebook>> GetUsersGroupNotebook(int groupID, int userID)
        {
            return await Context.UserNotebook.Where(un => un.OwnerID == userID && un.Notebook.GroupID == groupID && un.UserID == userID).Select(userNotebook => new UserNotebook {Notebook = userNotebook.Notebook, OwnerID = userNotebook.OwnerID}).ToListAsync();
        }

        //fetch - napisan
        //Proveriti -> radi
        [Route("CreateNotebook/{userID}")]
        [HttpPost]
        public async Task<IActionResult> CreateNotebook(int userID, [FromBody] Notebook notebook)
        {
            User user = await Context.Users.FindAsync(userID);
            UserNotebook userNotebook = new UserNotebook();
            userNotebook.UserID = userID;
            userNotebook.User = user;
            userNotebook.OwnerID = userID;
            userNotebook.Notebook = notebook;

            Context.Notebooks.Add(notebook);
            await Context.SaveChangesAsync();
            
            var nb = await Context.Notebooks.FindAsync(notebook.ID);
            userNotebook.NotebookID = nb.ID;
            Context.UserNotebook.Add(userNotebook);

            await Context.SaveChangesAsync();
            return Ok(nb.ID);
        }

        [Route("CreateNotebookInGroup/{userID}")]
        [HttpPost]
        public async Task<IActionResult> CreateNotebookInGroup(int userID, [FromBody] Notebook notebook)
        {
            User user = await Context.Users.FindAsync(userID);
            if(user == null)
                return BadRequest();

            UserNotebook userNotebook = new UserNotebook();
            userNotebook.UserID = userID;
            userNotebook.User = user;
            userNotebook.OwnerID = userID;
            userNotebook.Notebook = notebook;

            Context.Notebooks.Add(notebook);
            await Context.SaveChangesAsync();
            
            var nb = await Context.Notebooks.FindAsync(notebook.ID);
            userNotebook.NotebookID = nb.ID;
            Context.UserNotebook.Add(userNotebook);

            var g = await Context.Groups.FindAsync(notebook.GroupID);
            if (g == null)
                return BadRequest();

            var userGroup = await Context.UserGroup.Where(ug => ug.GroupID == notebook.GroupID).Include(ug => ug.User).ToListAsync();
            foreach (var ug in userGroup)
            {
                if (ug.UserID == userID)
                    continue;
                    
                userNotebook = new UserNotebook();
                userNotebook.Notebook = notebook;
                userNotebook.NotebookID = nb.ID;
                userNotebook.User = ug.User;
                userNotebook.UserID = ug.UserID;
                userNotebook.OwnerID =  userID;
                Context.UserNotebook.Add(userNotebook);
            }

            await Context.SaveChangesAsync();
            return Ok(nb.ID);
        }

        //fetch - napisan
        //Proveriti -> radi
        [Route("UpdateNotebook")]
        [HttpPut]
        public async Task<IActionResult> UpdateNotebook([FromBody] Notebook notebook)
        {
            var nb = await Context.Notebooks.FindAsync(notebook.ID);

            if(nb == null) //ne bi trebalo da se desi
                return BadRequest();

            nb.Title = notebook.Title;
            nb.Tags = notebook.Tags; //proveriti da li moze ovako
            nb.Category = notebook.Category;
            nb.Visibility = notebook.Visibility;

            Context.Update<Notebook>(nb);
            await Context.SaveChangesAsync();
            return Ok();
        }

        //fetch - napisan
        //Proveriti -> radi
        [Route("DeleteNotebook/{notebookID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteNotebook(int notebookID)
        {
            var nb = await Context.Notebooks.FindAsync(notebookID);

            if (nb == null)
                return BadRequest();
            
            //brisanje svih beleski iz beleznice
            var notes = Context.Notes.Where(n => n.Notebook == nb);
            Context.Notes.RemoveRange(notes);

            //brisanje beleznice
            Context.Remove(nb);

            await Context.SaveChangesAsync();
            return Ok();
        }

        #endregion

        #region Note
        //fetch-napisan
        //Provereno -> radi
        [Route("GetNotes/{notebookID}")]
        [HttpGet]
        public async Task<List<Note>> GetNotes(int notebookID)
        {
            var notebook = await Context.Notebooks.FindAsync(notebookID);

            return await Context.Notes.Where(note => note.Notebook == notebook).ToListAsync();
        }

        //fetch-napisan
        //Provereno -> radi
        [Route("CreateNote/{notebookID}")]
        [HttpPost]
        public async Task<IActionResult> CreateNote(int notebookID, [FromBody] Note note)
        {
            var nb = await Context.Notebooks.FindAsync(notebookID);
            note.Notebook = nb;

            Context.Notes.Add(note);

            await Context.SaveChangesAsync();
            return Ok(note.ID);
        }

        //fetch-napisan
        //Provereno -> radi
        [Route("UpdateNote")]
        [HttpPut]
        public async Task<IActionResult> UpdateNote([FromBody] Note note)
        {
            var n = await Context.Notes.FindAsync(note.ID);
            
            if (n == null) //ne bi trebalo da se desi
                return BadRequest();
            
            n.Title = note.Title;
            n.Text = note.Text;

            Context.Update<Note>(n);
            await Context.SaveChangesAsync();
            return Ok();
        }

        //fetch-napisan
        //Provereno -> radi
        [Route("DeleteNote/{noteID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteNote(int noteID)
        {
            var n = await Context.Notes.FindAsync(noteID);

            if (n == null)
                return BadRequest();

            Context.Remove(n);

            await Context.SaveChangesAsync();
            return Ok();
        }
        
        #endregion

        #region MotivationalMessage
        //Provereno -> radi
        [Route("GetMotivationalMessages")]
        [HttpGet]
        public async Task<List<MotivationMessage>> GetMotivationalMessages()
        {
            return await Context.MotivationMessages.ToListAsync();
        }

        //Provereno -> radi
        [Route("CreateMotivationalMessage")]
        [HttpPost]
        public async Task<IActionResult> CreateMotivationalMessage([FromBody] MotivationMessage motivMsg)
        {
            Context.MotivationMessages.Add(motivMsg);

            await Context.SaveChangesAsync();
            return Ok(motivMsg.ID);
        }

        //Provereno -> radi
        [Route("UpdateMotivationalMessage")]
        [HttpPut]
        public async Task<IActionResult> UpdateMotivationalMessage([FromBody] MotivationMessage motivMsg)
        {
            var mm = await Context.MotivationMessages.FindAsync(motivMsg.ID);

            if (mm == null)
                return BadRequest();

            mm.Name = motivMsg.Name;
            mm.Message = motivMsg.Message;

            Context.Update<MotivationMessage>(mm);
            await Context.SaveChangesAsync();
            return Ok();
        }

        //Provereno -> radi
        [Route("DeleteMotivationalMessage/{motivMsgID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteMotivationalMessage(int motivMsgID)
        {
            var mm = await Context.MotivationMessages.FindAsync(motivMsgID);
            
            if (mm == null)
                return BadRequest();
            
            Context.Remove(mm);

            await Context.SaveChangesAsync();
            return Ok();
        }

        #endregion

        #region StudyPlan

        [Route("GetAllStudyPlans")]
        [HttpGet]
        public async Task<List<StudyPlan>> GetAllStudyPlans()
        {
            return await Context.StudyPlans.ToListAsync();
        }
        //Provereno -> radi
        [Route("GetStudyPlan/{userID}")]
        [HttpGet]
        public async Task<List<StudyPlan>> GetStudyPlans(int userID)
        {
            return await Context.StudyPlans.Where(sp => sp.User.ID == userID).ToListAsync();
        }

        //Provereno -> radi
        [Route("CreateStudyPlan/{userID}")]
        [HttpPost]
        public async Task<IActionResult> CreateStudyPlan(int userID, [FromBody] StudyPlan studyPlan)
        {
            var user = await Context.Users.FindAsync(userID);
            studyPlan.User = user;

            Context.StudyPlans.Add(studyPlan);

            await Context.SaveChangesAsync();
            return Ok(studyPlan.ID);
        }

        //Provereno -> radi
        [Route("UpdateStudyPlan")]
        [HttpPut]
        public async Task<IActionResult> UpdateStudyPlan([FromBody] StudyPlan studyPlan)
        {
            var sp = await Context.StudyPlans.FindAsync(studyPlan.ID);

            if (sp == null)
                return BadRequest();

            //ubaciti proveru za vremena;
            sp.Name = studyPlan.Name;
            sp.WorkTime = studyPlan.WorkTime;
            sp.BreakTime = studyPlan.BreakTime;

            Context.Update<StudyPlan>(sp);
            await Context.SaveChangesAsync();
            return Ok();
        }

        //Provereno -> radi
        [Route("DeleteStudyPlan/{studyPlanID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteStudyPlan(int studyPlanID)
        {
            var sp = await Context.StudyPlans.FindAsync(studyPlanID); 

            if (sp == null)
                return BadRequest();
            
            Context.Remove(sp);

            await Context.SaveChangesAsync();
            return Ok();
        }

        #endregion

        #region Event

        [Route("GetAllEvents")]
        [HttpGet]
        public async Task<List<Event>> GetAllEvents()
        {
            return await Context.Events.ToListAsync();
        } 
        //provereno -> radi
        [Route("GetEvents/{userID}")]
        [HttpGet]
        public async Task<List<Event>> GetEvents(int userID)
        {  
            return await Context.Events.Where(e => e.User.ID == userID).ToListAsync();
        }

        //TimeSpan ne radi
        [Route("CreateEvent/{userID}")]
        [HttpPost]
        public async Task<IActionResult> CreateEvent(int userID, [FromBody] Event e)
        {
            var user = await Context.Users.FindAsync(userID);
            e.User = user;

            Context.Events.Add(e);

            await Context.SaveChangesAsync();
            return Ok(e.ID);
        }

        //Provereno -> radi
        [Route("UpdateEvent")]
        [HttpPut]
        public async Task<IActionResult> UpdateEvent([FromBody] Event e)
        {
            var ev = await Context.Events.FindAsync(e.ID);

            if (ev == null)
                return BadRequest();

            ev.Title = e.Title;
            ev.From = e.From;
            ev.To = e.To;
            ev.Color = e.Color;
            
            Context.Update<Event>(ev);
            await Context.SaveChangesAsync();
            return Ok();
        }

        //Provereno -> radi
        [Route("DeleteEvent/{eventID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteEvent(int eventID)
        {
            var e = await Context.Events.FindAsync(eventID);

            if (e == null)
                return BadRequest();

            Context.Remove(e);

            await Context.SaveChangesAsync();
            return Ok();
        }
        
        #endregion
        
    }
}
