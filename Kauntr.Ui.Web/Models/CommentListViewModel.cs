using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

using Kauntr.Core.Entities;

namespace Kauntr.Ui.Web.Models {
    public class CommentListViewModel {
        public IEnumerable<CommentViewModel> Comments { get; set; }

        [Required]
        public long CountdownId { get; set; }

        [Required]
        public int Page { get; set; }

        public CommentDisplayOrderType DisplayOrderType { get; set; }

        public int Total { get; set; }

        [Required]
        public int Token { get; set; }
    }
}