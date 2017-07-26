using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

using Moq;
using NUnit.Framework;

using Kauntr.Core.Entities;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Tests.Ui.Web.AccountControllerTests {
    [TestFixture]
    public class Authenticate {
        [Test]
        public async Task AnAuthenticatedUserPostsToken_ReturnsHttpStatusCodeResult400BadRequest() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(true);

            HttpStatusCodeResult result = await controller.Authenticate(new AuthenticationViewModel {AuthenticationToken = "test", AccountId = 1}) as HttpStatusCodeResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
            Assert.AreEqual("Bad Request", result.StatusDescription);
        }

        [Test]
        public async Task AnUnAuthenticatedUserPostsTokenAndAccountIdThatAreNotValid_ReturnsHttpStatusCodeResult403Forbidden() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);

            HttpStatusCodeResult result = await controller.Authenticate(new AuthenticationViewModel {AuthenticationToken = "test", AccountId = 1}) as HttpStatusCodeResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(403, result.StatusCode);
            Assert.AreEqual("Forbidden", result.StatusDescription);
        }

        [Test]
        public async Task AnUnAuthenticatedUserPostsTokenAndAccountIdThatAreValid_ReturnEmptyResult() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);

            const int accountId = 1;
            const string token = "totally-fake-token";
            controller.AuthenticationTokenRepository.AuthenticationTokens.Add(new AuthenticationToken {
                Id = Guid.NewGuid(),
                AccountId = accountId,
                Token = token
            });

            EmptyResult result = await controller.Authenticate(new AuthenticationViewModel {AuthenticationToken = token, AccountId = accountId}) as EmptyResult;

            Assert.IsNotNull(result);
        }

        [Test]
        public async Task AnUnAuthenticatedUserPostsTokenAndAccountIdThatAreValid_MarksAuthenticationTokenAsUsed() {
            TestableAccountController controller = TestableAccountController.Create();
            var systemTime = new DateTime(2017, 5, 1, 7, 31, 50);
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);
            controller.MockSystemClock.Setup(x => x.UtcNow).Returns(systemTime);

            const int accountId = 1;
            const string token = "totally-fake-token";
            controller.AuthenticationTokenRepository.AuthenticationTokens.Add(new AuthenticationToken {
                Id = Guid.NewGuid(),
                AccountId = accountId,
                Token = token,
                IsUsed = false
            });

            EmptyResult result = await controller.Authenticate(new AuthenticationViewModel {AuthenticationToken = token, AccountId = accountId}) as EmptyResult;
            AuthenticationToken authenticationToken = controller.AuthenticationTokenRepository.AuthenticationTokens.FirstOrDefault();

            Assert.IsNotNull(result);
            Assert.IsNotNull(authenticationToken);
            Assert.IsTrue(authenticationToken.IsUsed);
            Assert.AreEqual(systemTime, authenticationToken.UsedOn);
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

            EmptyResult result = await controller.Authenticate(new AuthenticationViewModel {AuthenticationToken = token, AccountId = accountId}) as EmptyResult;

            Assert.IsNotNull(result);
            controller.MockContextService.Verify(x => x.Authenticate(accountId), Times.Once);
        }
    }
}
