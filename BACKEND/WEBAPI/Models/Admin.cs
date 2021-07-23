using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace WEBAPI.Models
{
    [Table("Admin")]
    public class Admin
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        /* Shows error?
        [ForeignKey]
        [Column("UserID")]
        public int UserID { get; set; }*/
    }
}