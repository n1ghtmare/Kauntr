using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

using NUnit.Framework;

using Kauntr.Core.Entities;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Tests.Ui.Web.AccountControllerTests {
    [TestFixture]
    public class Login {
        [Test]
        public async Task PostFromAuthenticatedUser_ReturnsHttpStatusCode401BadRequest() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockHttpContextWrapper.Setup(x => x.CurrentUserIsAuthenticated).Returns(true);

            HttpStatusCodeResult result = await controller.Login(new LoginViewModel {Email="test@test.com"}) as HttpStatusCodeResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
            Assert.AreEqual("Bad Request", result.StatusDescription);
        }

        [Test]
        public async Task PostFromAuthenticatedUser_DoesntRegisterUser() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockHttpContextWrapper.Setup(x => x.CurrentUserIsAuthenticated).Returns(true);

            const string email = "test@test.com";
            await controller.Login(new LoginViewModel {Email = email});

            Account account = await controller.AccountRepository.GetByEmailAsync(email);
            Assert.IsNull(account);
        }

        [Test]
        public async Task PostFromUnAuthenticatedUser_RegistersUser() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockHttpContextWrapper.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);

            const string email = "test@test.com";
            await controller.Login(new LoginViewModel {Email = email});

            Account account = await controller.AccountRepository.GetByEmailAsync(email);
            Assert.IsNotNull(account);
            Assert.AreEqual(email, account.Email);
        }

        [Test]
        public async Task PostFromAnUnAuthenticatedUser_CreatesAnAuthenticationToken() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockHttpContextWrapper.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);

            await controller.Login(new LoginViewModel {Email = "test@test.com"});

            AuthenticationToken authenticationToken = controller.AuthenticationTokenRepository.AuthenticationTokens.FirstOrDefault();

            Assert.IsNotNull(authenticationToken);
            Assert.IsNotEmpty(authenticationToken.Token);
        }
    }
}
