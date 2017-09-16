using System;

namespace Kauntr.Core.Entities {
    public class CommentAggregate {
        public long Id { get; set; }
        public string Text { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedByAccountId { get; set; }
        public string CreatedByDisplayName { get; set; }
        public string CreatedByEmail { get; set; }
        public int VoteScore { get; set; }
        public short? CurrentUserVote { get; set; }
    }
}
