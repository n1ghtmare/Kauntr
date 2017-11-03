using System.Collections.Generic;
using System.Net.Mail;
using System.Threading.Tasks;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Tests.Ui.Web.AccountControllerTests {
    public class InMemoryNotificationService : INotificationService {
        public List<MailMessage> Emails { get; set; } = new List<MailMessage>();

        public Task SendAuthenticationEmailAsync(Account account, AuthenticationToken token) {
            return Task.Run(() => Emails.Add(new MailMessage("no-reply@kauntr.com", account.Email, "Auth", $"Your Token is {token.Token} - {account.Id}")));
        }

        public void UpdateClientsAfterVote(CountdownAggregate countdownAggregate) {
            throw new System.NotImplementedException();
        }

        public void UpdateClientsAfterVote(CommentAggregate commentAggregate) {
            throw new System.NotImplementedException();
        }

        public void UpdateClientsAfterCreate(Countdown countdown) {
            throw new System.NotImplementedException();
        }

        public void UpdateClientsAfterCreate(Comment comment) {
            throw new System.NotImplementedException();
        }

        public Task NotifyCountdownOwnerAsync(long countdownId, NotificationChange notificationChange) {
            throw new System.NotImplementedException();
        }

        public Task NotifyCommentOwnerAsync(long commentId, NotificationChange notificationChange) {
            throw new System.NotImplementedException();
        }

        public Task ClearCountdownVoteNotificationsAsync(long countdownId, int ownedByAccountId, int createdByAccountId) {
            throw new System.NotImplementedException();
        }

        public Task ClearCommentVoteNotificationsAsync(long commentId, int ownedByAccountId, int createdByAccountId) {
            throw new System.NotImplementedException();
        }
    }
}
