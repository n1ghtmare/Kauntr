using System;

namespace Kauntr.Core.Entities {
    public class NotificationAggregate {
        public long Id { get; set; }
        public int OwnedByAccountId { get; set; }
        public DateTime? LastChangeOn { get; set; }
        public long? CountdownId { get; set; }
        public long? CommentId { get; set; }

        public int UpvoteActions { get; set; }
        public int DownvoteActions { get; set; }
        public int CommentActions { get; set; }

        // Will be dynamically generated through code based on the type of notification (Countdown or Comment) and the upvotes/downvotes/comments count
        public string Summary { get; set; }
    }
}