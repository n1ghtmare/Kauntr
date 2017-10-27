using System.Threading.Tasks;

using Kauntr.Core.Entities;

namespace Kauntr.Core.Interfaces {
    public interface INotificationService {
        Task SendAuthenticationEmailAsync(Account account, AuthenticationToken authenticationToken);
        void UpdateClientsAfterVote(CountdownAggregate countdownAggregate);
        void UpdateClientsAfterVote(CommentAggregate commentAggregate);
        void UpdateClientsAfterCreate(Countdown countdown);
        void UpdateClientsAfterCreate(Comment comment);
        Task NotifyCountdownOwnerAsync(long countdownId, NotificationChange notificationChange);
    }
}
