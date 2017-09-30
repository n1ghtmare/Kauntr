using System;

namespace Kauntr.Core.Entities {
    public class Account {
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public int Reputation { get; set; }
        public DateTime CreatedOn { get; set; }
        public bool IsAutoSetup { get; set; }
        public string GravatarUrl { get; set; }
    }
}