using System.Collections.Generic;

using Kauntr.Core.Entities;

namespace Kauntr.Ui.Web.Models {
    public class CountdownListViewModel {
        public IEnumerable<CountdownAggregate> Countdowns { get; set; }
        public int Page { get; set; }
    }
}