using Microsoft.AspNet.SignalR;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Ui.Web.Hubs {
    public class NotificationHub : Hub, INotificationHub {
        public void NotifyConnectedClients(CountdownAggregate countdownAggregate, int triggeredByUserAccountId) {
            IHubContext notificationHub = GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();
            notificationHub.Clients.All.broadcastCountdownUpdate(countdownAggregate, triggeredByUserAccountId);
        }

        public void NotifyConnectedClients(CommentAggregate commentAggregate, int triggeredByUserAccountId) {
            IHubContext notificationHub = GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();
            notificationHub.Clients.All.broadcastCommentUpdate(commentAggregate, triggeredByUserAccountId);
        }
    }
}