using System.ComponentModel.DataAnnotations.Schema;

namespace MusicApp.Models
{
    public class Author
    {
        public int ID { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? ImageLink { get; set; }
    }

    public class Genre
    {
        public int ID { get; set; }
        public string? Name { get; set; }
    }

    public class Label
    {
        public int ID { get; set; }
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? ImageLink { get; set; }
    }

    public class Music
    {
        public int ID { get; set; }
        public string? Name { get; set; }
        public string? AlbumName { get; set; }
        public string? ImageLink { get; set; }
        public string? MusicLink { get; set; }
        public int Year { get; set; }
        public int LabelId { get; set; }
    }

    public class AuthorMusic
    {
        public int AuthorId { get; set; }
        public int MusicId { get; set; }

        public Author Author { get; set; }
        public Music Music { get; set; }
    }

    public class GenreMusic
    {
        public int GenreId { get; set; }
        public int MusicId { get; set; }

        public Genre Genre { get; set; } 
        public Music Music { get; set; }
    }

    public class SongGet
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string LabelName { get; set; }
        public string AlbumName { get; set; }
        public List<string> Genres { get; set; }
        public List<string> Authors { get; set; }
    }
}
