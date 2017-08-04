using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

using NUnit.Framework;

using Kauntr.Core.Entities;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Tests.Ui.Web.CountdownControllerTests {
    [TestFixture]
    public class Trending {
        [Test]
        public async Task GetRequest_ReturnsCountdownListViewModel() {
            TestableCountdownController controller = TestableCountdownController.Create();

            JsonResult result = await controller.Trending() as JsonResult;

            Assert.IsNotNull(result);

            CountdownListViewModel model = result.Data as CountdownListViewModel;
            Assert.IsNotNull(model);
        }

        [Test]
        public async Task GetRequest_ReturnsCorrectAModelWithCorrectNumberOfCountdowns() {
            TestableCountdownController controller = TestableCountdownController.Create();

            controller.CountdownRepository.CountdownAggregates.Add(new CountdownAggregate());
            controller.CountdownRepository.CountdownAggregates.Add(new CountdownAggregate());
            controller.CountdownRepository.CountdownAggregates.Add(new CountdownAggregate());

            JsonResult result = await controller.Trending(1) as JsonResult;

            Assert.IsNotNull(result);

            CountdownListViewModel model = result.Data as CountdownListViewModel;
            Assert.IsNotNull(model);
            Assert.AreEqual(3, model.Countdowns.Count());
            Assert.AreEqual(1, model.Page);
        }
    }
}
