using Moq;

using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Controllers;

namespace Kauntr.Tests.Ui.Web.CommentControllerTests {
    public class TestableCommentController : CommentController {
        public InMemoryCommentRepository CommentRepository { get; set; }
        public Mock<IContextService> MockContextService { get; set; }
        public Mock<ISystemClock> MockSystemClock { get; set; }

        public TestableCommentController(InMemoryCommentRepository commentRepository, Mock<IContextService> mockContextService, Mock<ISystemClock> mockSystemClock) : base(commentRepository, mockContextService.Object, mockSystemClock.Object) {
            CommentRepository = commentRepository;
            MockContextService = mockContextService;
            MockSystemClock = mockSystemClock;
        }

        public static TestableCommentController Create() {
            return new TestableCommentController(new InMemoryCommentRepository(), new Mock<IContextService>(), new Mock<ISystemClock>());
        }
    }
}