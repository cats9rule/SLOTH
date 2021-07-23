using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WEBAPI.Models
{
    [Table("StudyPlan")]
    public class StudyPlan
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("Name")]
        public string Name { get; set; }

        [Column("WorkTime")]
        public int WorkTime { get; set; }

        [Column("BreakTime")]
        public int BreakTime { get; set; }

        [JsonIgnore]
        public User User { get; set; }
    }
}