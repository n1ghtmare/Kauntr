using System;
using System.Threading.Tasks;
using System.Web.Mvc;

using NUnit.Framework;

using Kauntr.Core.Entities;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Tests.Ui.Web.AccountControllerTests {
    [TestFixture]
    public class Update {
        [Test]
        public async Task PostFromAnAuthenticatedUserWithValidModelState_UpdatesAccountAndReturnsEmptyResult() {
            TestableAccountController controller = TestableAccountController.Create();
            const int currentUserAccountId = 1;
            const string newDisplayName = "Bobo";

            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(currentUserAccountId);
            var account = new Account {
                Id = currentUserAccountId,
                CreatedOn = DateTime.Today,
                DisplayName = "dude",
                IsAutoSetup = true,
                Email = "dude@test.com",
                Reputation = 123
            };
            controller.AccountRepository.Accounts.Add(account);

            EmptyResult result = await controller.Update(new AccountUpdateViewModel {DisplayName = newDisplayName}) as EmptyResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(newDisplayName, account.DisplayName);
            Assert.IsFalse(account.IsAutoSetup);
            Assert.AreEqual(1, controller.AccountRepository.NumberOfTimesUpdateWasInvoked);
        }

        [Test]
        public async Task PostFromAnAuthenticatedUserWithInvalidModelState_ReturnsHttpStatusCode400BadRequest() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserAccountId).Returns(1);
            controller.ModelState.AddModelError("NOPE", "Erroredededed");

            HttpStatusCodeResult result = await controller.Update(new AccountUpdateViewModel()) as HttpStatusCodeResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
            Assert.AreEqual("Bad Request", result.StatusDescription);
        }
    }
}