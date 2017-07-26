using Moq;

using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Controllers;

namespace Kauntr.Tests.Ui.Web.CountdownControllerTests {
    public class TestableCountdownController : CountdownController {
        public InMemoryCountdownRepository CountdownRepository { get; set; }
        public Mock<IContextService> MockContextService { get; set; }
        public Mock<ISystemClock> MockSystemClock { get; set; }

        public TestableCountdownController(InMemoryCountdownRepository countdownRepository, Mock<IContextService> mockContextService, Mock<ISystemClock> mockSystemClock) : base(countdownRepository, mockContextService.Object, mockSystemClock.Object) {
            CountdownRepository = countdownRepository;
            MockSystemClock = mockSystemClock;
            MockContextService = mockContextService;
        }

        public static TestableCountdownController Create() {
            return new TestableCountdownController(new InMemoryCountdownRepository(), new Mock<IContextService>(), new Mock<ISystemClock>());
        }
    }
}