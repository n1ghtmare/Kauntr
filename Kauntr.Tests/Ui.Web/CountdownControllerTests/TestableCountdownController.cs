using Moq;

using Kauntr.Core.Interfaces;
using Kauntr.Tests.Ui.Web.Helpers;
using Kauntr.Ui.Web.Controllers;

namespace Kauntr.Tests.Ui.Web.CountdownControllerTests {
    public class TestableCountdownController : CountdownController {
        public InMemoryCountdownRepository CountdownRepository { get; set; }
        public InMemoryVoteRepository VoteRepository { get; set; }
        public Mock<IContextService> MockContextService { get; set; }
        public Mock<ISystemClock> MockSystemClock { get; set; }

        public TestableCountdownController(InMemoryCountdownRepository countdownRepository, InMemoryVoteRepository voteRepository, Mock<IContextService> mockContextService, Mock<ISystemClock> mockSystemClock) : base(countdownRepository, voteRepository, mockContextService.Object, mockSystemClock.Object) {
            CountdownRepository = countdownRepository;
            VoteRepository = voteRepository;
            MockSystemClock = mockSystemClock;
            MockContextService = mockContextService;
        }

        public static TestableCountdownController Create() {
            return new TestableCountdownController(new InMemoryCountdownRepository(), new InMemoryVoteRepository(), new Mock<IContextService>(), new Mock<ISystemClock>());
        }
    }
}