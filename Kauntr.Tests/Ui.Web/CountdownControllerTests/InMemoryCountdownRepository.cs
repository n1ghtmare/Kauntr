using System.Collections.Generic;
using System.Threading.Tasks;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Tests.Ui.Web.CountdownControllerTests {
    public class InMemoryCountdownRepository : ICountdownRepository {
        public List<Countdown> Countdowns { get; set; } = new List<Countdown>();

        public async Task CreateAsync(Countdown countdown) {
            await Task.Run(() => Countdowns.Add(countdown));
        }
    }
}
