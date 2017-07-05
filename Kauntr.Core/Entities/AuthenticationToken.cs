using System;

namespace Kauntr.Core.Entities {
    public class AuthenticationToken {
        public Guid Id { get; set; }
        public int AccountId { get; set; }
        public string Token { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ExpiresOn { get; set; }
        public bool IsUsed { get; set; }
        public short NumberOfTokensSent { get; set; }
        public DateTime? LastSentOn { get; set; }
    }
}