using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MusicApp.Models
{
    public class MusicContext : DbContext
    {
        public DbSet<Author> Authors { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Label> Labels { get; set; }
        public DbSet<Music> Musics { get; set; }
        public DbSet<AuthorMusic> AuthorMusics { get; set; }
        public DbSet<GenreMusic> GenreMusics { get; set; }

        public MusicContext(DbContextOptions<MusicContext> options)
            : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite("Data Source=/root/VPD/MusicService/Back/Data/music.db");

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AuthorMusic>()
                .HasKey(am => new { am.AuthorId, am.MusicId });

            modelBuilder.Entity<GenreMusic>()
                .HasKey(gm => new { gm.GenreId, gm.MusicId });
        }
    }
}
