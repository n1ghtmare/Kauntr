using System.ComponentModel.DataAnnotations;

namespace Kauntr.Ui.Web.Models {
    public class CommentVoteViewModel {
        [Required]
        public long CommentId { get; set; }

        [Required]
        [Range(-1, 1)]
        public short Value { get; set; }
    }
}