using System.Collections.Generic;

using Kauntr.Core.Entities;

namespace Kauntr.Ui.Web.Models {
    public class NotificationListViewModel {
        public IEnumerable<NotificationAggregate> Notifications { get; set; }
        public int Page { get; set; }
        public int Total { get; set; }
        public int Token { get; set; }
    }
}