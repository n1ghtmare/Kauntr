using System.Web;

using Kauntr.Core.Interfaces;

namespace Kauntr.Ui.Web.Services {
    public class ContextService : IContextService {
        public bool CurrentUserIsAuthenticated => HttpContext.Current.User.Identity.IsAuthenticated;
    }
}