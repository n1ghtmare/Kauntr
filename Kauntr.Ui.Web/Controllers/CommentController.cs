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
        private readonly IVoteRepository _voteRepository;
        private readonly IContextService _contextService;
        private readonly ISystemClock _systemClock;

        public CommentController(ICommentRepository commentRepository, IVoteRepository voteRepository, IContextService contextService, ISystemClock systemClock) {
            _commentRepository = commentRepository;
            _voteRepository = voteRepository;
            _contextService = contextService;
            _systemClock = systemClock;
        }

        public async Task<ActionResult> Index(CommentListViewModel model) {
//            await Task.Delay(3000);

            Task<int> count = _commentRepository.GetTotalCountAsync(model.CountdownId);
            Task<IEnumerable<CommentAggregate>> aggregates = _commentRepository.GetAggregatesAsync(new CommentFilter {
                CountdownId = model.CountdownId,
                Page = model.Page,
                Limit = CommentLimit,
                CurrentUserAccountId = _contextService.CurrentUserAccountId,
                DisplayOrderType = model.DisplayOrderType
            });

            await Task.WhenAll(count, aggregates);

            var result = new CommentListViewModel {
                Total = await count,
                Comments = (await aggregates).ToCommentViewModels(),
                Page = model.Page,
                CountdownId = model.CountdownId,
                DisplayOrderType = model.DisplayOrderType,
                Token = model.Token
            };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

//        [Authorize] // TODO - Uncomment after Debug
        [HttpPost]
        public async Task<ActionResult> Create(CommentCreateViewModel model) {
//            await Task.Delay(3000);
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

        //        [Authorize] // TODO - Uncomment after Debug
        [HttpPost]
        public async Task<ActionResult> Vote(CommentVoteViewModel model) {
            Comment comment = await _commentRepository.GetAsync(model.CommentId);

            if (ModelState.IsValid && comment.CreatedByAccountId != _contextService.CurrentUserAccountId) {
                Vote existingVote = await _voteRepository.GetByCommentIdAsync(model.CommentId, (int) _contextService.CurrentUserAccountId);
                if (existingVote != null) {
                    await _voteRepository.DeleteAsync(existingVote.Id);
                    if (existingVote.Value == model.Value) {
                        return Json(new CommentVoteViewModel {CommentId = model.CommentId, Value = 0, ExistingValue = existingVote.Value}, JsonRequestBehavior.AllowGet);
                    }
                }

                var vote = new Vote {
                    CommentId = model.CommentId,
                    Value = model.Value,
                    CastedByAccountId = (int) _contextService.CurrentUserAccountId,
                    CastedOn = _systemClock.UtcNow
                };
                await _voteRepository.CreateAsync(vote);
                return Json(new CommentVoteViewModel {CommentId = model.CommentId, Value = model.Value, ExistingValue = existingVote?.Value}, JsonRequestBehavior.AllowGet);
            }
            return new HttpStatusCodeResult(400, "Bad Request");
        }
    }
}