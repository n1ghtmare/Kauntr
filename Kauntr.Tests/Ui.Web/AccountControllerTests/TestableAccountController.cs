using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Controllers;

using Moq;

namespace Kauntr.Tests.Ui.Web.AccountControllerTests {
    public class TestableAccountController : AccountController {
        public InMemoryAccountRepository AccountRepository { get; set; }
        public InMemoryAuthenticationTokenRepository AuthenticationTokenRepository { get; set; }
        public Mock<IContextService> MockHttpContextWrapper { get; set; }
        public InMemoryNotificationService NotificationService { get; set; }

        public TestableAccountController(InMemoryAccountRepository accountRepository, InMemoryAuthenticationTokenRepository authenticationTokenRepository, Mock<IContextService> mockHttpContextWrapper, InMemoryNotificationService notificationService) : base(accountRepository, authenticationTokenRepository, mockHttpContextWrapper.Object, notificationService) {
            AccountRepository = accountRepository;
            AuthenticationTokenRepository = authenticationTokenRepository;
            MockHttpContextWrapper = mockHttpContextWrapper;
            NotificationService = notificationService;
        }

        public static TestableAccountController Create() {
            return new TestableAccountController(new InMemoryAccountRepository(), new InMemoryAuthenticationTokenRepository(), new Mock<IContextService>(), new InMemoryNotificationService());
        }
    }
}