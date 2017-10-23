using Kauntr.Core.Entities;

namespace Kauntr.Core.Interfaces {
    public interface INotificationHub {
        void NotifyConnectedClients(CountdownAggregate countdownAggregate, int triggeredByUserAccountId);
        void NotifyConnectedClients(CommentAggregate commentAggregate, int triggeredByUserAccountId);
    }
}
