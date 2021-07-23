using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WEBAPI.Models
{
    [Table("User")]
    public class User
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("Username")]
        public string Username { get; set; }

        [Column("Password")]
        public string Password { get; set; }

        [Column("Salt")]
        public string Salt { get; set; }

        [Column("Tag")]
        public string Tag { get; set; } //can start with 0

        [Column("FirstName")]
        public string FirstName { get; set; }

        [Column("LastName")]
        public string LastName { get; set; }

        [Column("Avatar")]
        public string Avatar { get; set; } //path

        [Column("CardSets")]
        public virtual List<UserCardSet> CardSets { get; set; }

        [Column("Notebooks")]
        public virtual List<UserNotebook> Notebooks { get; set; }

        [Column("Groups")]
        public virtual List<UserGroup> Groups { get; set; }

        [Column("StudyPlans")]
        public virtual List<StudyPlan> StudyPlans { get; set; }

        [Column("Events")]
        public virtual List<Event> Events { get; set; }

        [Column("isAdmin")]
        public bool IsAdmin { get; set; }
    }
}