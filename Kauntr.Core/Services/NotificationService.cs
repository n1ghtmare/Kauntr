using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Core.Services {
    public class NotificationService : INotificationService {
        private readonly INotificationHub _notificationHub;

        public NotificationService(INotificationHub notificationHub) {
            _notificationHub = notificationHub;
        }

        // TODO - Refactor and add proper unit tests here
        public async Task SendAuthenticationEmailAsync(Account account, AuthenticationToken authenticationToken) {
            var smtpClient = new SmtpClient {
                PickupDirectoryLocation = @"C:\Dev-Playground\Kauntr-Emails\",
                DeliveryMethod = SmtpDeliveryMethod.SpecifiedPickupDirectory,
                Host = "localhost"
            };
            string authToken = $"http://localhost:3000/#/authenticate/account/{account.Id}/token/{authenticationToken.Token}";
            await smtpClient.SendMailAsync(new MailMessage {
                BodyEncoding = Encoding.UTF8,
                IsBodyHtml = true,
                From = new MailAddress("no-reply@kauntr.com"),
                To = {account.Email},
                Subject = "Logging in to Kauntr",
                Body =
                    $@"<p>Click on the following link if you want to login to Kaunr. This link will expire in fifteen minutes and can only be used once.</p>
                    <a href='{authToken}'>{authToken}</a>
                    <p>In case this request wasn't made by you, please contact us on support@kauntr.com</p>"
            });
        }

        public void UpdateClientsAfterVote(CountdownAggregate countdownAggregate) => _notificationHub.UpdateClientsAfterVote(countdownAggregate);

        public void UpdateClientsAfterVote(CommentAggregate commentAggregate) => _notificationHub.UpdateClientsAfterVote(commentAggregate);

        public void UpdateClientsAfterCreate(Countdown countdown) => _notificationHub.UpdateClientsAfterCreate(countdown);
    }
}
