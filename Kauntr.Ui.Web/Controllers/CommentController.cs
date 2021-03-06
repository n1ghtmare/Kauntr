﻿using System.Collections.Generic;
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
        private readonly INotificationService _notificationService;

        public CommentController(ICommentRepository commentRepository, IVoteRepository voteRepository, IContextService contextService, ISystemClock systemClock, INotificationService notificationService) {
            _commentRepository = commentRepository;
            _voteRepository = voteRepository;
            _contextService = contextService;
            _systemClock = systemClock;
            _notificationService = notificationService;
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

                _notificationService.UpdateClientsAfterCreate(comment);

                var notificationChange = new NotificationChange {
                    CreatedByAccountId = (int) _contextService.CurrentUserAccountId,
                    CreatedOn = _systemClock.UtcNow,
                    NotificationActionType = NotificationActionType.Commented
                };
                await _notificationService.NotifyCountdownOwnerAsync(comment.CountdownId, notificationChange);

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
                        return await NotifyClientsAndGenerateVoteResultAsync(model.CommentId, (int) _contextService.CurrentUserAccountId);
                    }
                }

                var vote = new Vote {
                    CommentId = model.CommentId,
                    Value = model.Value,
                    CastedByAccountId = (int) _contextService.CurrentUserAccountId,
                    CastedOn = _systemClock.UtcNow
                };
                await _voteRepository.CreateAsync(vote);
                return await NotifyClientsAndGenerateVoteResultAsync(model.CommentId, (int)_contextService.CurrentUserAccountId);
            }
            return new HttpStatusCodeResult(400, "Bad Request");
        }

        private async Task<JsonResult> NotifyClientsAndGenerateVoteResultAsync(long commentId, int currentUserAccountId) {
            CommentAggregate commentAggregate = await _commentRepository.GetAggregateAsync(commentId, currentUserAccountId);

            await _notificationService.ClearCommentVoteNotificationsAsync(commentId, commentAggregate.CreatedByAccountId, currentUserAccountId);

            if (commentAggregate.CurrentUserVote != 0) {
                var notificationChange = new NotificationChange {
                    CreatedByAccountId = currentUserAccountId,
                    CreatedOn = _systemClock.UtcNow,
                    NotificationActionType = commentAggregate.CurrentUserVote > 0 ? NotificationActionType.Upvoted : NotificationActionType.Downvoted
                };
                await _notificationService.NotifyCommentOwnerAsync(commentId, notificationChange);
            }

            _notificationService.UpdateClientsAfterVote(commentAggregate);

            var model = new CommentVoteViewModel {
                CommentId = commentId,
                VoteScore = commentAggregate.VoteScore,
                CurrentUserVote = commentAggregate.CurrentUserVote
            };
            return Json(model, JsonRequestBehavior.AllowGet);
        }
    }
}