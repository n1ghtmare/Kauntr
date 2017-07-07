using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

using NUnit.Framework;

using Kauntr.Core.Entities;
using Kauntr.Ui.Web.Models;
using Moq;

namespace Kauntr.Tests.Ui.Web.AccountControllerTests {
    [TestFixture]
    public class Authenticate {
        [Test]
        public async Task AnAuthenticatedUserPostsToken_ReturnsHttpStatusCodeResult400BadRequest() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(true);

            HttpStatusCodeResult result = await controller.Authenticate(new AuthenticationViewModel {Token = "test", AccountId = 1}) as HttpStatusCodeResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
            Assert.AreEqual("Bad Request", result.StatusDescription);
        }

        [Test]
        public async Task AnUnAuthenticatedUserPostsTokenAndAccountIdThatIsNotValid_ReturnsHttpStatusCodeResult403Forbidden() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);

            HttpStatusCodeResult result = await controller.Authenticate(new AuthenticationViewModel {Token = "test", AccountId = 1}) as HttpStatusCodeResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(403, result.StatusCode);
            Assert.AreEqual("Forbidden", result.StatusDescription);
        }

        [Test]
        public async Task AnUnAuthenticatedUserPostsTokenAndAccountIdThatIsValid_ReturnEmptyResult() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);

            const int accountId = 1;
            const string token = "totally-fake-token";
            controller.AuthenticationTokenRepository.AuthenticationTokens.Add(new AuthenticationToken {
                Id = Guid.NewGuid(),
                AccountId = accountId,
                Token = token
            });

            EmptyResult result = await controller.Authenticate(new AuthenticationViewModel {Token = token, AccountId = accountId}) as EmptyResult;

            Assert.IsNotNull(result);
        }

        [Test]
        public async Task AnUnAuthenticatedUserPostsTokenAndAccountIdThatAreValid_MarksAuthenticationTokenAsUsed() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);

            const int accountId = 1;
            const string token = "totally-fake-token";
            controller.AuthenticationTokenRepository.AuthenticationTokens.Add(new AuthenticationToken {
                Id = Guid.NewGuid(),
                AccountId = accountId,
                Token = token,
                IsUsed = false
            });

            EmptyResult result = await controller.Authenticate(new AuthenticationViewModel {Token = token, AccountId = accountId}) as EmptyResult;
            AuthenticationToken authenticationToken = controller.AuthenticationTokenRepository.AuthenticationTokens.FirstOrDefault();

            Assert.IsNotNull(result);
            Assert.IsNotNull(authenticationToken);
            Assert.IsTrue(authenticationToken.IsUsed);
            Assert.IsNotNull(authenticationToken.UsedOn);
            Assert.AreEqual(1, controller.AuthenticationTokenRepository.NumberOfTimesUpdateWasInvoked);
        }

        [Test]
        public async Task AnUnAuthenticatedUserPostsTokenAndAccountIdThatAreValid_AuthenticatesTheUser() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);

            const int accountId = 1;
            const string token = "totally-fake-token";
            controller.AuthenticationTokenRepository.AuthenticationTokens.Add(new AuthenticationToken {
                Id = Guid.NewGuid(),
                AccountId = accountId,
                Token = token,
                IsUsed = false
            });

            EmptyResult result = await controller.Authenticate(new AuthenticationViewModel {Token = token, AccountId = accountId}) as EmptyResult;

            controller.MockContextService.Verify(x => x.Authenticate(accountId), Times.Once);
        }
    }
}
