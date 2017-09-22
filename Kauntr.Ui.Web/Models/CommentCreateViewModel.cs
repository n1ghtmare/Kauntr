using System.ComponentModel.DataAnnotations;

namespace Kauntr.Ui.Web.Models {
    public class CommentCreateViewModel {
        [Required]
        public int CountdownId { get; set; }
        [Required]
        public string Text { get; set; }
    }
}