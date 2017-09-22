using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

using NUnit.Framework;

using Kauntr.Core.Entities;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Tests.Ui.Web.CommentControllerTests {
    [TestFixture]
    public class Create {
        [Test]
        public async Task PostFromAnAuthenticatedUserWithValidViewModel_ReturnsEmptyResult() {
            TestableCommentController controller = TestableCommentController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(123);

            var model = new CommentCreateViewModel {
                CountdownId = 123,
                Text = "Testing"
            };

            EmptyResult result = await controller.Create(model) as EmptyResult;

            Assert.IsNotNull(result);
        }

        [Test]
        public async Task PostFromAnAuthenticatedUserWithValidViewModel_CreatesACommentWithCorrectlyData() {
            TestableCommentController controller = TestableCommentController.Create();
            const int currentUserAccountId = 345;
            DateTime systemTime = new DateTime(2017, 9, 22, 16, 43, 7);
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(currentUserAccountId);
            controller.MockSystemClock.Setup(x => x.UtcNow).Returns(systemTime);

            var model = new CommentCreateViewModel {
                CountdownId = 123,
                Text = "Testing"
            };

            EmptyResult result = await controller.Create(model) as EmptyResult;
            Comment comment = controller.CommentRepository.Comments.FirstOrDefault();

            Assert.IsNotNull(result);
            Assert.IsNotNull(comment);
            Assert.AreEqual(model.Text, comment.Text);
            Assert.AreEqual(model.CountdownId, comment.CountdownId);
            Assert.AreEqual(systemTime, comment.CreatedOn);
            Assert.AreEqual(currentUserAccountId, comment.CreatedByAccountId);
        }

        [Test]
        public async Task PostFromAnAuthenticatedUserWithAnInvalidViewModel_ReturnsHttpStatusCode400BadRequest() {
            TestableCommentController controller = TestableCommentController.Create();
            controller.ModelState.AddModelError("Nope", "Error Message");

            HttpStatusCodeResult result = await controller.Create(new CommentCreateViewModel()) as HttpStatusCodeResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
            Assert.AreEqual("Bad Request", result.StatusDescription);
        }
    }
}
