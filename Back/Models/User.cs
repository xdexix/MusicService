using System.ComponentModel.DataAnnotations.Schema;

namespace MusicApp.Models
{
    public class User
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? Id { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public int? Role { get; set; }
        public string? Phone { get; set; }
        public string? FullName { get; set; }
        public string? Address { get; set; }
    }

    public class Favourite
    {
        public int? UserId { get; set; }
        public int? MusicId { get; set; }

        public User User { get; set; } 
    }
}
