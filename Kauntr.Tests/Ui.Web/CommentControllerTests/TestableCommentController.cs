using Moq;

using Kauntr.Core.Interfaces;
using Kauntr.Tests.Ui.Web.Helpers;
using Kauntr.Ui.Web.Controllers;

namespace Kauntr.Tests.Ui.Web.CommentControllerTests {
    public class TestableCommentController : CommentController {
        public InMemoryCommentRepository CommentRepository { get; set; }
        public InMemoryVoteRepository VoteRepository { get; set; }
        public Mock<IContextService> MockContextService { get; set; }
        public Mock<ISystemClock> MockSystemClock { get; set; }
        public Mock<INotificationHub> MockNotificationHub { get; set; }

        public TestableCommentController(InMemoryCommentRepository commentRepository, InMemoryVoteRepository voteRepository, Mock<IContextService> mockContextService, Mock<ISystemClock> mockSystemClock, Mock<INotificationHub> mockNotificationHub) : base(commentRepository, voteRepository, mockContextService.Object, mockSystemClock.Object, mockNotificationHub.Object) {
            CommentRepository = commentRepository;
            VoteRepository = voteRepository;
            MockContextService = mockContextService;
            MockSystemClock = mockSystemClock;
            MockNotificationHub = mockNotificationHub;
        }

        public static TestableCommentController Create() {
            return new TestableCommentController(new InMemoryCommentRepository(), new InMemoryVoteRepository(), new Mock<IContextService>(), new Mock<ISystemClock>(), new Mock<INotificationHub>());
        }
    }
}