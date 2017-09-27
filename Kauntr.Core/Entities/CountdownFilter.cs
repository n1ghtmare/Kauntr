﻿using System;

namespace Kauntr.Core.Entities {
    public class CountdownFilter {
        public int Page { get; set; }
        public int Limit { get; set; }
        public int? CurrentUserAccountId { get; set; }
        public CountdownDisplayOrderType DisplayOrderType { get; set; }
        public DateTime? EndsAfter { get; set; }
    }
}