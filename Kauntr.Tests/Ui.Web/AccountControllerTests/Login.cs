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
            Assert.IsNotNull(account.DisplayName);
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

        [Test]
        public async Task PostFromAnUnAuthenticatedUser_SendsAnEmailToTheUser() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockHttpContextWrapper.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);

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
            controller.MockHttpContextWrapper.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);

            const string email = "test@test.com";
            await controller.Login(new LoginViewModel { Email = email });

            AuthenticationToken authenticationToken = controller.AuthenticationTokenRepository.AuthenticationTokens.FirstOrDefault();

            Assert.IsNotNull(authenticationToken);
            Assert.AreEqual(1, authenticationToken.NumberOfTimesSent);
            Assert.IsNotNull(authenticationToken.LastSentOn);
            Assert.AreEqual(1, controller.AuthenticationTokenRepository.NumberOfTimesUpdateWasInvoked);
        }


        [Test]
        public async Task PostFromAnAuthenticatedUserWithAnExistingUnusedToken_ResendsAnEmailToUser() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockHttpContextWrapper.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);

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
        }

        [Test]
        public async Task PostFromAnUnAuthenticatedUserThatHasSentTokens5Times_ReturnsHttpStatusCode403WithCustomMessage() {
            TestableAccountController controller = TestableAccountController.Create();
            controller.MockHttpContextWrapper.Setup(x => x.CurrentUserIsAuthenticated).Returns(false);

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
            Assert.AreEqual("Forbidden - Authentication Token Has been sent too many times", result.StatusDescription);
        }

    }
}
