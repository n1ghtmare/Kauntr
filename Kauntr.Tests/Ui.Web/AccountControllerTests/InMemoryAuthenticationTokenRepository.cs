using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Tests.Ui.Web.AccountControllerTests {
    public class InMemoryAuthenticationTokenRepository : IAuthenticationTokenRepository {
        public List<AuthenticationToken> AuthenticationTokens { get; set; } = new List<AuthenticationToken>();
        public short NumberOfTimesUpdateWasInvoked { get; private set; } = 0;

        public Task CreateAsync(AuthenticationToken authenticationToken) {
            return Task.Run(() => AuthenticationTokens.Add(authenticationToken));
        }

        public Task UpdateAsync(AuthenticationToken authenticationToken) {
            NumberOfTimesUpdateWasInvoked++;
            return Task.FromResult<object>(null);
        }

        public Task<AuthenticationToken> GetActiveByAccountIdAsync(int accountId) {
            return Task.Run(() => AuthenticationTokens.FirstOrDefault(x => x.AccountId == accountId));
        }
    }
}