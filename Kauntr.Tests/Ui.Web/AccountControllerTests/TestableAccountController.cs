﻿using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Controllers;

using Moq;

namespace Kauntr.Tests.Ui.Web.AccountControllerTests {
    public class TestableAccountController : AccountController {
        public InMemoryAccountRepository AccountRepository { get; set; }
        public InMemoryAuthenticationTokenRepository AuthenticationTokenRepository { get; set; }
        public Mock<IContextService> MockContextService { get; set; }
        public InMemoryNotificationService NotificationService { get; set; }

        public TestableAccountController(InMemoryAccountRepository accountRepository, InMemoryAuthenticationTokenRepository authenticationTokenRepository, Mock<IContextService> mockContextService, InMemoryNotificationService notificationService) : base(accountRepository, authenticationTokenRepository, mockContextService.Object, notificationService) {
            AccountRepository = accountRepository;
            AuthenticationTokenRepository = authenticationTokenRepository;
            MockContextService = mockContextService;
            NotificationService = notificationService;
        }

        public static TestableAccountController Create() {
            return new TestableAccountController(new InMemoryAccountRepository(), new InMemoryAuthenticationTokenRepository(), new Mock<IContextService>(), new InMemoryNotificationService());
        }
    }
}