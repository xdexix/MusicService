using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Threading.Tasks;
using MusicApp.Models;
using Microsoft.EntityFrameworkCore;

namespace MusicApp.Controllers
{
    public class FavouriteController : Controller
    {
        private readonly MusicContext db;
        private readonly UserContext fav;

        public FavouriteController(MusicContext musicContext, UserContext userContext)
        {
            db = musicContext;
            fav = userContext;
        }

        [HttpPost("/Favourites")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> UploadFavourites([FromForm] int songId, [FromForm] string userEmail)
        {
            var user = await fav.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) { return NotFound($"User with userEmail {userEmail} not found."); }

            var music = await db.Musics.FirstOrDefaultAsync(u => u.ID == songId);
            if (music == null) {  return NotFound($"Music with ID {songId} not found."); }

            var existingGA = await fav.Favourites.Where(l => l.MusicId == songId && l.UserId == user.Id).FirstOrDefaultAsync();
            if (existingGA != null) { return BadRequest("A GA already exists"); }

            var favouriteMusic = new Favourite
            {
                UserId = user.Id,
                MusicId = music.ID
            };

            fav.Favourites.Add(favouriteMusic);
            await fav.SaveChangesAsync();

            return Ok(new { message = "Favourite created successfully" });
        }

        [HttpDelete("/Favourites")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> DeleteFavourite([FromForm] int songId, [FromForm] string userEmail)
        {
            var user = await fav.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) { return NotFound($"User with userEmail {userEmail} not found."); }

            var music = await db.Musics.FirstOrDefaultAsync(u => u.ID == songId);
            if (music == null) { return NotFound($"Music with ID {songId} not found."); }

            var favourite = await fav.Favourites.Where(f => f.MusicId == songId && f.UserId == user.Id).FirstOrDefaultAsync();
            if (favourite == null)
            {
                return NotFound("The specified favourite entry does not exist.");
            }

            fav.Favourites.Remove(favourite);
            await fav.SaveChangesAsync();

            return Ok(new { message = "Favourite removed successfully" });
        }

        [HttpGet("/Favourites/check/{songId}/{userEmail}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> CheckFavorites(int songId, string userEmail)
        {
            try
            {
                var user = await fav.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
                if (user == null) { return NotFound($"User with email {userEmail} not found."); }

                var isFavorite = await fav.Favourites.AnyAsync(f => f.MusicId == songId && f.UserId == user.Id);
                
                return Ok(new { isFavorite });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error checking favorites: {ex.Message}");
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }
    }
}
