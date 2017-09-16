using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Helpers;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Ui.Web.Controllers {
    public class CommentController : Controller {
        private readonly ICommentRepository _commentRepository;
        private readonly IContextService _contextService;

        public CommentController(ICommentRepository commentRepository, IContextService contextService) {
            _commentRepository = commentRepository;
            _contextService = contextService;
        }

        public async Task<ActionResult> Index(CommentListViewModel model) {
            Task<int> count = _commentRepository.GetTotalAsync(model.CountdownId);
            Task<IEnumerable<CommentAggregate>> results = _commentRepository.GetAggregatesAsync(model.CountdownId, _contextService.CurrentUserAccountId);

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
    }
}