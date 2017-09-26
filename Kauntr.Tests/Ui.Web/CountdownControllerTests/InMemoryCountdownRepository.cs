using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Tests.Ui.Web.CountdownControllerTests {
    public class InMemoryCountdownRepository : ICountdownRepository {
        private long _fakeId;

        public List<Countdown> Countdowns { get; set; } = new List<Countdown>();
        public List<CountdownAggregate> CountdownAggregates { get; set; }  = new List<CountdownAggregate>();

        public async Task CreateAsync(Countdown countdown) {
            countdown.Id = ++_fakeId;
            await Task.Run(() => Countdowns.Add(countdown));
        }

        public Task<CountdownAggregate> GetAggregateAsync(long id, int? currentUserAccountId = null) {
            return Task.Run(() => CountdownAggregates.FirstOrDefault(x => x.Id == id));
        }

        public Task<IEnumerable<CountdownAggregate>> GetAggregatesAsync(CountdownFilter countdownFilter) {
            return Task.Run(() => CountdownAggregates.AsEnumerable());
        }

        public Task<IEnumerable<CountdownAggregate>> GetAggregatesByAccountIdAsync(int page, int limit, int currentAccountId) {
            return Task.Run(() => CountdownAggregates.AsEnumerable());
        }

        public Task<int> GetTotalCountAsync() {
            return Task.Run(() => CountdownAggregates.Count);
        }

        public Task<int> GetTotalCountByAccountId(int currentAccountId) {
            return Task.Run(() => CountdownAggregates.Count);
        }
    }
}
