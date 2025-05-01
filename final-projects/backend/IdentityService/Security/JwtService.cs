using IdentityService.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace IdentityService.Security
{
    public class JwtService
    {
        private readonly IConfiguration _configuration;
        private readonly TokenValidationParameters _tokenValidationParameters;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
            
            _tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = _configuration.GetValue<bool>("Jwt:ValidateIssuerSigningKey"),
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)),
                ValidateIssuer = _configuration.GetValue<bool>("Jwt:ValidateIssuer"),
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidateAudience = _configuration.GetValue<bool>("Jwt:ValidateAudience"),
                ValidAudience = _configuration["Jwt:Audience"],
                ValidateLifetime = _configuration.GetValue<bool>("Jwt:ValidateLifetime"),
                ClockSkew = TimeSpan.Parse(_configuration["Jwt:ClockSkew"]!)
            };
        }

        public string GenerateAccessToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("token_type", "access_token")
            };
            
            foreach (var role in user.UserRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role.Role.RoleName));
            }

            return GenerateToken(claims, TimeSpan.FromHours(_configuration.GetValue<int>("Jwt:AccessTokenExpireHours")));
        }

        public string GenerateRefreshToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim("token_type", "refresh_token")
            };

            return GenerateToken(claims, TimeSpan.FromDays(_configuration.GetValue<int>("Jwt:RefreshTokenExpireDays")));
        }

        private string GenerateToken(IEnumerable<Claim> claims, TimeSpan expiration)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.Add(expiration),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public bool ValidateToken(string token, bool isRefreshToken = false)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                tokenHandler.ValidateToken(token, _tokenValidationParameters, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var tokenType = jwtToken.Claims.First(x => x.Type == "token_type").Value;

                return isRefreshToken ? tokenType == "refresh_token" : tokenType == "access_token";
            }
            catch
            {
                return false;
            }
        }

        public ClaimsPrincipal? GetPrincipalFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                var principal = tokenHandler.ValidateToken(token, _tokenValidationParameters, out SecurityToken validatedToken);
                if (validatedToken is JwtSecurityToken jwtToken)
                {
                    var hasValidSecurityAlgorithm = jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase);
                    if (!hasValidSecurityAlgorithm)
                        return null;
                }
                return principal;
            }
            catch
            {
                return null;
            }
        }
    }
}
