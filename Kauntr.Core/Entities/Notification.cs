using System;

namespace Kauntr.Core.Entities {
    public class Notification {
        public long Id { get; set; }
        public int OwnedByAccountId { get; set; }
        public DateTime? ViewedOn { get; set; }
        public long? CountdownId { get; set; }
        public long? CommentId { get; set; }
    }
}
