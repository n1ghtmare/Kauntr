using System;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web.Mvc;

using NUnit.Framework;

using Kauntr.Core.Entities;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Tests.Ui.Web.AccountControllerTests {
    [TestFixture]
    public class Login {
        [Test]
        public async Task PostFromAuthenticatedUser_ReturnsHttpStatusCode400BadRequest() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(true);

            HttpStatusCodeResult result = await controller.Login(new LoginViewModel {Email="test@test.com"}) as HttpStatusCodeResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(400, result.StatusCode);
            Assert.AreEqual("Bad Request", result.StatusDescription);
        }

        [Test]
        public async Task PostFromAuthenticatedUser_DoesntRegisterUser() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(true);

            const string email = "test@test.com";
            await controller.Login(new LoginViewModel {Email = email});

            Account account = await controller.AccountRepository.GetByEmailAsync(email);
            Assert.IsNull(account);
        }

        [Test]
        public async Task PostFromUnAuthenticatedUser_RegistersUserWithSystemGeneratedUsername() {
            TestableAccountController controller = TestableAccountController.Create();
            var systemTime = new DateTime(2017, 5, 1, 9, 31, 57); // Ticks - 636292279170000000
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);
            controller.MockSystemClock.Setup(x => x.UtcNow).Returns(systemTime);

            const string email = "test@test.com";
            await controller.Login(new LoginViewModel {Email = email});

            Account account = await controller.AccountRepository.GetByEmailAsync(email);
            Assert.IsNotNull(account);
            Assert.AreEqual(email, account.Email);
            Assert.AreEqual("user_7000000", account.DisplayName);
            Assert.AreEqual(systemTime, account.CreatedOn);
        }

        [Test]
        public async Task PostFromAnUnAuthenticatedUser_CreatesAnAuthenticationTokenWithCorrectValues() {
            TestableAccountController controller = TestableAccountController.Create();
            var systemTime = new DateTime(2017, 5, 1, 9, 31, 57);
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);
            controller.MockSystemClock.Setup(x => x.UtcNow).Returns(systemTime);

            await controller.Login(new LoginViewModel {Email = "test@test.com"});

            AuthenticationToken authenticationToken = controller.AuthenticationTokenRepository.AuthenticationTokens.FirstOrDefault();

            Assert.IsNotNull(authenticationToken);
            Assert.IsNotEmpty(authenticationToken.Token);
            Assert.AreEqual(systemTime, authenticationToken.CreatedOn);
            Assert.AreEqual(systemTime.AddMinutes(15), authenticationToken.ExpiresOn);
        }

        [Test]
        public async Task PostFromAnUnAuthenticatedUser_SendsAnEmailToTheUser() {
            TestableAccountController controller = TestableAccountController.Create();
            var systemTime = new DateTime(2017, 5, 1, 9, 31, 57);
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);
            controller.MockSystemClock.Setup(x => x.UtcNow).Returns(systemTime);

            const string email = "test@test.com";
            await controller.Login(new LoginViewModel {Email = email});

            AuthenticationToken authenticationToken = controller.AuthenticationTokenRepository.AuthenticationTokens.FirstOrDefault();
            MailMessage emailNotification = controller.NotificationService.Emails.FirstOrDefault(x => x.To.Any(a => a.Address.ToString() == email));

            Assert.IsNotNull(emailNotification);
            Assert.IsNotEmpty(emailNotification.Body);
            Assert.IsNotNull(authenticationToken);
            Assert.IsTrue(emailNotification.Body.Contains(authenticationToken.Token));
        }

        [Test]
        public async Task PostFromAnUnauthenticatedUser_UpdatesNumberOfTokensSentAndLastSendOn() {
            TestableAccountController controller = TestableAccountController.Create();
            var systemTime = new DateTime(2017, 5, 1, 7, 31, 50);
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);
            controller.MockSystemClock.Setup(x => x.UtcNow).Returns(systemTime);

            const string email = "test@test.com";
            await controller.Login(new LoginViewModel { Email = email });

            AuthenticationToken authenticationToken = controller.AuthenticationTokenRepository.AuthenticationTokens.FirstOrDefault();

            Assert.IsNotNull(authenticationToken);
            Assert.AreEqual(1, authenticationToken.NumberOfTimesSent);
            Assert.AreEqual(systemTime, authenticationToken.LastSentOn);
            Assert.AreEqual(1, controller.AuthenticationTokenRepository.NumberOfTimesUpdateWasInvoked);
        }

        [Test]
        public async Task PostFromAnAuthenticatedUserWithAnExistingUnusedToken_ResendsAnEmailToUser() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);

            const string email = "test@test.com";
            const int accountId = 1;
            var existingAuthenticationToken = new AuthenticationToken {
                AccountId = accountId,
                Token = "SOME_TOKEN"
            };
            var account = new Account {
                Email = email,
                Id = accountId,
            };
            controller.AccountRepository.Accounts.Add(account);
            controller.AuthenticationTokenRepository.AuthenticationTokens.Add(existingAuthenticationToken);

            await controller.Login(new LoginViewModel {Email = email});

            MailMessage emailNotification = controller.NotificationService.Emails.FirstOrDefault(x => x.To.Any(a => a.Address.ToString() == email));

            Assert.IsNotNull(emailNotification);
            Assert.IsNotEmpty(emailNotification.Body);
            Assert.IsTrue(emailNotification.Body.Contains(existingAuthenticationToken.Token));
            Assert.IsTrue(emailNotification.Body.Contains(accountId.ToString()));
        }

        [Test]
        public async Task PostFromAnUnAuthenticatedUserThatHasSentTokens5Times_ReturnsHttpStatusCode403WithCustomMessage() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockContextService.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);

            const string email = "test@test.com";
            const int accountId = 1;
            var existingAuthenticationToken = new AuthenticationToken {
                AccountId = accountId,
                Token = "SOME_TOKEN",
                NumberOfTimesSent = 5
            };
            var account = new Account {
                Email = email,
                Id = accountId,
            };
            controller.AccountRepository.Accounts.Add(account);
            controller.AuthenticationTokenRepository.AuthenticationTokens.Add(existingAuthenticationToken);

            HttpStatusCodeResult result = await controller.Login(new LoginViewModel { Email = "test@test.com" }) as HttpStatusCodeResult;

            Assert.IsNotNull(result);
            Assert.AreEqual(403, result.StatusCode);
            Assert.AreEqual("Forbidden", result.StatusDescription);
        }

    }
}
