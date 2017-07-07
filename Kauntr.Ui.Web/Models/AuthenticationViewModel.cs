using System.ComponentModel.DataAnnotations;

namespace Kauntr.Ui.Web.Models {
    public class AuthenticationViewModel {
        [Required]
        public int AccountId { get; set; }
        [Required]
        public string Token { get; set; }
    }
}