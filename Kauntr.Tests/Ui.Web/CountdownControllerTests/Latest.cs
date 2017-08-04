using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

using NUnit.Framework;

using Kauntr.Core.Entities;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Tests.Ui.Web.CountdownControllerTests {
    [TestFixture]
    public class Latest {
        [Test]
        public async Task GetRequest_ReturnsCountdownListViewModel() {
            TestableCountdownController controller = TestableCountdownController.Create();

            JsonResult result = await controller.Latest(123) as JsonResult;

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

            const int token = 123;
            const int page = 5;
            JsonResult result = await controller.Latest(token, page) as JsonResult;

            Assert.IsNotNull(result);

            CountdownListViewModel model = result.Data as CountdownListViewModel;
            Assert.IsNotNull(model);
            Assert.AreEqual(3, model.Countdowns.Count());
            Assert.AreEqual(3, model.Total);
            Assert.AreEqual(page, model.Page);
            Assert.AreEqual(token, model.Token);
        }
    }
}