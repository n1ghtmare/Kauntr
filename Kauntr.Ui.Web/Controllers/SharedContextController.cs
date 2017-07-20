using System.Threading.Tasks;
using System.Web.Mvc;

using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Ui.Web.Controllers {
    public class SharedContextController : Controller {
        private readonly IContextService _contextService;

        public SharedContextController(IContextService contextService) {
            _contextService = contextService;
        }

        public async Task<ActionResult> Index(int token) {
            // simulate work
//            await Task.Delay(3000);

            // fake code
//            var model = new SharedContextViewModel {
//                Token = token,
//                CurrentUserAccountId = 1
//            };

            var model = new SharedContextViewModel {
                Token = token,
                CurrentUserAccountId = _contextService.CurrentUserAccountId
            };
            return Json(model, JsonRequestBehavior.AllowGet);
        }
    }
}