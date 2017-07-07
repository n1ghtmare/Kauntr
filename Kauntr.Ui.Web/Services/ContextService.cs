using System.Web;
using System.Web.Security;

using Kauntr.Core.Interfaces;

namespace Kauntr.Ui.Web.Services {
    public class ContextService : IContextService {
        public bool CurrentUserIsAuthenticated => HttpContext.Current.User.Identity.IsAuthenticated;

        public void Authenticate(int accountId) {
            FormsAuthentication.SetAuthCookie(accountId.ToString(), true);
        }

        public void Logout() {
            FormsAuthentication.SignOut();
        }
    }
}