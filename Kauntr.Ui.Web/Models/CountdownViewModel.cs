using System;
using System.ComponentModel.DataAnnotations;

namespace Kauntr.Ui.Web.Models {
    public class CountdownViewModel {
        public enum CountdownType {
            Duration,
            Date
        }

        public enum DurationType {
            Seconds,
            Minutes,
            Hours,
            Days,
            Months,
            Years
        }

        public CountdownType SelectedCountdownType { get; set; }
        public DurationType SelectedDurationType { get; set; }

        [Required]
        [MinLength(3)]
        [StringLength(50)]
        public string Description { get; set; }

        public int Duration { get; set; }

        public int EndsOnYear { get; set; }
        public int EndsOnMonth { get; set; }
        public int EndsOnDay { get; set; }
        public int? EndsOnHour { get; set; }
        public int? EndsOnMinute { set; get; }

        public DateTime EndsOn { get; set; }
    }
}