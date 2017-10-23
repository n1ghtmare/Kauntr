using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

using NUnit.Framework;
using Moq;

using Kauntr.Core.Entities;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Tests.Ui.Web.CommentControllerTests {
    [TestFixture]
    public class Vote {
        [Test]
        public async Task PostFromAnAuthenticatedUserWithInvalidModel_ReturnsHttpStatusCode400BadRequest() {
            TestableCommentController controller = TestableCommentController.Create();
            controller.ModelState.AddModelError("Nope", "Error Message");

            HttpStatusCodeResult result = await controller.Vote(new CommentVoteViewModel()) as HttpStatusCodeResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
            Assert.AreEqual("Bad Request", result.StatusDescription);
        }

        [Test]
        public async Task PostFromAnAuthenticatedUserWithNoExistingVotes_CreatesVoteAndReturnsResultWithMatchingValue() {
            const int voteValue = 1;
            const int accountId = 7;
            const long commentId = 3;
            var systemTime = new DateTime(2017, 10, 22, 7, 31, 53);

            TestableCommentController controller = TestableCommentController.Create();

            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(accountId);
            controller.MockSystemClock.Setup(x => x.UtcNow).Returns(systemTime);

            controller.CommentRepository.Comments = new List<Comment> {
                new Comment { Id = commentId, CreatedByAccountId = 9}
            };

            controller.CommentRepository.CommentAggregates = new List<CommentAggregate> {
                new CommentAggregate {Id = commentId, CreatedByAccountId = 9, VoteScore = 3, CurrentUserVote = voteValue}
            };

            JsonResult result = await controller.Vote(new CommentVoteViewModel {CommentId = commentId, Value = voteValue}) as JsonResult;
            Assert.IsNotNull(result);

            CommentVoteViewModel model = result.Data as CommentVoteViewModel;
            Assert.IsNotNull(model);
            Assert.AreEqual(commentId, model.CommentId);
            Assert.AreEqual(0, model.Value);
            Assert.AreEqual(3, model.VoteScore);
            Assert.AreEqual(voteValue, model.CurrentUserVote);

            Core.Entities.Vote vote = controller.VoteRepository.Votes.FirstOrDefault();
            Assert.IsNotNull(vote);
            Assert.AreEqual(commentId, vote.CommentId);
            Assert.AreEqual(voteValue, vote.Value);
            Assert.AreEqual(accountId, vote.CastedByAccountId);
            Assert.AreEqual(systemTime, vote.CastedOn);
        }

        [Test]
        public async Task PostFromAnAuthenticatedUser_NotifiesConnectedHubClients() {
            const int voteValue = 1;
            const int accountId = 7;
            const long commentId = 3;
            var systemTime = new DateTime(2017, 10, 22, 7, 31, 53);

            TestableCommentController controller = TestableCommentController.Create();

            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(accountId);
            controller.MockSystemClock.Setup(x => x.UtcNow).Returns(systemTime);

            controller.CommentRepository.Comments = new List<Comment> {
                new Comment { Id = commentId, CreatedByAccountId = 9}
            };

            controller.CommentRepository.CommentAggregates = new List<CommentAggregate> {
                new CommentAggregate {Id = commentId, CreatedByAccountId = 9, VoteScore = 3, CurrentUserVote = voteValue}
            };

            await controller.Vote(new CommentVoteViewModel {CommentId = commentId, Value = voteValue});

            controller.MockNotificationHub
    .Verify(x => x.NotifyConnectedClients(It.Is<CommentAggregate>(c => c.Id == commentId), accountId),
        Times.Once());
        }

        [Test]
        public async Task PostFromAnAuthenticatedUserWithAnExistingVoteWithSameValue_DeletesVoteAndReturnsResultWithANeutralValue() {
            const int voteValue = 1;
            const int accountId = 7;
            const long commentId = 3;

            TestableCommentController controller = TestableCommentController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(accountId);

            controller.VoteRepository.Votes.Add(new Core.Entities.Vote {
                CommentId = commentId,
                CastedByAccountId = accountId,
                Value = voteValue
            });

            controller.CommentRepository.Comments = new List<Comment> {
                new Comment { Id = commentId, CreatedByAccountId = 9}
            };

            controller.CommentRepository.CommentAggregates = new List<CommentAggregate> {
                new CommentAggregate {Id = commentId, CreatedByAccountId = 9, VoteScore = 3, CurrentUserVote = null}
            };

            JsonResult result = await controller.Vote(new CommentVoteViewModel {CommentId = commentId, Value = voteValue}) as JsonResult;
            Assert.IsNotNull(result);

            CommentVoteViewModel model = result.Data as CommentVoteViewModel;
            Assert.IsNotNull(model);
            Assert.AreEqual(commentId, model.CommentId);
            Assert.AreEqual(0, model.Value);
            Assert.AreEqual(3, model.VoteScore);
            Assert.IsNull(model.CurrentUserVote);
            Assert.IsEmpty(controller.VoteRepository.Votes);
        }

        [Test]
        public async Task PostFromAnAuthenticatedUserWithExistingVoteWithDifferentValue_DeletesVoteAndReturnsResultWithNewValue() {
            const int voteValue = 1;
            const int accountId = 7;
            const long commentId = 3;
            var systemTime = new DateTime(2017, 10, 22, 7, 31, 53);

            TestableCommentController controller = TestableCommentController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(accountId);
            controller.MockSystemClock.Setup(x => x.UtcNow).Returns(systemTime);

            controller.VoteRepository.Votes.Add(new Core.Entities.Vote {
                CommentId = commentId,
                CastedByAccountId = accountId,
                Value = -1,
                CastedOn = new DateTime(2017, 10, 11, 7, 31, 53)
            });

            controller.CommentRepository.Comments = new List<Comment> {
                new Comment { Id = commentId, CreatedByAccountId = 9}
            };

            controller.CommentRepository.CommentAggregates = new List<CommentAggregate> {
                new CommentAggregate {Id = commentId, CreatedByAccountId = 9, VoteScore = 3, CurrentUserVote = voteValue}
            };

            JsonResult result = await controller.Vote(new CommentVoteViewModel {CommentId = commentId, Value = voteValue}) as JsonResult;
            Assert.IsNotNull(result);

            CommentVoteViewModel model = result.Data as CommentVoteViewModel;
            Assert.IsNotNull(model);
            Assert.AreEqual(commentId, model.CommentId);
            Assert.AreEqual(3, model.VoteScore);
            Assert.AreEqual(voteValue, model.CurrentUserVote);

            Core.Entities.Vote vote = controller.VoteRepository.Votes.FirstOrDefault();
            Assert.IsNotNull(vote);
            Assert.AreEqual(commentId, vote.CommentId);
            Assert.AreEqual(voteValue, vote.Value);
            Assert.AreEqual(accountId, vote.CastedByAccountId);
            Assert.AreEqual(systemTime, vote.CastedOn);
        }

        [Test]
        public async Task PostFromAnAuthenticatedUserForACommentCreatedByCurrentUserId_ReturnsHttpStatusCode400BadRequest() {
            const int accountId = 7;
            const long commentId = 3;

            TestableCommentController controller = TestableCommentController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(accountId);
            controller.CommentRepository.Comments = new List<Comment> {
                new Comment { Id = commentId, CreatedByAccountId = accountId}
            };

            HttpStatusCodeResult result = await controller.Vote(new CommentVoteViewModel { CommentId = commentId, Value = 1 }) as HttpStatusCodeResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
            Assert.AreEqual("Bad Request", result.StatusDescription);
        }
    }
}
