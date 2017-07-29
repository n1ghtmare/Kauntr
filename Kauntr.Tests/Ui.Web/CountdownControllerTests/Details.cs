using System;
using System.Threading.Tasks;
using System.Web.Mvc;

using NUnit.Framework;

using Kauntr.Core.Entities;

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

            CountdownAggregate countdownAggregateResult = result.Data as CountdownAggregate;
            Assert.IsNotNull(countdownAggregateResult);
            Assert.AreEqual(countdownAggregate.Id, countdownAggregateResult.Id);
            Assert.AreEqual(countdownAggregate.CreatedOn, countdownAggregateResult.CreatedOn);
            Assert.AreEqual(countdownAggregate.Description, countdownAggregateResult.Description);
            Assert.AreEqual(countdownAggregate.EndsOn, countdownAggregateResult.EndsOn);
            Assert.AreEqual(countdownAggregate.CreatedByAccountId, countdownAggregateResult.CreatedByAccountId);
            Assert.AreEqual(countdownAggregate.CommentsCount, countdownAggregateResult.CommentsCount);
            Assert.AreEqual(countdownAggregate.CreatedByDisplayName, countdownAggregateResult.CreatedByDisplayName);
            Assert.AreEqual(countdownAggregate.CurrentUserVote, countdownAggregateResult.CurrentUserVote);
            Assert.AreEqual(countdownAggregate.VoteScore, countdownAggregateResult.VoteScore);
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