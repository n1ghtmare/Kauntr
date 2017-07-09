using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Kauntr.Core.Entities;
using NUnit.Framework;

namespace Kauntr.Tests.Ui.Web.AccountControllerTests
{
    [TestFixture]
    public class Index
    {
        [Test]
        public async Task Get_ReturnsCurrentUserAccountDetails() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(1);

            var account = new Account {
                Id = 1,
                Email = "test@test.com",
                DisplayName = "tester"
            };
            controller.AccountRepository.Accounts.Add(account);

            JsonResult result = await controller.Index() as JsonResult;
            dynamic accountJson = result?.Data;

            Assert.IsNotNull(accountJson);
            Assert.AreEqual(account.Id, accountJson.Id);
        }
    }
}
