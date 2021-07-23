using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WEBAPI.Models
{
    [Table("Note")]
    public class Note
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("Title")]
        public string Title { get; set; }

        [Column("Text")]
        public string Text { get; set; }

        [JsonIgnore]
        public Notebook Notebook { get; set; }

        /*Same as in Notebook should not be saved in DB?
        [Column("Tag")]
        public List<string> Tag { get; set; } //check for DB

        [Column("Category")]
        public int Category { get; set; } //ENUM

        [Column("Visibility")]
        public int Visibility { get; set; } //ENUM */
    }
}