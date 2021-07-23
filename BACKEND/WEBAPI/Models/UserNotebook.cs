using System.ComponentModel.DataAnnotations.Schema;

namespace WEBAPI.Models
{
    [Table("UserNotebook")]
    public class UserNotebook
    {
        [Column("UserID")]
        public int UserID { get; set; }

        [Column("User")]
        public User User { get; set; }

        [Column("NotebookID")]
        public int NotebookID { get; set; }

        [Column("Notebook")]
        public Notebook Notebook { get; set; }

        [Column("OwnerID")]
        public int OwnerID { get; set; }
    }
}