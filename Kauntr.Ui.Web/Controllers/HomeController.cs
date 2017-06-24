using System.Web.Mvc;

namespace Kauntr.Ui.Web.Controllers {
    public class HomeController : Controller {
        public ActionResult Index() {
            return View();
        }
    }
}