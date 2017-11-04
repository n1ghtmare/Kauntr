using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Helpers;

namespace Kauntr.Ui.Web.Hubs {
    public class NotificationHub : Hub, INotificationHub {
        private readonly IContextService _contextService;

        public NotificationHub(IContextService contextService) {
            _contextService = contextService;
        }

        private static readonly ConnectionMapping<string> _connections = new ConnectionMapping<string>();

        private static IHubContext Hub => GlobalHost.ConnectionManager.GetHubContext<NotificationHub>();

        public void BroadcastCountdownUpdate(CountdownAggregate countdownAggregate) => Hub.Clients.All.broadcastCountdownUpdate(countdownAggregate);
        public void BroadcastCountdownUpdate(CommentAggregate commentAggregate) => Hub.Clients.All.broadcastCommentUpdate(commentAggregate);
        public void BroadcastCountdownCreate(Countdown countdown) => Hub.Clients.All.broadcastCountdownCreate(countdown);
        public void BroadcastCountdownCreate(Comment comment) => Hub.Clients.All.broadcastCommentCreate(comment);

        public void BroadcastNotificationDelete(Notification notification) {
            foreach (string connectionId in _connections.GetConnections(notification.OwnedByAccountId.ToString())) {
                Hub.Clients.Client(connectionId).broadcastNotificationDelete(notification);
            }
        }

        public void BroadcastNotificationUpdate(Notification notification) {
            foreach (string connectionId in _connections.GetConnections(notification.OwnedByAccountId.ToString())) {
                Hub.Clients.Client(connectionId).broadcastNotificationUpdate(notification);
            }
        }

        public void BroadcastNotificationCreate(Notification notification) {
            foreach (string connectionId in _connections.GetConnections(notification.OwnedByAccountId.ToString())) {
                Hub.Clients.Client(connectionId).broadcastNotificationCreate(notification);
            }
        }

        public override Task OnConnected() {
            if (_contextService.CurrentUserAccountId != null) {
                _connections.Add(_contextService.CurrentUserAccountId.ToString(), Context.ConnectionId);
            }
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled) {
            if (_contextService.CurrentUserAccountId != null) {
                _connections.Remove(_contextService.CurrentUserAccountId.ToString(), Context.ConnectionId);
            }
            return base.OnDisconnected(stopCalled);
        }

        public override Task OnReconnected() {
            if (_contextService.CurrentUserAccountId != null) {
                string name = _contextService.CurrentUserAccountId.ToString();
                if (!_connections.GetConnections(name).Contains(Context.ConnectionId)) {
                    _connections.Add(name, Context.ConnectionId);
                }
            }
            return base.OnReconnected();
        }
    }
}