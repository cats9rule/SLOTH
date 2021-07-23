using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WEBAPI.Models
{
    [Table("Event")]
    public class Event
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("Title")]
        public string Title { get; set; }

        [Column("Color")]
        public string Color { get; set; }

        [Column("From")]
        [DataType("date")]
        public System.DateTime From { get; set; }

        [Column("To")]
        [DataType("date")]
        public System.DateTime To { get; set; }

        [JsonIgnore]
        public User User { get; set; }
    }
}