using System;

namespace Kauntr.Core.Entities {
    public class NotificationChange {
        public long Id { get; set; }
        public long NotificationId { get; set; }
        public int CreatedByAccountId { get; set; }
        public DateTime CreatedOn { get; set; }
        public NotificationActionType NotificationActionType { get; set; }
    }
}