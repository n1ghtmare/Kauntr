using Moq;

using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Controllers;

namespace Kauntr.Tests.Ui.Web.VoteControllerTests {
    public class TestableVoteController : VoteController {
        public InMemoryVoteRepository VoteRepository { get; set; }
        public Mock<IContextService> MockContextService { get; set; }
        public Mock<ISystemClock> MockSystemClock { get; set; }

        public TestableVoteController(InMemoryVoteRepository voteRepository, Mock<IContextService> mockContextService, Mock<ISystemClock> mockSystemClock) : base(voteRepository, mockContextService.Object, mockSystemClock.Object) {
            VoteRepository = voteRepository;
            MockContextService = mockContextService;
            MockSystemClock = mockSystemClock;
        }

        public static TestableVoteController Create() {
            return new TestableVoteController(new InMemoryVoteRepository(), new Mock<IContextService>(), new Mock<ISystemClock>());
        }
    }
}
