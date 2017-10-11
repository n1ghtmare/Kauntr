using System.Threading.Tasks;
using System.Web.Mvc;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Ui.Web.Controllers {
    public class VoteController : Controller {
        private readonly IVoteRepository _voteRepository;
        private readonly IContextService _contextService;
        private readonly ISystemClock _systemClock;

        public VoteController(IVoteRepository voteRepository, IContextService contextService, ISystemClock systemClock) {
            _voteRepository = voteRepository;
            _contextService = contextService;
            _systemClock = systemClock;
        }

        //        [Authorize] // TODO - Uncomment after Debug
        [HttpPost]
        public async Task<ActionResult> Comment(CommentVoteViewModel model) {
            if (ModelState.IsValid) {
                Vote existingVote = await _voteRepository.GetByCommentIdAsync(model.CommentId, (int)_contextService.CurrentUserAccountId);
                if (existingVote != null) {
                    await _voteRepository.DeleteAsync(existingVote.Id);
                    if (existingVote.Value == model.Value) {
                        return Json(new CommentVoteViewModel { CommentId = model.CommentId, Value = 0 }, JsonRequestBehavior.AllowGet);
                    }
                }

                var vote = new Vote {
                    CommentId = model.CommentId,
                    Value = model.Value,
                    CastedByAccountId = (int) _contextService.CurrentUserAccountId,
                    CastedOn = _systemClock.UtcNow
                };
                await _voteRepository.CreateAsync(vote);
                return Json(new CommentVoteViewModel {CommentId = model.CommentId, Value = vote.Value}, JsonRequestBehavior.AllowGet);
            }
            return new HttpStatusCodeResult(400, "Bad Request");
        }
    }
}