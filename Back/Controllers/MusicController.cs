using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Threading.Tasks;
using MusicApp.Models;
using Microsoft.EntityFrameworkCore;

namespace MusicApp.Controllers
{
    public class MusicController : Controller
    {
        private readonly MusicContext db;
        private readonly UserContext fav;

        public MusicController(MusicContext musicContext, UserContext userContext)
        {
            db = musicContext;
            fav = userContext;
        }


        [HttpGet("music/getSongFile/{id}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetSongFile(int id)
        {
            var songLink = await db.Musics.Where(gm => gm.ID == id).Select(gm => gm.MusicLink).FirstOrDefaultAsync();
            string? filePath = Path.Combine(songLink);
            
            if (string.IsNullOrEmpty(songLink))
                { return NotFound($"File with songID {id} not found.");  }
            if (!System.IO.File.Exists(filePath))
                { return NotFound($"File with songID {id} not found."); }

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            var mimeType = "audio/mpeg";
            return File(fileBytes, mimeType, songLink);
        }

        [HttpGet("music/getSongImage/{id}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetSongImage(int id)
        {
            var imageLink = await db.Musics.Where(gm => gm.ID == id).Select(gm => gm.ImageLink).FirstOrDefaultAsync();
            string? filePath = Path.Combine(imageLink);
            if (string.IsNullOrEmpty(imageLink))
            {
                return NotFound($"File with songID {id} not found.");
            }
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound($"File with songID {id} not found.");
            }
            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            var mimeType = "image/jpg";
            return File(fileBytes, mimeType, imageLink);
        }

        [HttpGet("music/getMusics")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetMusics()
        {
            var musics = await db.Musics.Select(m => new { m.ID, m.Name }).ToListAsync();
            return Ok(musics);
        }
        [HttpGet("music/getGenres")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetGenres()
        {
            var genres = await db.Genres.Select(g => new { g.ID, g.Name }).ToListAsync();
            return Ok(genres);
        }
        [HttpGet("music/getAuthors")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAuthors()
        {
            var authors = await db.Authors.Select(a => new { a.ID, a.Name }).ToListAsync();
            return Ok(authors);
        }
        [HttpGet("music/getLabels")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetLabels()
        {
            var labels = await db.Labels.Select(l => new { l.ID, l.Name }).ToListAsync();
            return Ok(labels);
        }

        [HttpGet("music/getSongs/{userEmail}/{playlistName}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetSongWithDetails(string userEmail, string playlistName)
        {
            Console.WriteLine(userEmail); Console.WriteLine(userEmail);Console.WriteLine(userEmail);Console.WriteLine(userEmail);Console.WriteLine(userEmail);Console.WriteLine(userEmail);
            List<SongGet> songs;
            if(string.IsNullOrEmpty(playlistName)) return NotFound($"Empty playlist.");

            if (playlistName == "Favourite")
            {
                var userId = await fav.Users.Where(u => u.Email == userEmail).Select(u => u.Id).FirstOrDefaultAsync();
                if (userId == 0) { return NotFound("User not found"); }

                var favouriteMusicIds = await fav.Favourites.Where(f => f.UserId == userId).Select(f => f.MusicId).ToListAsync();

                songs = await db.Musics.Where(m => favouriteMusicIds.Contains(m.ID)).Select(m => new SongGet
                {
                    ID = m.ID,
                    Name = m.Name,
                    AlbumName = m.AlbumName,
                    LabelName = db.Labels.Where(l => l.ID == m.LabelId).Select(l => l.Name).FirstOrDefault(),
                    Genres = db.GenreMusics.Where(gm => gm.MusicId == m.ID).Select(gm => gm.Genre.Name).ToList(),
                    Authors = db.AuthorMusics.Where(am => am.MusicId == m.ID).Select(am => am.Author.Name).ToList()
                })
                .OrderBy(m => m.AlbumName == "Сингл")
                .ThenBy(m => m.AlbumName)
                .ToListAsync();
            }
            else 
            {
                var genre = await db.Genres.Where(l => l.Name == playlistName).Select(l => l.ID).FirstOrDefaultAsync();
                if (genre == 0) { return NotFound("Genre not found"); }

                var genresMusics = await db.GenreMusics.Where(l => l.GenreId == genre).Select(l => l.MusicId).ToListAsync();
                songs = await db.Musics.Where(m => genresMusics.Contains(m.ID)).Select(m => new SongGet
                {
                    ID = m.ID,
                    Name = m.Name,
                    AlbumName = m.AlbumName,
                    LabelName = db.Labels.Where(l => l.ID == m.LabelId).Select(l => l.Name).FirstOrDefault(),
                    Genres = db.GenreMusics.Where(gm => gm.MusicId == m.ID).Select(gm => gm.Genre.Name).ToList(),
                    Authors = db.AuthorMusics.Where(am => am.MusicId == m.ID).Select(am => am.Author.Name).ToList()
                })
                .OrderBy(m => m.AlbumName == "Сингл")
                .ThenBy(m => m.AlbumName)
                .ToListAsync();
            }
            // else {
            //     songs = await db.Musics
            //     .Select(m => new SongGet
            //     {
            //         ID = m.ID,
            //         Name = m.Name,
            //         LabelName = db.Labels.Where(l => l.ID == m.LabelId).Select(l => l.Name).FirstOrDefault(),
            //         Genres = db.GenreMusics.Where(gm => gm.MusicId == m.ID).Select(gm => gm.Genre.Name).ToList(),
            //         Authors = db.AuthorMusics.Where(am => am.MusicId == m.ID).Select(am => am.Author.Name).ToList()
            //     })
            //     .ToListAsync();
            // }
            
            if (songs == null || !songs.Any()) { return NotFound($"Songs not found."); }
            return Ok(songs);
        }

        [HttpPost("music/UploadSong")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadSong([FromForm] string name, [FromForm] string albumName, [FromForm] IFormFile imageLink, [FromForm] IFormFile musicLink, [FromForm] int year, [FromForm] int label)
        {
            if (imageLink == null || imageLink.Length == 0)
                return BadRequest("Image file is missing.");

            if (musicLink == null || musicLink.Length == 0)
                return BadRequest("Music file is missing.");

            var existingSong = await db.Musics.Where(s => s.Name == name && s.AlbumName == albumName && s.Year == year && s.LabelId == label).FirstOrDefaultAsync();

            if (existingSong != null) { return BadRequest("A song already exists"); }

            var imagePath = Path.Combine("Images/Song", imageLink.FileName);
            using (var stream = new FileStream(imagePath, FileMode.Create))
                {  await imageLink.CopyToAsync(stream); }

            var musicPath = Path.Combine("Songs", musicLink.FileName);
            using (var stream = new FileStream(musicPath, FileMode.Create))
                { await musicLink.CopyToAsync(stream); }

            var song = new Music
            {
                Name = name,
                AlbumName = albumName,
                ImageLink = imagePath,
                MusicLink = musicPath,
                Year = year,
                LabelId = label
            };

            db.Musics.Add(song);
            await db.SaveChangesAsync();

            return Ok(new { message = "Song created successfully" });
        }


        [HttpPost("music/UploadLabel")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadLabel([FromForm] string name, [FromForm] string address, [FromForm] IFormFile image)
        {
            if (image == null || image.Length == 0) return BadRequest("Image file is missing.");

            var existingLabel = await db.Labels.Where(l => l.Name == name && l.Address == address).FirstOrDefaultAsync();
            if (existingLabel != null) { return BadRequest("A label already exists"); }

            var filePath = Path.Combine("Images/Label", image.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
                { await image.CopyToAsync(stream); }

            var label = new Label
            {
                Name = name,
                Address = address,
                ImageLink = filePath
            };

            db.Labels.Add(label);
            await db.SaveChangesAsync();

            return Ok(new { message = "Label created successfully" });
        }

        [HttpPost("music/UploadAuthor")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadAuthor([FromForm] string name, [FromForm] string description, [FromForm] IFormFile image)
        {
            if (image == null || image.Length == 0)
                return BadRequest("Image file is missing.");

            var existingAuthor = await db.Authors.Where(l => l.Name == name && l.Description == description).FirstOrDefaultAsync();
            if (existingAuthor != null) { return BadRequest("A author already exists"); }

            var filePath = Path.Combine("Images/Autor", image.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            var autor = new Author
            {
                Name = name,
                Description = description,
                ImageLink = filePath
            };

            db.Authors.Add(autor);
            await db.SaveChangesAsync();

            return Ok(new { message = "Author created successfully" });
        }

        [HttpPost("music/UploadGenre")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadGenre([FromForm] string name)
        {
            var existingGenre = await db.Genres.Where(l => l.Name == name).FirstOrDefaultAsync();
            if (existingGenre != null) { return BadRequest("A genre already exists"); }

            var genre = new Genre
            {
                Name = name
            };

            db.Genres.Add(genre);
            await db.SaveChangesAsync();

            return Ok(new { message = "Genre created successfully" });
        }

        [HttpPost("music/UploadSongAuthor")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadAuthorMusic([FromForm] int authorId, [FromForm] int musicId)
        {
            var author = await db.Authors.FindAsync(authorId);
            if (author == null)  { return NotFound($"Author with ID {authorId} not found."); }

            var music = await db.Musics.FindAsync(musicId);
            if (music == null) { return NotFound($"Music with ID {musicId} not found."); }

            var existingMA = await db.AuthorMusics.Where(l => l.AuthorId == authorId && l.MusicId == musicId).FirstOrDefaultAsync();
            if (existingMA != null) { return BadRequest("A MA already exists"); }

            var authorMusic = new AuthorMusic
            {
                AuthorId = authorId,
                MusicId = musicId
            };

            db.AuthorMusics.Add(authorMusic);
            await db.SaveChangesAsync();

            return Ok(new { message = "AuthorMusics created successfully" });
        }

        [HttpPost("music/UploadSongGenre")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadSongGenre([FromForm] int genreId, [FromForm] int musicId)
        {
            var genre = await db.Genres.FindAsync(genreId);
            if (genre == null) { return NotFound($"Genre with ID {genreId} not found."); }

            var music = await db.Musics.FindAsync(musicId);
            if (music == null) {  return NotFound($"Music with ID {musicId} not found."); }

            var existingGA = await db.GenreMusics.Where(l => l.GenreId == genreId && l.MusicId == musicId).FirstOrDefaultAsync();
            if (existingGA != null) { return BadRequest("A GA already exists"); }

            var genreMusic = new GenreMusic
            {
                GenreId = genreId,
                MusicId = musicId
            };

            db.GenreMusics.Add(genreMusic);
            await db.SaveChangesAsync();

            return Ok(new { message = "GenreMusics created successfully" });
        }
    }
}
