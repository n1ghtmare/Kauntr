using System.Collections.Generic;
using System.Threading.Tasks;

using Kauntr.Core.Entities;

namespace Kauntr.Core.Interfaces {
    public interface ICountdownRepository {
        Task CreateAsync(Countdown countdown);
        Task<CountdownAggregate> GetAggregateAsync(long id, int? currentUserAccountId = null);
        Task<IEnumerable<CountdownAggregate>> GetTrendingAsync(int page, int limit, int? currentUserAccountId = null);
        Task<IEnumerable<CountdownAggregate>> GetLatestAsync(int page, int limit, int? currentAccountId = null);
        Task<IEnumerable<CountdownAggregate>> GetMineAsync(int page, int limit, int currentAccountId);
        Task<int> GetTotalActiveCountAsync(int? currentUserAccountId = null);
    }
}
