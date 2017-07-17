using System.ComponentModel.DataAnnotations;

namespace Kauntr.Ui.Web.Models {
    public class AccountUpdateViewModel {
        [Required]
        [MinLength(3)]
        public string DisplayName { get; set; }

        // TODO - add more properties that the user can update?
    }
}