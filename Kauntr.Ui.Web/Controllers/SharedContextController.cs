using System.Threading.Tasks;
using System.Web.Mvc;

using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Ui.Web.Controllers {
    public class SharedContextController : Controller {
        private readonly IContextService _contextService;
        private readonly INotificationRepository _notificationRepository;

        public SharedContextController(IContextService contextService, INotificationRepository notificationRepository) {
            _contextService = contextService;
            _notificationRepository = notificationRepository;
        }

        public async Task<JsonResult> Index(int token) {
            // simulate work
//            await Task.Delay(3000);
            SharedContextViewModel model = await GenerateSharedContextViewModelAsync(token);
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        private async Task<SharedContextViewModel> GenerateSharedContextViewModelAsync(int token) {
            if (_contextService.CurrentUserAccountId != null) {
                return new SharedContextViewModel {
                    Token = token,
                    CurrentUserAccountId = _contextService.CurrentUserAccountId,
                    NotificationsCount = await _notificationRepository.GetTotalCountAsync((int) _contextService.CurrentUserAccountId)
                };
            }
            return new SharedContextViewModel {
                Token = token
            };
        }
    }
}