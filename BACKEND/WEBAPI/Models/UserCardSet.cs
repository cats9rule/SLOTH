using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WEBAPI.Models
{
    [Table("UserCardSet")]
    public class UserCardSet
    {
        [Column("UserID")]
        public int UserID { get; set; }

        [Column("User")]
        public User User { get; set; }

        [Column("CardSetID")]
        public int CardSetID { get; set; }

        [Column("CardSet")]
        public CardSet CardSet { get; set; }

        [Column("OwnerID")]
        public int OwnerID { get; set; }
    }
}