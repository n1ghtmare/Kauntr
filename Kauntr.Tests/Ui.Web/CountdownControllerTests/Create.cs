﻿using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

using NUnit.Framework;

using Kauntr.Core.Entities;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Tests.Ui.Web.CountdownControllerTests {
    [TestFixture]
    public class Create {
        [Test]
        public async Task PostFromAnAuthenticatedUserWithValidViewModel_ReturnsEmptyResult() {
            TestableCountdownController controller = TestableCountdownController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(1);

            EmptyResult result = await controller.Create(new CountdownViewModel()) as EmptyResult;

            Assert.IsNotNull(result);
        }

        [Test]
        public async Task PostFromAnAuthenticatedUserWithInvalidViewModel_ReturnsHttpStatusCode400BadRequest() {
            TestableCountdownController controller = TestableCountdownController.Create();
            controller.ModelState.AddModelError("LaBomba", "Error Message");

            HttpStatusCodeResult result = await controller.Create(new CountdownViewModel()) as HttpStatusCodeResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
            Assert.AreEqual("Bad Request", result.StatusDescription);
        }

        [TestCase("2017-03-01 19:11:33", CountdownViewModel.DurationType.Minutes, 5, "2017-03-01 19:16:33")]
        [TestCase("2017-03-01 19:11:33", CountdownViewModel.DurationType.Hours, 3, "2017-03-01 22:11:33")]
        [TestCase("2017-03-01 19:11:33", CountdownViewModel.DurationType.Days, 5, "2017-03-06 19:11:33")]
        [TestCase("2017-03-01 19:11:33", CountdownViewModel.DurationType.Months, 2, "2017-05-01 19:11:33")]
        [TestCase("2017-03-01 19:11:33", CountdownViewModel.DurationType.Years, 4, "2021-03-01 19:11:33")]
        public async Task PostFromAnAuthenticatedUserWithValidViewModel_CreatesACountdownFromDurationWithCorrectTime(DateTime systemTime, CountdownViewModel.DurationType durationType, int duration, DateTime expectedEndDate) {
            TestableCountdownController controller = TestableCountdownController.Create();
            const int currentUserAccountId = 7;
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(currentUserAccountId);
            controller.MockSystemClock.Setup(x => x.UtcNow).Returns(systemTime);

            var model = new CountdownViewModel {
                Description = "Test Description",
                SelectedCountdownType = CountdownViewModel.CountdownType.Duration,
                Duration = duration,
                SelectedDurationType = durationType
            };

            ActionResult result = await controller.Create(model);
            Countdown countdown = controller.CountdownRepository.Countdowns.FirstOrDefault();

            Assert.IsNotNull(result);
            Assert.IsNotNull(countdown);
            Assert.AreEqual(model.Description, countdown.Description);
            Assert.AreEqual(systemTime, countdown.CreatedOn);
            Assert.AreEqual(expectedEndDate, countdown.EndsOn);
            Assert.AreEqual(currentUserAccountId, countdown.CreatedByAccountId);
        }

        [Test]
        public async Task PostFromAnAuthenticatedUserWithValidViewModel_CreatesACountdownFromDateSegmentsWithCorrectTime() {
            TestableCountdownController controller = TestableCountdownController.Create();
            const int currentUserAccountId = 7;
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(currentUserAccountId);

            var model = new CountdownViewModel {
                Description = "Test Description",
                SelectedCountdownType = CountdownViewModel.CountdownType.Date,
                EndsOnDay = 7,
                EndsOnMonth = 3,
                EndsOnYear = 2017,
                EndsOnHour = 13,
                EndsOnMinute = 5
            };

            ActionResult result = await controller.Create(model);
            Countdown countdown = controller.CountdownRepository.Countdowns.FirstOrDefault();

            Assert.IsNotNull(result);
            Assert.IsNotNull(countdown);
            Assert.AreEqual(model.Description, countdown.Description);
            Assert.AreEqual(currentUserAccountId, countdown.CreatedByAccountId);
            Assert.AreEqual(new DateTime(model.EndsOnYear, model.EndsOnMonth, model.EndsOnDay, (int) model.EndsOnHour, (int) model.EndsOnMinute, 0), countdown.EndsOn);
        }
    }
}