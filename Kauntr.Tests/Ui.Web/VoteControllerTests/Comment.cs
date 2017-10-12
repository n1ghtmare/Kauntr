using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

using NUnit.Framework;

using Kauntr.Core.Entities;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Tests.Ui.Web.VoteControllerTests {
    [TestFixture]
    public class Comment {
        [Test]
        public async Task PostFromAnAuthenticatedUserWithInvalidModel_ReturnsHttpStatusCode400BadRequest() {
            TestableVoteController controller = TestableVoteController.Create();
            controller.ModelState.AddModelError("Nope", "Error Message");

            HttpStatusCodeResult result = await controller.Comment(new CommentVoteViewModel()) as HttpStatusCodeResult;

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

            TestableVoteController controller = TestableVoteController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(accountId);
            controller.MockSystemClock.Setup(x => x.UtcNow).Returns(systemTime);

            JsonResult result = await controller.Comment(new CommentVoteViewModel {CommentId = commentId, Value = voteValue}) as JsonResult;
            Assert.IsNotNull(result);

            CommentVoteViewModel model = result.Data as CommentVoteViewModel;
            Assert.IsNotNull(model);
            Assert.AreEqual(commentId, model.CommentId);
            Assert.AreEqual(voteValue, model.Value);

            Vote vote = controller.VoteRepository.Votes.FirstOrDefault();
            Assert.IsNotNull(vote);
            Assert.AreEqual(commentId, vote.CommentId);
            Assert.AreEqual(voteValue, vote.Value);
            Assert.AreEqual(accountId, vote.CastedByAccountId);
            Assert.AreEqual(systemTime, vote.CastedOn);
        }

        [Test]
        public async Task PostFromAnAuthenticatedUserWithAnExistingVoteWithSameValue_DeletesVoteAndReturnsResultWithANeutralValue() {
            const int voteValue = 1;
            const int accountId = 7;
            const long commentId = 3;

            TestableVoteController controller = TestableVoteController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(accountId);

            controller.VoteRepository.Votes.Add(new Vote {
                CommentId = commentId,
                CastedByAccountId = accountId,
                Value = voteValue
            });

            JsonResult result = await controller.Comment(new CommentVoteViewModel {CommentId = commentId, Value = voteValue}) as JsonResult;
            Assert.IsNotNull(result);

            CommentVoteViewModel model = result.Data as CommentVoteViewModel;
            Assert.IsNotNull(model);
            Assert.AreEqual(commentId, model.CommentId);
            Assert.AreEqual(0, model.Value);
            Assert.IsEmpty(controller.VoteRepository.Votes);
        }

        [Test]
        public async Task PostFromAnAuthenticatedUserWithExistingVoteWithDifferentValue_DeletesVoteAndReturnsResultWithNewValue() {
            const int voteValue = 1;
            const int accountId = 7;
            const long commentId = 3;
            var systemTime = new DateTime(2017, 10, 22, 7, 31, 53);

            TestableVoteController controller = TestableVoteController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(accountId);
            controller.MockSystemClock.Setup(x => x.UtcNow).Returns(systemTime);

            controller.VoteRepository.Votes.Add(new Vote {
                CommentId = commentId,
                CastedByAccountId = accountId,
                Value = -1,
                CastedOn = new DateTime(2017, 10, 11, 7, 31, 53)
            });

            JsonResult result = await controller.Comment(new CommentVoteViewModel {CommentId = commentId, Value = voteValue}) as JsonResult;
            Assert.IsNotNull(result);

            CommentVoteViewModel model = result.Data as CommentVoteViewModel;
            Assert.IsNotNull(model);
            Assert.AreEqual(commentId, model.CommentId);
            Assert.AreEqual(voteValue, model.Value);

            Vote vote = controller.VoteRepository.Votes.FirstOrDefault();
            Assert.IsNotNull(vote);
            Assert.AreEqual(commentId, vote.CommentId);
            Assert.AreEqual(voteValue, vote.Value);
            Assert.AreEqual(accountId, vote.CastedByAccountId);
            Assert.AreEqual(systemTime, vote.CastedOn);
        }
    }
}
