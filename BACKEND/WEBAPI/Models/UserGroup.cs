using System.ComponentModel.DataAnnotations.Schema;

namespace WEBAPI.Models
{
    [Table("UserGroup")]
    public class UserGroup
    {
        [Column("UserID")]
        public int UserID { get; set; }

        [Column("User")]
        public User User { get; set; }

        [Column("GroupID")]
        public int GroupID { get; set; }

        [Column("Group")]
        public Group Group { get; set; }

        [Column("OwnerID")]
        public int OwnerID { get; set; }
    }
}