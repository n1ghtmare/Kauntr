using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Helpers;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Ui.Web.Controllers {
    public class CommentController : Controller {
        private const int CommentLimit = 10;

        private readonly ICommentRepository _commentRepository;
        private readonly IContextService _contextService;
        private readonly ISystemClock _systemClock;

        public CommentController(ICommentRepository commentRepository, IContextService contextService, ISystemClock systemClock) {
            _commentRepository = commentRepository;
            _contextService = contextService;
            _systemClock = systemClock;
        }

        public async Task<ActionResult> Index(CommentListViewModel model) {
            await Task.Delay(3000);
            Task<int> count = _commentRepository.GetTotalAsync(model.CountdownId);
            Task<IEnumerable<CommentAggregate>> results = _commentRepository.GetAggregatesAsync(model.CountdownId, model.Page, CommentLimit, _contextService.CurrentUserAccountId);

            await Task.WhenAll(count, results);

            var result = new CommentListViewModel {
                Total = await count,
                Comments = (await results).ToCommentViewModels(),
                Page = model.Page,
                CountdownId = model.CountdownId,
                Token = model.Token
            };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

//        [Authorize] // TODO - Uncomment after Debug
        [HttpPost]
        public async Task<ActionResult> Create(CommentCreateViewModel model) {
            await Task.Delay(3000);
            if (ModelState.IsValid) {
                var comment = new Comment {
                    CountdownId = model.CountdownId,
                    Text = model.Text,
                    CreatedOn = _systemClock.UtcNow,
                    CreatedByAccountId = (int) _contextService.CurrentUserAccountId
                };

                await _commentRepository.CreateAsync(comment);
                return new EmptyResult();
            }
            return new HttpStatusCodeResult(400, "Bad Request");
        }
    }
}