using System.Collections.Generic;

using Kauntr.Core.Entities;

namespace Kauntr.Ui.Web.Models {
    public class CountdownListViewModel {
        public IEnumerable<CountdownViewModel> Countdowns { get; set; }
        public int Page { get; set; }
        public int Total { get; set; }
        public CountdownDisplayOrderType DisplayOrderType { get; set; }
        public CountdownListFilter Filter { get; set; }
        public int Token { get; set; }
    }
}