using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;

namespace Kauntr.Ui.Web.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        public ActionResult Index() {
            // TODO - design the auth ...
            return null;
        }
    }
}