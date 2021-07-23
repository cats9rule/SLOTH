using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace WEBAPI.Models
{
    [Table("MotivationMessage")]
    public class MotivationMessage
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("Name")]
        public string Name { get; set; }

        [Column("Message")]
        public string Message { get; set; }
    }
}