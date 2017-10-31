using System.Threading.Tasks;
using System.Web.Mvc;

using NUnit.Framework;

using Kauntr.Core.Entities;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Tests.Ui.Web.SharedContextControllerTests {
    [TestFixture]
    public class Index {
        [Test]
        public async Task GetFromAnUnAuthenticatedUser_ReturnsSharedContextViewModelWithDefaultEmptyValuesAndCorrectToken() {
            TestableSharedContextController controller = TestableSharedContextController.Create();
            const int token = 1;

            JsonResult result = await controller.Index(token);
            SharedContextViewModel model = result.Data as SharedContextViewModel;

            Assert.IsNotNull(model);
            Assert.IsNull(model.CurrentUserAccountId);
            Assert.AreEqual(token, model.Token);
        }

        [Test]
        public async Task GetFromAnAuthenticatedUser_ReturnsSharedContextViewModelWithCorrectlyMappedValues() {
            TestableSharedContextController controller = TestableSharedContextController.Create();
            const int token = 1;
            const int accountId = 2;

            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(accountId);
            controller.NotificationRepository.NotificationAggregates.Add(new NotificationAggregate());
            controller.NotificationRepository.NotificationAggregates.Add(new NotificationAggregate());
            controller.NotificationRepository.NotificationAggregates.Add(new NotificationAggregate());

            JsonResult result = await controller.Index(token);
            SharedContextViewModel model = result.Data as SharedContextViewModel;

            Assert.IsNotNull(model);
            Assert.AreEqual(accountId, model.CurrentUserAccountId);
            Assert.AreEqual(token, model.Token);
            Assert.AreEqual(3, model.NotificationsCount);
        }
    }
}
