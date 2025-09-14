using Microsoft.EntityFrameworkCore;
using Server.Models;
using System.Text.Json;

namespace Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Game> Games { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Genre> Genres { get; set; }

        public DbSet<HighScores> HighScores { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<HighScores>()
                .HasOne(h => h.Game)
                .WithMany(g => g.HighScores)
                .HasForeignKey(h => h.GameId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Game>()
                .HasMany(g => g.Genres)
                .WithMany(g => g.Games)
                .UsingEntity(j => j.ToTable("GameGenres"));

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username).IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email).IsUnique();

            modelBuilder.Entity<Game>()
                .HasOne(g => g.Publisher)
                .WithMany(u => u.PublishedGames)
                .HasForeignKey(g => g.PublisherId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
