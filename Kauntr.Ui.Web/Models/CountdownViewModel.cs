using System;

namespace Kauntr.Ui.Web.Models {
    public class CountdownViewModel {
        public long Id { get; set; }
        public string Description { get; set; }
        public DateTime EndsOn { get; set; }
        public int CommentsCount { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedByAccountId { get; set; }
        public string CreatedByDisplayName { get; set; }
        public string CreatedByGravatarUrl { get; set; }
        public int VoteScore { get; set; }
        public short? CurrentUserVote { get; set; }
        public bool IsCreatedByCurrentUser { get; set; }
    }
}