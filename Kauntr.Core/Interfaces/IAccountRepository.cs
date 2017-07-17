using System.Threading.Tasks;

using Kauntr.Core.Entities;

namespace Kauntr.Core.Interfaces {
    public interface IAccountRepository {
        Task<Account> GetByEmailAsync(string email);
        Task CreateAsync(Account account);
        Task<Account> GetAsync(int id);
        Task UpdateAsync(Account account);
    }
}
