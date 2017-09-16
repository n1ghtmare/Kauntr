using System;

namespace Kauntr.Core.Entities {
    public class Comment {
        public long Id { get; set; }
        public long CountdownId { get; set; }
        public string Text { get; set; }
        public int CreatedByAccountId { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
