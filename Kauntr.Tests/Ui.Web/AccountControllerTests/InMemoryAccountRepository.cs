using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Tests.Ui.Web.AccountControllerTests {
    public class InMemoryAccountRepository : IAccountRepository {
        public List<Account> Accounts { get; set; } = new List<Account>();
        public short NumberOfTimesUpdateWasInvoked { get; private set; } = 0;

        public Task<Account> GetByEmailAsync(string email) {
            return Task.Run(() => Accounts.FirstOrDefault(x => x.Email == email));
        }

        public Task CreateAsync(Account account) {
            return Task.Run(() => Accounts.Add(account));
        }

        public Task<Account> GetAsync(int id) {
            return Task.Run(() => Accounts.FirstOrDefault(x => x.Id == id));
        }

        public Task UpdateAsync(Account account) {
            NumberOfTimesUpdateWasInvoked++;
            return Task.FromResult<object>(null);
        }
    }
}