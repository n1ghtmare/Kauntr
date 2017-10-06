using System;

namespace Kauntr.Core.Entities {
    public class CountdownSubFilter {
        public DateTime? EndsAfter { get; set; }
        public string Query { get; set; }
        public int? CreatedByUserAccountId { get; set; }
    }
}