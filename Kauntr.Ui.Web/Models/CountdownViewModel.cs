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

        [Required]
        public CountdownType SelectedCountdownType { get; set; }
        public DurationType SelectedDurationType { get; set; }

        [Required]
        [MinLength(3)]
        [StringLength(50)]
        public string Description { get; set; }

        [Range(0, maximum: int.MaxValue)]
        public int Duration { get; set; }

        [Range(0, maximum: int.MaxValue)]
        public int EndsOnYear { get; set; }

        [Range(0, maximum: int.MaxValue)]
        public int EndsOnMonth { get; set; }

        [Range(0, maximum: int.MaxValue)]
        public int EndsOnDay { get; set; }

        [Range(0, maximum: int.MaxValue)]
        public int? EndsOnHour { get; set; }

        [Range(0, maximum: int.MaxValue)]
        public int? EndsOnMinute { set; get; }

        public DateTime EndsOn { get; set; }
    }
}