using Moq;

using Kauntr.Core.Interfaces;
using Kauntr.Tests.Ui.Web.Helpers;
using Kauntr.Ui.Web.Controllers;

namespace Kauntr.Tests.Ui.Web.SharedContextControllerTests {
    internal class TestableSharedContextController : SharedContextController {
        public Mock<IContextService> MockContextService { get; set; }
        public InMemoryNotificationRepository NotificationRepository { get; set; }

        public TestableSharedContextController(Mock<IContextService> contextService, InMemoryNotificationRepository notificationRepository) : base(contextService.Object, notificationRepository) {
            MockContextService = contextService;
            NotificationRepository = notificationRepository;
        }

        public static TestableSharedContextController Create() {
            return new TestableSharedContextController(new Mock<IContextService>(), new InMemoryNotificationRepository());
        }
    }
}