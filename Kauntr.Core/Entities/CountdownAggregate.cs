using System;

namespace Kauntr.Core.Entities {
    public class CountdownAggregate {
        public long Id { get; set; }
        public string Description { get; set; }
        public DateTime EndsOn { get; set; }
        public int CommentsCount { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedByAccountId { get; set; }
        public string CreatedByDisplayName { get; set; }
        public string CreatedByEmail { get; set; }
        public int VoteScore { get; set; }
        public short? CurrentUserVote { get; set; }
        public bool IsCreatedByCurrentUser { get; set; }
    }
}
