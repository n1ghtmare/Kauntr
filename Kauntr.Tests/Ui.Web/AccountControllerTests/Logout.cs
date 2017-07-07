using System.Threading.Tasks;
using System.Web.Mvc;
using Moq;
using NUnit.Framework;

namespace Kauntr.Tests.Ui.Web.AccountControllerTests {
    [TestFixture]
    public class Logout {
        [Test]
        public void AnUnAuthenticatedUser_ReturnsHttpStatusCodeResult400BadRequest() {
            TestableAccountController controller = TestableAccountController.Create();

            HttpStatusCodeResult result = controller.Logout() as HttpStatusCodeResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
            Assert.AreEqual("Bad Request", result.StatusDescription);
        }

        [Test]
        public void AnAuthenticatedUser_ReturnEmptyResult() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(true);

            EmptyResult result = controller.Logout() as EmptyResult;

            Assert.IsNotNull(result);
        }

        [Test]
        public void AnAuthenticatedUser_LogsUserOut() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(true);

            EmptyResult result = controller.Logout() as EmptyResult;

            Assert.IsNotNull(result);
            controller.MockContextService.Verify(x => x.Logout(), Times.Once());
        }
    }
}
