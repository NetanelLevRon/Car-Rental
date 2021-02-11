using _02_BOL;
using _03_BLL;
using System;
using System.Collections.Generic;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http.Filters;
using System.Web.Http.Results;

namespace _04_UIL.Filters
{
    public class BasicAuthFilter : Attribute, IAuthenticationFilter
    {
        public bool AllowMultiple { get { return false; } }

        public Task AuthenticateAsync(HttpAuthenticationContext context, CancellationToken cancellationToken)
        {
            var authHead = context.Request.Headers.Authorization; // contain the 'user name' and the 'password'
            if (authHead != null)
            {

                UserModel user = UsersManager.SelectLoginUser(authHead.Scheme, authHead.Parameter); // Scheme = user name, Parameter = password 
                // and get the hole user
                if (user != null)
                {
                    var claims = new List<Claim>() { new Claim(ClaimTypes.Name, user.UserName),
                                                     new Claim(ClaimTypes.Role, user.UserRole) };

                    var id = new ClaimsIdentity(claims, "Token");
                    id.AddClaim(new Claim ("userId", user.UserID.ToString() )); // store the current user Id on this new claim. for sending this
                    context.Principal = new ClaimsPrincipal(new[] { id }); // user back (to client end) as loged in user with all that needs for next request authorization. 
                                                                          // the "ToString" becuase of the "AddClaim" required structure.
                }
                else
                {
                    context.ErrorResult = new UnauthorizedResult(new AuthenticationHeaderValue[0], context.Request);
                }
            }

            return Task.FromResult(0);
        }


        public Task ChallengeAsync(HttpAuthenticationChallengeContext context, CancellationToken cancellationToken)
        {
            return Task.FromResult(0);
        }
    }
}