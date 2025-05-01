using IdentityService.Entities;
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
        private readonly string _jwtSecret;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly int _accessTokenExpiryHours;
        private readonly int _refreshTokenExpiryDays;

        public JwtService(string jwtSecret, string issuer, string audience, int accessTokenExpiryHours = 2, int refreshTokenExpiryDays = 7)
        {
            _jwtSecret = jwtSecret;
            _issuer = issuer;
            _audience = audience;
            _accessTokenExpiryHours = accessTokenExpiryHours;
            _refreshTokenExpiryDays = refreshTokenExpiryDays;
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

            return GenerateToken(claims, TimeSpan.FromHours(_accessTokenExpiryHours));
        }

        public string GenerateRefreshToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim("token_type", "refresh_token")
            };

            return GenerateToken(claims, TimeSpan.FromDays(_refreshTokenExpiryDays));
        }

        private string GenerateToken(IEnumerable<Claim> claims, TimeSpan expiration)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            
            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: DateTime.UtcNow.Add(expiration),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public bool ValidateToken(string token, bool isRefreshToken = false)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret));

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = true,
                    ValidIssuer = _issuer,
                    ValidateAudience = true,
                    ValidAudience = _audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var tokenType = jwtToken.Claims.First(x => x.Type == "token_type").Value;

                return isRefreshToken ? tokenType == "refresh_token" : tokenType == "access_token";
            }
            catch
            {
                return false;
            }
        }
    }
}
