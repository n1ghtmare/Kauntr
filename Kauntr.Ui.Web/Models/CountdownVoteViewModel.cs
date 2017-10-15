﻿using System.ComponentModel.DataAnnotations;

namespace Kauntr.Ui.Web.Models {
    public class CountdownVoteViewModel {
        [Required]
        public long CountdownId { get; set; }

        [Required]
        [Range(-1, 1)]
        public short Value { get; set; }

        public short? ExistingValue { get; set; }
    }
}