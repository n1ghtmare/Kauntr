using System;

namespace Kauntr.Ui.Web.Models {
    public class CommentViewModel {
        public long Id { get; set; }
        public string Text { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedByAccountId { get; set; }
        public string CreatedByDisplayName { get; set; }
        public string CreatedByGravatarUrl { get; set; }
        public int VoteScore { get; set; }
        public short? CurrentUserVote { get; set; }
    }
}