using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MusicApp.Models;
using Microsoft.AspNetCore.Authorization;

namespace MusicApp.Controllers
{
    public class AccountController : Controller
    {
        private MusicContext music;
        private UserContext db;
        public AccountController(UserContext context, MusicContext mus)
        {
            music = mus;
            db = context;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("account/login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (model.Email == "" || model.Password == "") return BadRequest(new { message = "Enter all places" }); 
            User? user = await db.Users.FirstOrDefaultAsync(u => (u.Email == model.Email) && (u.Password == model.Password));
            if (user != null)
            {
                await Authenticate(user.Email, user.Role);
                Console.WriteLine("Auth: " + user.Email);
                return Ok(new { 
                    message = user.Role, 
                    email = user.Email,
                    phone = user.Phone,
                    fullName = user.FullName,
                    address = user.Address});
            }
            else return BadRequest(new { message = "Incorrect login or password" });
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("account/register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (model.Email != "" && 
                model.Password != "" && 
                model.ConfirmPassword != "" && 
                model.Phone != "" && 
                model.FullName != "" && 
                model.Address != "")
            {
                if (model.Password == model.ConfirmPassword)
                {
                    User? user = await db.Users.FirstOrDefaultAsync(u => (u.Email == model.Email));
                    if (user == null)
                    {
                        db.Users.Add(new User { Email = model.Email, Password = model.Password, Role = 1, Phone = model.Phone, FullName = model.FullName, Address = model.Address}); ;
                        await db.SaveChangesAsync();
                        return Ok(new { message = "Register successful" });
                    }
                    else return Conflict(new { message = "User already registered" });
                }
                else return BadRequest(new { message = "The passord are not same" });
            }
            else return BadRequest(new { message = "Enter all places" });
        }

        private async Task Authenticate(string userName, int? role)
        {
            string roleName = role == 0 ? "Admin" : "User"; 

            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, userName),
                new Claim(ClaimsIdentity.DefaultRoleClaimType, roleName)
            };
            ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(id));
        }

        [Authorize]
        [Route("account/logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            foreach (var cookie in Request.Cookies.Keys)
            {
                Response.Cookies.Delete(cookie);
            }
            return Ok(new { message = "User Logout" });
        }
    }
}
