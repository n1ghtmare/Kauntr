namespace Kauntr.Core.Entities {
    public class CommentFilter {
        public long CountdownId { get; set; }
        public int Page { get; set; }
        public int Limit { get; set; }
        public int? CurrentUserAccountId { get; set; }
        public CommentDisplayOrderType DisplayOrderType { get; set; }
    }
}
