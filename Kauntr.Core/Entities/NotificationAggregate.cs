using System;

namespace Kauntr.Core.Entities {
    public class NotificationAggregate {
        public long Id { get; set; }
        public int OwnedByAccountId { get; set; }
        public DateTime? LastChangedOn { get; set; }
        public long? CountdownId { get; set; }
        public long? CommentId { get; set; }

        public int UpvoteActions { get; set; }
        public int DownvoteActions { get; set; }
        public int CommentActions { get; set; }
        public string CommentContent { get; set; }
        public string CountdownContent { get; set; }
    }
}