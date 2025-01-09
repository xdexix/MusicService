using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MusicApp.Models
{
    public class UserContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Favourite> Favourites { get; set; }
        
        public UserContext(DbContextOptions<UserContext> options)
            : base(options) { }
        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite("Data Source=/root/VPD/MusicService/Back/Data/users.db");

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Favourite>()
                .HasKey(f => new { f.UserId, f.MusicId }); 
        }

    }
}
