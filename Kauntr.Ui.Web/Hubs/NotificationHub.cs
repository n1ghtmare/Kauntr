using Microsoft.AspNet.SignalR;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Ui.Web.Hubs {
    public class NotificationHub : Hub, INotificationHub {
        private static IHubContext Hub => GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();

        public void BroadcastCountdownUpdate(CountdownAggregate countdownAggregate) => Hub.Clients.All.broadcastCountdownUpdate(countdownAggregate);
        public void BroadcastCountdownUpdate(CommentAggregate commentAggregate) => Hub.Clients.All.broadcastCommentUpdate(commentAggregate);
        public void BroadcastCountdownCreate(Countdown countdown) => Hub.Clients.All.broadcastCountdownCreate(countdown);
        public void BroadcastCountdownCreate(Comment comment) => Hub.Clients.All.broadcastCommentCreate(comment);
        public void BroadcastNotificationDelete(Notification notification) => Hub.Clients.All.broadcastNotificationDelete(notification);
    }
}