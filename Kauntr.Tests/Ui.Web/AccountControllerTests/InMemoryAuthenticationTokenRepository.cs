using System.Collections.Generic;
using System.Threading.Tasks;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Tests.Ui.Web.AccountControllerTests {
    public class InMemoryAuthenticationTokenRepository : IAuthenticationTokenRepository {
        public List<AuthenticationToken> AuthenticationTokens { get; set; } = new List<AuthenticationToken>();

        public Task CreateAsync(AuthenticationToken authenticationToken) {
            return Task.Run(() => AuthenticationTokens.Add(authenticationToken));
        }
    }
}