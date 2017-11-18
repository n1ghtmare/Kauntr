using System.Collections.Generic;
using System.Threading.Tasks;

using Kauntr.Core.Entities;

namespace Kauntr.Core.Interfaces {
    public interface ICountdownRepository {
        Task<Countdown> GetAsync(long id);
        Task CreateAsync(Countdown countdown);
        Task<CountdownAggregate> GetAggregateAsync(long id, int? currentUserAccountId = null);
        Task<int> GetTotalCountAsync(CountdownSubFilter subFilter);
        Task<IEnumerable<CountdownAggregate>> GetAggregatesAsync(CountdownFilter filter);
        Task UpdateAsync(Countdown countdown);
    }
}
