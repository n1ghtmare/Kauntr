using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Controllers;

using Moq;

namespace Kauntr.Tests.Ui.Web.AccountControllerTests {
    public class TestableAccountController : AccountController {
        public Mock<IAccountRepository> MockAccountRepository { get; set; }

        public TestableAccountController(Mock<IAccountRepository> mockAccountRepository) : base(mockAccountRepository.Object) {
            MockAccountRepository = mockAccountRepository;
        }

        public static TestableAccountController Create() {
            return new TestableAccountController(new Mock<IAccountRepository>());
        }
    }
}