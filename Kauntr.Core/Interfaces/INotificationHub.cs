using Kauntr.Core.Entities;

namespace Kauntr.Core.Interfaces {
    public interface INotificationHub {
        void UpdateClientsAfterVote(CountdownAggregate countdownAggregate);
        void UpdateClientsAfterVote(CommentAggregate commentAggregate);
        void UpdateClientsAfterCreate(Countdown countdown);
    }
}
