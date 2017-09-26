using System.Collections.Generic;
using System.Threading.Tasks;

using Kauntr.Core.Entities;

namespace Kauntr.Core.Interfaces {
    public interface ICountdownRepository {
        Task CreateAsync(Countdown countdown);
        Task<CountdownAggregate> GetAggregateAsync(long id, int? currentUserAccountId = null);
        Task<IEnumerable<CountdownAggregate>> GetAggregatesAsync(CountdownFilter countdownFilter);
        Task<IEnumerable<CountdownAggregate>> GetAggregatesByAccountIdAsync(int page, int limit, int currentAccountId);
        Task<int> GetTotalCountAsync();
        Task<int> GetTotalCountByAccountId(int currentAccountId);
    }
}
