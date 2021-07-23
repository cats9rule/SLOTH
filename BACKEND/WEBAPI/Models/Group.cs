using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WEBAPI.Models
{
    [Table("Group")]
    public class Group
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("TeacherID")]
        public int TeacherID { get; set; }

        [Column("Name")]
        public string Name { get; set; }

        [Column("SentInvites")]
        public string SentInvites { get; set; }

        [Column("Users")]
        public virtual List<UserGroup> Users { get; set; }
    }
}