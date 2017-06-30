using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Controllers;
using Kauntr.Ui.Web.Models;
using Moq;
using NUnit.Framework;

namespace Kauntr.Tests.Ui.Web.AccountControllerTests {
    [TestFixture]
    public class Login {
        [Test]
        public async Task PostFromAuthenticatedUser_ReturnsEmptyResult() {
            AccountController controller = TestableAccountController.Create();

            ActionResult result = await controller.Login(new LoginViewModel {Email="test@test.com"});

            Assert.IsInstanceOf<EmptyResult>(result);
        }

        [Test]
        public async Task PostFromAuthenticatedUser_DoesntCallAccountRepositoryCreateAsync() {
            TestableAccountController controller = TestableAccountController.Create();

            await controller.Login(new LoginViewModel {Email = "test@test.com"});

            controller.MockAccountRepository
                .Verify(x => x.CreateAsync(It.IsAny<Account>()), Times.Never);
        }
    }
}
