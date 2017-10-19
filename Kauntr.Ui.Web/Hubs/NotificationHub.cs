using Microsoft.AspNet.SignalR;

namespace Kauntr.Ui.Web.Hubs {
    public class NotificationHub : Hub {
        public void Send(string message) {
            Clients.All.broadcastMessage(message);
        }
    }
}