using Microsoft.AspNet.SignalR;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Ui.Web.Hubs {
    public class NotificationHub : Hub, INotificationHub {
        private static IHubContext Hub => GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();

        public void UpdateClientsAfterVote(CountdownAggregate countdownAggregate) => Hub.Clients.All.broadcastCountdownUpdate(countdownAggregate);
        public void UpdateClientsAfterVote(CommentAggregate commentAggregate) => Hub.Clients.All.broadcastCommentUpdate(commentAggregate);
        public void UpdateClientsAfterCreate(Countdown countdown) => Hub.Clients.All.broadcastCountdownCreate(countdown);
        public void UpdateClientsAfterCreate(Comment comment) => Hub.Clients.All.broadcastCommentCreate(comment);
    }
}