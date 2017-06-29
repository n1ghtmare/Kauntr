using System.Threading.Tasks;
using System.Web.Mvc;

using Kauntr.Ui.Web.Models;

namespace Kauntr.Ui.Web.Controllers {
    public class SharedContextController : Controller {
        public async Task<ActionResult> Index(int token) {
            // simulate work
            await Task.Delay(3000);

            var model = new SharedContextViewModel {
                CurrentUserId = 123,
                NotificationsCount = 10000,
                Token = token
            };
            return Json(model, JsonRequestBehavior.AllowGet);
        }
    }
}