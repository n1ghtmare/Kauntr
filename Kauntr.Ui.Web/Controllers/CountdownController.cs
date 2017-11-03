using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Helpers;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Ui.Web.Controllers {
    public class CountdownController : Controller {
        private const int CountdownLimit = 10;

        private readonly ICountdownRepository _countdownRepository;
        private readonly IVoteRepository _voteRepository;
        private readonly IContextService _contextService;
        private readonly ISystemClock _systemClock;
        private readonly INotificationService _notificationService;

        public CountdownController(ICountdownRepository countdownRepository, IVoteRepository voteRepository, IContextService contextService, ISystemClock systemClock, INotificationService notificationService) {
            _countdownRepository = countdownRepository;
            _voteRepository = voteRepository;
            _contextService = contextService;
            _systemClock = systemClock;
            _notificationService = notificationService;
        }

//        [Authorize] // TODO - Uncomment after Debug
        [HttpPost]
        public async Task<ActionResult> Create(CountdownCreateViewModel model) {
            if (ModelState.IsValid) {
                DateTime endsOnDate = CreateEndsOnDate(model);

                if (endsOnDate < _systemClock.UtcNow.AddMinutes(4)) {
                    return new HttpStatusCodeResult(400, "Bad Request");
                }

                var countdown = new Countdown {
                    Description = model.Description,
                    CreatedOn = _systemClock.UtcNow,
                    CreatedByAccountId = (int) _contextService.CurrentUserAccountId,
                    EndsOn =  endsOnDate
                };
                await _countdownRepository.CreateAsync(countdown);
                _notificationService.UpdateClientsAfterCreate(countdown);

                return Json(new {countdown.Id});
            }
            return new HttpStatusCodeResult(400, "Bad Request");
        }

        private DateTime CreateEndsOnDate(CountdownCreateViewModel model) {
            switch (model.SelectedCountdownType) {
                case CountdownCreateViewModel.CountdownType.Duration:
                    return CreateDateFromDuration(model);
                case CountdownCreateViewModel.CountdownType.Date:
                    return new DateTime(model.EndsOnYear, model.EndsOnMonth, model.EndsOnDay, model.EndsOnHour ?? 0, model.EndsOnMinute ?? 0, 0);
                default:
                    throw new Exception("Can't generate EndsOnDate");
            }
        }

        private DateTime CreateDateFromDuration(CountdownCreateViewModel model) {
            switch (model.SelectedDurationType) {
                case CountdownCreateViewModel.DurationType.Seconds:
                    return _systemClock.UtcNow.AddSeconds(model.Duration);
                case CountdownCreateViewModel.DurationType.Minutes:
                    return _systemClock.UtcNow.AddMinutes(model.Duration);
                case CountdownCreateViewModel.DurationType.Hours:
                    return _systemClock.UtcNow.AddHours(model.Duration);
                case CountdownCreateViewModel.DurationType.Days:
                    return _systemClock.UtcNow.AddDays(model.Duration);
                case CountdownCreateViewModel.DurationType.Months:
                    return _systemClock.UtcNow.AddMonths(model.Duration);
                case CountdownCreateViewModel.DurationType.Years:
                    return _systemClock.UtcNow.AddYears(model.Duration);
                default:
                    throw new ArgumentException("Invalid duration");
            }
        }

        [HttpGet]
        public async Task<ActionResult> Details(long countdownId) {
            CountdownAggregate countdown = await _countdownRepository.GetAggregateAsync(countdownId, _contextService.CurrentUserAccountId);
            if (countdown == null) {
                return new HttpStatusCodeResult(404, "Not Found");
            }

            CountdownViewModel model = countdown.ToCountdownViewModel();
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public async Task<ActionResult> Index(CountdownListViewModel model) {
            CountdownSubFilter subFilter = CreateCountdownSubFilter(model.Filter);

            Task<int> count = _countdownRepository.GetTotalCountAsync(subFilter);
            Task<IEnumerable<CountdownAggregate>> aggregates = _countdownRepository.GetAggregatesAsync(new CountdownFilter {
                Page = model.Page,
                Limit = CountdownLimit,
                CurrentUserAccountId = _contextService.CurrentUserAccountId,
                DisplayOrderType = model.DisplayOrderType,
                SubFilter = subFilter
            });

            await Task.WhenAll(count, aggregates);

            var result = new CountdownListViewModel {
                Total = await count,
                Countdowns = (await aggregates).ToCountdownViewModels(),
                Page = model.Page,
                DisplayOrderType = model.DisplayOrderType,
                Filter = model.Filter,
                Token = model.Token
            };
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        private CountdownSubFilter CreateCountdownSubFilter(CountdownListFilter filter) {
            return new CountdownSubFilter {
                Query = filter.Query,
                CreatedByUserAccountId = filter.IsCreatedByCurrentUser ? _contextService.CurrentUserAccountId : null,
                EndsAfter = filter.IsCurrentlyActive ? (DateTime?) _systemClock.UtcNow : null
            };
        }

        //        [Authorize] // TODO - Uncomment after Debug
        [HttpPost]
        public async Task<ActionResult> Vote(CountdownVoteViewModel model) {
//            await Task.Delay(2000);
            Countdown countdown = await _countdownRepository.GetAsync(model.CountdownId);

            if (ModelState.IsValid && countdown.CreatedByAccountId != _contextService.CurrentUserAccountId) {
                Vote existingVote = await _voteRepository.GetByCountdownIdAsync(model.CountdownId, (int) _contextService.CurrentUserAccountId);
                if (existingVote != null) {
                    await _voteRepository.DeleteAsync(existingVote.Id);
                    if (existingVote.Value == model.Value) {
                        return await NotifyClientsAndGenerateVoteResultAsync(model.CountdownId, (int) _contextService.CurrentUserAccountId);
                    }
                }

                var vote = new Vote {
                    CountdownId = model.CountdownId,
                    Value = model.Value,
                    CastedByAccountId = (int) _contextService.CurrentUserAccountId,
                    CastedOn = _systemClock.UtcNow
                };
                await _voteRepository.CreateAsync(vote);
                return await NotifyClientsAndGenerateVoteResultAsync(model.CountdownId, (int)_contextService.CurrentUserAccountId);
            }
            return new HttpStatusCodeResult(400, "Bad Request");
        }

        private async Task<JsonResult> NotifyClientsAndGenerateVoteResultAsync(long countdownId, int currentUserAccountId) {
            CountdownAggregate countdownAggregate = await _countdownRepository.GetAggregateAsync(countdownId, currentUserAccountId);

            await _notificationService.ClearCountdownVoteNotificationsAsync(countdownId, countdownAggregate.CreatedByAccountId, currentUserAccountId);

            if (countdownAggregate.CurrentUserVote != 0) {
                var notificationChange = new NotificationChange {
                    CreatedByAccountId = currentUserAccountId,
                    CreatedOn = _systemClock.UtcNow,
                    NotificationActionType = countdownAggregate.CurrentUserVote > 0 ? NotificationActionType.Upvoted : NotificationActionType.Downvoted
                };
                await _notificationService.NotifyCountdownOwnerAsync(countdownId, notificationChange);
            }

            _notificationService.UpdateClientsAfterVote(countdownAggregate);

            var model = new CountdownVoteViewModel {
                CountdownId = countdownId,
                VoteScore = countdownAggregate.VoteScore,
                CurrentUserVote = countdownAggregate.CurrentUserVote
            };
            return Json(model, JsonRequestBehavior.AllowGet);
        }
    }
}