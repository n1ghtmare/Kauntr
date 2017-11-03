using Kauntr.Core.Entities;

namespace Kauntr.Core.Interfaces {
    public interface INotificationHub {
        void BroadcastCountdownUpdate(CountdownAggregate countdownAggregate);
        void BroadcastCountdownUpdate(CommentAggregate commentAggregate);
        void BroadcastCountdownCreate(Countdown countdown);
        void BroadcastCountdownCreate(Comment comment);
        void BroadcastNotificationDelete(Notification notification);
        void BroadcastNotificationUpdate(Notification notification);
        void BroadcastNotificationCreate(Notification notification);
    }
}
