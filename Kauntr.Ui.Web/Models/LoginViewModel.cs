using System.ComponentModel.DataAnnotations;

namespace Kauntr.Ui.Web.Models {
    public class LoginViewModel {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string ReturnUrl { get; set; }

        public string Token { get; set; }
    }
}