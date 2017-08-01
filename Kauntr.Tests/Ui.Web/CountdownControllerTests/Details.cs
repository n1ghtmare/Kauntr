using System;
using System.Threading.Tasks;
using System.Web.Mvc;

using NUnit.Framework;

using Kauntr.Core.Entities;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Tests.Ui.Web.CountdownControllerTests {
    [TestFixture]
    public class Details {
        [Test]
        public async Task GetWithCountdownId_ReturnsCountdownAggregate() {
            TestableCountdownController controller = TestableCountdownController.Create();
            const long countdownId = 1;
            var countdownAggregate = new CountdownAggregate {
                Id = countdownId,
                CreatedOn = DateTime.UtcNow,
                Description = "test description",
                EndsOn = DateTime.UtcNow.AddYears(1),
                CreatedByAccountId = 1,
                CommentsCount = 37,
                CreatedByDisplayName = "testo",
                CurrentUserVote = -1,
                VoteScore = 71
            };
            controller.CountdownRepository.CountdownAggregates.Add(countdownAggregate);

            JsonResult result = await controller.Details(countdownId) as JsonResult;

            Assert.IsNotNull(result);

            CountdownViewModel countdownViewModel = result.Data as CountdownViewModel;
            Assert.IsNotNull(countdownViewModel);
            Assert.AreEqual(countdownAggregate.Id, countdownViewModel.Id);
            Assert.AreEqual(countdownAggregate.CreatedOn, countdownViewModel.CreatedOn);
            Assert.AreEqual(countdownAggregate.Description, countdownViewModel.Description);
            Assert.AreEqual(countdownAggregate.EndsOn, countdownViewModel.EndsOn);
            Assert.AreEqual(countdownAggregate.CreatedByAccountId, countdownViewModel.CreatedByAccountId);
            Assert.AreEqual(countdownAggregate.CommentsCount, countdownViewModel.CommentsCount);
            Assert.AreEqual(countdownAggregate.CreatedByDisplayName, countdownViewModel.CreatedByDisplayName);
            Assert.AreEqual(countdownAggregate.CurrentUserVote, countdownViewModel.CurrentUserVote);
            Assert.AreEqual(countdownAggregate.VoteScore, countdownViewModel.VoteScore);
            Assert.IsNotNull(countdownViewModel.CreatedByGravatarUrl);
        }

        [Test]
        public async Task GetWithCountdownIdThatDoesntExist_ReturnsHttpStatusCode404NotFound() {
            TestableCountdownController controller = TestableCountdownController.Create();

            HttpStatusCodeResult result = await controller.Details(1) as HttpStatusCodeResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(404, result.StatusCode);
            Assert.AreEqual("Not Found", result.StatusDescription);
        }
    }
}