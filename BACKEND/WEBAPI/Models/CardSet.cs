using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WEBAPI.Models
{
    [Table("CardSet")]
    public class CardSet
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("Title")]
        public string Title { get; set; }

        [Column("Color")]
        public string Color { get; set; } //should start with #

        //tagovi odvojeni ','
        //predefinisana metoda OnModelCreating u SLOTHContext-u
        private string tags;

        [NotMapped]
        [Column("Tags")]
        public string[] Tags
        {
            get; set; 
        }

        [Column("Category")]
        public int Category { get; set; } //ENUM

        [Column("Visibility")]
        public int Visibility { get; set; } //ENUM

        [Column("GroupID")]
        public int GroupID { get; set; } //null za sve cardsets koji nisu iz grupe

        [Column("Grade")]
        public int Grade { get; set; } //proveriti da li ce biti int

        public virtual List<Card> Cards { get; set; }
    }
}