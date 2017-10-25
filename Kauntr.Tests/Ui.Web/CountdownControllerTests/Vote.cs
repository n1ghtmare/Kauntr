using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

using NUnit.Framework;
using Moq;

using Kauntr.Core.Entities;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Tests.Ui.Web.CountdownControllerTests {
    [TestFixture]
    public class Vote {
        [Test]
        public async Task PostFromAnAuthenticatedUserWithInvalidModel_ReturnsHttpStatusCode400BadRequest() {
            TestableCountdownController controller = TestableCountdownController.Create();
            controller.ModelState.AddModelError("Nope", "Error Message");

            HttpStatusCodeResult result = await controller.Vote(new CountdownVoteViewModel()) as HttpStatusCodeResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
            Assert.AreEqual("Bad Request", result.StatusDescription);
        }

        [Test]
        public async Task PostFromAnAuthenticatedUserWithNoExistingVotes_CreatesVoteAndReturnsResultWithMatchingValue() {
            const int voteValue = 1;
            const int accountId = 7;
            const long countdownId = 3;
            var systemTime = new DateTime(2017, 10, 22, 7, 31, 53);

            TestableCountdownController controller = TestableCountdownController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(accountId);
            controller.MockSystemClock.Setup(x => x.UtcNow).Returns(systemTime);

            controller.CountdownRepository.Countdowns = new List<Countdown> {
                new Countdown {Id = countdownId, CreatedByAccountId = 9}
            };

            controller.CountdownRepository.CountdownAggregates = new List<CountdownAggregate> {
                new CountdownAggregate { Id = countdownId, CreatedByAccountId = 9, VoteScore = 3, CurrentUserVote = voteValue}
            };

            JsonResult result = await controller.Vote(new CountdownVoteViewModel {CountdownId = countdownId, Value = voteValue}) as JsonResult;
            Assert.IsNotNull(result);

            CountdownVoteViewModel model = result.Data as CountdownVoteViewModel;
            Assert.IsNotNull(model);
            Assert.AreEqual(countdownId, model.CountdownId);
            Assert.AreEqual(0, model.Value);
            Assert.AreEqual(3, model.VoteScore);
            Assert.AreEqual(voteValue, model.CurrentUserVote);

            Core.Entities.Vote vote = controller.VoteRepository.Votes.FirstOrDefault();
            Assert.IsNotNull(vote);
            Assert.AreEqual(countdownId, vote.CountdownId);
            Assert.AreEqual(voteValue, vote.Value);
            Assert.AreEqual(accountId, vote.CastedByAccountId);
            Assert.AreEqual(systemTime, vote.CastedOn);
        }

        [Test]
        public async Task PostFromAnAuthenticatedUser_NotifiesConnectedHubClients() {
            const int voteValue = 1;
            const int accountId = 7;
            const long countdownId = 3;
            var systemTime = new DateTime(2017, 10, 22, 7, 31, 53);

            TestableCountdownController controller = TestableCountdownController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(accountId);
            controller.MockSystemClock.Setup(x => x.UtcNow).Returns(systemTime);

            controller.CountdownRepository.Countdowns = new List<Countdown> {
                new Countdown {Id = countdownId, CreatedByAccountId = 9}
            };

            controller.CountdownRepository.CountdownAggregates = new List<CountdownAggregate> {
                new CountdownAggregate {Id = countdownId, CreatedByAccountId = 9, VoteScore = 3, CurrentUserVote = voteValue}
            };

            await controller.Vote(new CountdownVoteViewModel {CountdownId = countdownId, Value = voteValue});

            controller.MockNotificationService
                .Verify(x => x.UpdateClientsAfterVote(It.Is<CountdownAggregate>(c => c.Id == countdownId)),
                    Times.Once());
        }

        [Test]
        public async Task PostFromAnAuthenticatedUserWithAnExistingVoteWithSameValue_DeletesVoteAndReturnsResultWithANeutralValue() {
            const int voteValue = 1;
            const int accountId = 7;
            const long countdownId = 3;

            TestableCountdownController controller = TestableCountdownController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(accountId);

            controller.VoteRepository.Votes.Add(new Core.Entities.Vote {
                CountdownId = countdownId,
                CastedByAccountId = accountId,
                Value = voteValue
            });

            controller.CountdownRepository.Countdowns = new List<Countdown> {
                new Countdown {Id = countdownId, CreatedByAccountId = 9}
            };

            controller.CountdownRepository.CountdownAggregates = new List<CountdownAggregate> {
                new CountdownAggregate { Id = countdownId, CreatedByAccountId = 9, VoteScore = 3, CurrentUserVote = null}
            };

            JsonResult result = await controller.Vote(new CountdownVoteViewModel { CountdownId = countdownId, Value = voteValue}) as JsonResult;
            Assert.IsNotNull(result);

            CountdownVoteViewModel model = result.Data as CountdownVoteViewModel;
            Assert.IsNotNull(model);
            Assert.AreEqual(countdownId, model.CountdownId);
            Assert.AreEqual(0, model.Value);
            Assert.AreEqual(3, model.VoteScore);
            Assert.IsNull(model.CurrentUserVote);
            Assert.IsEmpty(controller.VoteRepository.Votes);
        }

        [Test]
        public async Task PostFromAnAuthenticatedUserWithExistingVoteWithDifferentValue_DeletesVoteAndReturnsResultWithNewValue() {
            const int voteValue = 1;
            const int accountId = 7;
            const long countdownId = 3;
            var systemTime = new DateTime(2017, 10, 22, 7, 31, 53);

            TestableCountdownController controller = TestableCountdownController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(accountId);
            controller.MockSystemClock.Setup(x => x.UtcNow).Returns(systemTime);

            controller.CountdownRepository.Countdowns = new List<Countdown> {
                new Countdown {Id = countdownId, CreatedByAccountId = 9}
            };

            controller.CountdownRepository.CountdownAggregates = new List<CountdownAggregate> {
                new CountdownAggregate { Id = countdownId, CreatedByAccountId = 9, VoteScore = 3, CurrentUserVote = voteValue}
            };

            controller.VoteRepository.Votes.Add(new Core.Entities.Vote {
                CountdownId = countdownId,
                CastedByAccountId = accountId,
                Value = -1,
                CastedOn = new DateTime(2017, 10, 11, 7, 31, 53)
            });

            JsonResult result = await controller.Vote(new CountdownVoteViewModel { CountdownId = countdownId, Value = voteValue}) as JsonResult;
            Assert.IsNotNull(result);

            CountdownVoteViewModel model = result.Data as CountdownVoteViewModel;
            Assert.IsNotNull(model);
            Assert.AreEqual(countdownId, model.CountdownId);
            Assert.AreEqual(3, model.VoteScore);
            Assert.AreEqual(voteValue, model.CurrentUserVote);

            Core.Entities.Vote vote = controller.VoteRepository.Votes.FirstOrDefault();
            Assert.IsNotNull(vote);
            Assert.AreEqual(countdownId, vote.CountdownId);
            Assert.AreEqual(voteValue, vote.Value);
            Assert.AreEqual(accountId, vote.CastedByAccountId);
            Assert.AreEqual(systemTime, vote.CastedOn);
        }

        [Test]
        public async Task PostFromAnAuthenticatedUserForACountdownCreatedByCurrentUserId_ReturnsHttpStatusCode400BadRequest() {
            const int accountId = 7;
            const long countdownId = 3;

            TestableCountdownController controller = TestableCountdownController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(accountId);
            controller.CountdownRepository.Countdowns = new List<Countdown> {
                new Countdown {Id = countdownId, CreatedByAccountId = accountId}
            };

            HttpStatusCodeResult result = await controller.Vote(new CountdownVoteViewModel {CountdownId = countdownId, Value = 1}) as HttpStatusCodeResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
            Assert.AreEqual("Bad Request", result.StatusDescription);
        }
    }
}
