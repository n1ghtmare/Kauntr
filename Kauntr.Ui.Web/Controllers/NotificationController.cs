using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Ui.Web.Controllers {

    // TODO - Enable after debug
//    [Authorize]
    public class NotificationController : Controller {
        private readonly INotificationRepository _notificationRepository;
        private readonly IContextService _contextService;

        public NotificationController(INotificationRepository notificationRepository, IContextService contextService) {
            _notificationRepository = notificationRepository;
            _contextService = contextService;
        }

        [HttpGet]
        public async Task<ActionResult> Index(NotificationListViewModel model) {
            Task<int> count = _notificationRepository.GetTotalCountAsync((int) _contextService.CurrentUserAccountId);
            Task<IEnumerable<NotificationAggregate>> aggregates = _notificationRepository.GetAggregatesAsync((int) _contextService.CurrentUserAccountId);

            await Task.WhenAll(count, aggregates);

            var result = new NotificationListViewModel {
                Total = await count,
                Notifications = await aggregates,
                Page = model.Page,
                Token = model.Token
            };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}