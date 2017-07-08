using System.Security.Claims;
using System.Web;

using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security;

using Kauntr.Core.Interfaces;

namespace Kauntr.Ui.Web.Services {
    public class ContextService : IContextService {
        private static IOwinContext CurrentOwinContext => HttpContext.Current.Request.GetOwinContext();

        // These have to be mocked on dev-server (auth cookies are not proxied correctly between expressjs and iisexpress)
        public bool CurrentUserIsAuthenticated => HttpContext.Current.User.Identity.IsAuthenticated;

        public int? CurrentUserAccountId => string.IsNullOrEmpty(HttpContext.Current.User.Identity.Name) ? null : (int?) int.Parse(HttpContext.Current.User.Identity.Name);

        public void Authenticate(int accountId) {
            var identity = new ClaimsIdentity(new[] {
                new Claim(ClaimTypes.Name, accountId.ToString())
            },
            DefaultAuthenticationTypes.ApplicationCookie);

            CurrentOwinContext.Authentication.SignIn(new AuthenticationProperties {IsPersistent = true}, identity);
        }

        public void Logout() {
            CurrentOwinContext.Authentication.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
        }
    }
}