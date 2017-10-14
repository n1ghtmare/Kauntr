using System;

namespace Kauntr.Core.Entities {
    public class Vote {
        public Guid Id { get; set; }
        public long? CountdownId { get; set; }
        public long? CommentId { get; set; }
        public short Value { get; set; }
        public int CastedByAccountId { get; set; }
        public DateTime CastedOn { get; set; }
    }
}