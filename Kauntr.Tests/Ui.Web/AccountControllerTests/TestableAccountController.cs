using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Controllers;
using Moq;

namespace Kauntr.Tests.Ui.Web.AccountControllerTests {
    public class TestableAccountController : AccountController {
        public InMemoryAccountRepository AccountRepository { get; set; }
        public InMemoryAuthenticationTokenRepository AuthenticationTokenRepository { get; set; }
        public Mock<IHttpContextWrapper> MockHttpContextWrapper { get; set; }

        public TestableAccountController(InMemoryAccountRepository accountRepository, InMemoryAuthenticationTokenRepository authenticationTokenRepository, Mock<IHttpContextWrapper> mockHttpContextWrapper) : base(accountRepository, authenticationTokenRepository, mockHttpContextWrapper.Object) {
            AccountRepository = accountRepository;
            AuthenticationTokenRepository = authenticationTokenRepository;
            MockHttpContextWrapper = mockHttpContextWrapper;
        }

        public static TestableAccountController Create() {
            return new TestableAccountController(new InMemoryAccountRepository(), new InMemoryAuthenticationTokenRepository(), new Mock<IHttpContextWrapper>());
        }
    }
}