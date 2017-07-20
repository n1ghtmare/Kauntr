using System.Threading.Tasks;
using System.Web.Mvc;

using NUnit.Framework;

using Kauntr.Core.Entities;

namespace Kauntr.Tests.Ui.Web.AccountControllerTests {
    [TestFixture]
    public class Index {
        [Test]
        public async Task Get_ReturnsCurrentUserAccountDetails() {
            TestableAccountController controller = TestableAccountController.Create();
            const int currentUserAccountId = 1;
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(currentUserAccountId);
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(true);

            const int token = 123;
            var account = new Account {
                Id = currentUserAccountId,
                Email = "test@test.com",
                DisplayName = "tester"
            };
            controller.AccountRepository.Accounts.Add(account);

            JsonResult result = await controller.Index(token) as JsonResult;
            dynamic accountJson = result?.Data;
            dynamic accountResult = accountJson?.Account;

            Assert.IsNotNull(accountJson);
            Assert.IsNotNull(accountJson.Account);
            Assert.AreEqual(account.Id, accountResult.Id);
            Assert.AreEqual(token, accountJson.Token);
        }

        [Test]
        public async Task GetAccountId_ReturnsCorrectAccountDetailsWithPrivacyForEmail() {
            TestableAccountController controller = TestableAccountController.Create();
            const int requestedAccountId = 2;
            const int currentUserAccountId = 1;
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(currentUserAccountId);

            const int token = 123;
            var account = new Account {
                Id = requestedAccountId,
                Email = "test@test.com",
                DisplayName = "tester"
            };
            var accountCurrentUser = new Account {
                Id = currentUserAccountId,
                Email = "currentUser@test.com",
                DisplayName = "tester - 2"
            };
            controller.AccountRepository.Accounts.Add(accountCurrentUser);
            controller.AccountRepository.Accounts.Add(account);

            JsonResult result = await controller.Index(token, requestedAccountId) as JsonResult;
            dynamic accountJson = result?.Data;
            dynamic accountResult = accountJson?.Account;

            Assert.IsNotNull(accountJson);
            Assert.IsNotNull(accountJson.Account);
            Assert.AreEqual(account.Id, accountResult.Id);
            Assert.IsNull(accountResult.Email);
            Assert.AreEqual(token, accountJson.Token);
        }

        [Test]
        public async Task GetFromAnUnauthenticatedUserWithNoAccountIdRequested_ReturnsHttpStatusCodeResult403Forbidden() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);

            const int token = 123;

            HttpStatusCodeResult result = await controller.Index(token) as HttpStatusCodeResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(403, result.StatusCode);
            Assert.AreEqual("Forbidden", result.StatusDescription);
        }

        [Test]
        public async Task GetAnAccountIdThatIsNotExisting_ReturnsHttpStatusCode404NotFound() {
            TestableAccountController controller = TestableAccountController.Create();

            HttpStatusCodeResult result = await controller.Index(123, 1) as HttpStatusCodeResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(404, result.StatusCode);
            Assert.AreEqual("Not Found", result.StatusDescription);
        }
    }
}
