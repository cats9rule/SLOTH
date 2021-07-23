using Microsoft.EntityFrameworkCore;

namespace WEBAPI.Models
{
    public class SLOTHContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<Notebook> Notebooks { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<CardSet> CardSets { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<StudyPlan> StudyPlans { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<MotivationMessage> MotivationMessages { get; set; }
        public DbSet<UserNotebook> UserNotebook { get; set; }
        public DbSet<UserGroup> UserGroup { get; set; }
        public DbSet<UserCardSet> UserCardSet { get; set; }

        public SLOTHContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserNotebook>().HasKey(x => new { x.UserID, x.NotebookID});
            modelBuilder.Entity<UserGroup>().HasKey(x => new {x.UserID, x.GroupID});
            modelBuilder.Entity<UserCardSet>().HasKey(x => new {x.UserID, x.CardSetID});

            
            modelBuilder.Entity<CardSet>()
                .Property(e=>e.Tags)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', System.StringSplitOptions.RemoveEmptyEntries)
                );

            modelBuilder.Entity<Notebook>()
                .Property(e=>e.Tags)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', System.StringSplitOptions.RemoveEmptyEntries)
                );
            
        }
    }
}