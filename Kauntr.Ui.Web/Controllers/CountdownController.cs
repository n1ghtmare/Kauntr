﻿using System;
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
        private readonly IContextService _contextService;
        private readonly ISystemClock _systemClock;

        public CountdownController(ICountdownRepository countdownRepository, IContextService contextService, ISystemClock systemClock) {
            _countdownRepository = countdownRepository;
            _contextService = contextService;
            _systemClock = systemClock;
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
            Task<int> count = _countdownRepository.GetTotalCountAsync();
            Task<IEnumerable<CountdownAggregate>> aggregates = _countdownRepository.GetAggregatesAsync(new CountdownFilter {
                Page = model.Page,
                Limit = CountdownLimit,
                CurrentUserAccountId = _contextService.CurrentUserAccountId,
                DisplayOrderType = model.DisplayOrderType,
                EndsAfter = _systemClock.UtcNow
            });

            await Task.WhenAll(count, aggregates);

            var result = new CountdownListViewModel {
                Total = await count,
                Countdowns = (await aggregates).ToCountdownViewModels(),
                Page = model.Page,
                DisplayOrderType = model.DisplayOrderType,
                Token = model.Token
            };
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}