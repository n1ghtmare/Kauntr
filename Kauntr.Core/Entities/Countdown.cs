using System;

namespace Kauntr.Core.Entities {
    public class Countdown {
        public long Id { get; set; }
        public string Description { get; set; }
        public DateTime EndsOn { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedByAccountId { get; set; }
        public DateTime? DeletedOn { get; set; }
    }
}
