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
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(1);

            const int token = 123;
            var account = new Account {
                Id = 1,
                Email = "test@test.com",
                DisplayName = "tester"
            };
            controller.AccountRepository.Accounts.Add(account);

            JsonResult result = await controller.Index(token) as JsonResult;
            dynamic accountJson = result?.Data;
            dynamic accountResult = accountJson?.Account;

            Assert.IsNotNull(accountJson);
            Assert.IsNotNull(accountJson.Account);
            Assert.AreEqual(accountResult.Id, accountResult.Id);
            Assert.AreEqual(token, accountJson.Token);
        }
    }
}
