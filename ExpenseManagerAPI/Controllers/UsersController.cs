using ExpenseManagerAPI.DataAccess.Models;
using ExpenseManagerAPI.DataAccess.Repositories;
using ExpenseManagerAPI.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ExpenseManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IGenericRepository<User> _userRepository;
        private readonly IConfiguration _configuration;

        public UsersController(IGenericRepository<User> userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        // 1. POST: api/users/register
        [HttpPost("register")]
        public async Task<ActionResult<string>> Register([FromBody] RegisterDto dto)
        {
            var users = await _userRepository.GetAllAsync();
            if (users.Any(u => u.UserName.ToLower() == dto.UserName.ToLower() || u.Email.ToLower() == dto.Email.ToLower()))
            {
                return BadRequest(new { message = "Username or Email address already registered." });
            }

            // CRITICAL SECURITY INTERVIEW STEP: Never store plain text passwords!
            string saltAndHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var newUser = new User
            {
                UserName = dto.UserName,
                Email = dto.Email,
                PasswordHash = saltAndHash,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(newUser);
            await _userRepository.SaveChangesAsync();

            return Ok(new { message = "Registration successful!" });
        }

        // 2. POST: api/users/login
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
        {
            var users = await _userRepository.GetAllAsync();
            var targetUser = users.FirstOrDefault(u => u.UserName.ToLower() == dto.UserName.ToLower());

            // Check if user exists and verify password hash matches securely
            if (targetUser == null || !BCrypt.Net.BCrypt.Verify(dto.Password, targetUser.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid Username or Password credentials." });
            }

            // Generate authentication payload token
            string token = CreateJwtToken(targetUser);

            return Ok(new AuthResponseDto
            {
                UserId = targetUser.Id,
                Username = targetUser.UserName,
                Token = token
            });
        }

        // Helper Method to generate JWT Token signatures
        private string CreateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email)
            };

            // Read the secure encryption text string key from appsettings config file
            var keyStr = _configuration.GetSection("AppSettings:TokenSecretKey").Value;
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr ?? "SuperSecretDefaultFallbackKeyLongerThan32Bytes"));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7), // Token remains valid for 7 days
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}