using System.Collections.Generic;
using System.Threading.Tasks;

using Kauntr.Core.Entities;

namespace Kauntr.Core.Interfaces {
    public interface ICountdownRepository {
        Task CreateAsync(Countdown countdown);
        Task<CountdownAggregate> GetAggregateAsync(long id, int? currentUserAccountId = null);
        Task<IEnumerable<CountdownAggregate>> GetTrendingAsync(int page, int limit, int? currentUserAccountId = null);
    }
}
