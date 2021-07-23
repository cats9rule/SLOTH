using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WEBAPI.Models
{
    [Table ("Card")]
    public class Card 
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("QuestionSide")]
        public string QuestionSide { get; set; }

        [Column("AnswerSide")]
        public string AnswerSide { get; set; }

        [JsonIgnore]
        public CardSet CardSet { get; set; }
    }
}