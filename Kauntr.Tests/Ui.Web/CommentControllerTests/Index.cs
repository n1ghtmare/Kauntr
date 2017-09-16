using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

using NUnit.Framework;

using Kauntr.Core.Entities;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Tests.Ui.Web.CommentControllerTests {
    [TestFixture]
    public class Index {
        [Test]
        public async Task GetRequest_ReturnsCommentListViewModel() {
            TestableCommentController controller = TestableCommentController.Create();
            var model = new CommentListViewModel {
                CountdownId = 123,
                Token = 123,
                Page = 1
            };

            JsonResult result = await controller.Index(model) as JsonResult;

            Assert.IsNotNull(result);

            CommentListViewModel resultModel = result.Data as CommentListViewModel;
            Assert.IsNotNull(resultModel);
            Assert.AreEqual(model.CountdownId, resultModel.CountdownId);
            Assert.AreEqual(model.Token, resultModel.Token);
            Assert.AreEqual(model.Page, resultModel.Page);
        }

        [Test]
        public async Task GetRequest_ReturnsAModelWithCorrectNumberOfComments() {
            TestableCommentController controller = TestableCommentController.Create();

            controller.CommentRepository.CommentAggregates.Add(new CommentAggregate());
            controller.CommentRepository.CommentAggregates.Add(new CommentAggregate());
            controller.CommentRepository.CommentAggregates.Add(new CommentAggregate());

            var model = new CommentListViewModel {
                CountdownId = 123,
                Token = 123,
                Page = 5
            };

            JsonResult result = await controller.Index(model) as JsonResult;

            Assert.IsNotNull(result);

            CommentListViewModel resultModel = result.Data as CommentListViewModel;
            Assert.IsNotNull(resultModel);
            Assert.AreEqual(3, resultModel.Comments.Count());
            Assert.AreEqual(3, resultModel.Total);
            Assert.AreEqual(model.Page, resultModel.Page);
            Assert.AreEqual(model.Token, resultModel.Token);
        }
    }
}
