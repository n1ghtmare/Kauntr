using System;
using System.Threading.Tasks;
using System.Web.Mvc;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Ui.Web.Controllers {
    public class CountdownController : Controller {
        private readonly ICountdownRepository _countdownRepository;
        private readonly IContextService _contextService;
        private readonly ISystemClock _systemClock;

        public CountdownController(ICountdownRepository countdownRepository, IContextService contextService, ISystemClock systemClock) {
            _countdownRepository = countdownRepository;
            _contextService = contextService;
            _systemClock = systemClock;
        }

//        [Authorize] // TODO - Uncomment after Debug
        [HttpPost]
        public async Task<ActionResult> Create(CountdownViewModel model) {
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
                return Json(new {countdown.Id});
            }
            return new HttpStatusCodeResult(400, "Bad Request");
        }

        private DateTime CreateEndsOnDate(CountdownViewModel model) {
            switch (model.SelectedCountdownType) {
                case CountdownViewModel.CountdownType.Duration:
                    return CreateDateFromDuration(model);
                case CountdownViewModel.CountdownType.Date:
                    return new DateTime(model.EndsOnYear, model.EndsOnMonth, model.EndsOnDay, model.EndsOnHour ?? 0, model.EndsOnMinute ?? 0, 0);
                default:
                    throw new Exception("Can't generate EndsOnDate");
            }
        }

        private DateTime CreateDateFromDuration(CountdownViewModel model) {
            switch (model.SelectedDurationType) {
                case CountdownViewModel.DurationType.Seconds:
                    return _systemClock.UtcNow.AddSeconds(model.Duration);
                case CountdownViewModel.DurationType.Minutes:
                    return _systemClock.UtcNow.AddMinutes(model.Duration);
                case CountdownViewModel.DurationType.Hours:
                    return _systemClock.UtcNow.AddHours(model.Duration);
                case CountdownViewModel.DurationType.Days:
                    return _systemClock.UtcNow.AddDays(model.Duration);
                case CountdownViewModel.DurationType.Months:
                    return _systemClock.UtcNow.AddMonths(model.Duration);
                case CountdownViewModel.DurationType.Years:
                    return _systemClock.UtcNow.AddYears(model.Duration);
                default:
                    throw new ArgumentException("Invalid duration");
            }
        }
    }
}