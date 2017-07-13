using Moq;

using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Controllers;

namespace Kauntr.Tests.Ui.Web.SharedContextControllerTests {
    internal class TestableSharedContextController : SharedContextController {
        public Mock<IContextService> MockContextService { get; set; }

        public TestableSharedContextController(Mock<IContextService> contextService) : base(contextService.Object) {
            MockContextService = contextService;
        }

        public static TestableSharedContextController Create() {
            return new TestableSharedContextController(new Mock<IContextService>());
        }
    }
}