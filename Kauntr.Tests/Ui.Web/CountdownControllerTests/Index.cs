using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

using NUnit.Framework;

using Kauntr.Core.Entities;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Tests.Ui.Web.CountdownControllerTests {
    [TestFixture]
    public class Index {
        [Test]
        public async Task GetRequest_ReturnsCountdownListViewModel() {
            TestableCountdownController controller = TestableCountdownController.Create();

            var model = new CountdownListViewModel { Filter = new CountdownListFilter()};
            JsonResult result = await controller.Index(model) as JsonResult;

            Assert.IsNotNull(result);

            CountdownListViewModel resultModel = result.Data as CountdownListViewModel;
            Assert.IsNotNull(resultModel);
        }

        [Test]
        public async Task GetRequest_ReturnsCorrectAModelWithCorrectNumberOfCountdowns() {
            TestableCountdownController controller = TestableCountdownController.Create();

            controller.CountdownRepository.CountdownAggregates.Add(new CountdownAggregate());
            controller.CountdownRepository.CountdownAggregates.Add(new CountdownAggregate());
            controller.CountdownRepository.CountdownAggregates.Add(new CountdownAggregate());

            var model = new CountdownListViewModel {
                Page = 1,
                Token = 123,
                DisplayOrderType = CountdownDisplayOrderType.Latest,
                Filter = new CountdownListFilter()
            };

            JsonResult result = await controller.Index(model) as JsonResult;

            Assert.IsNotNull(result);

            CountdownListViewModel resultModel = result.Data as CountdownListViewModel;
            Assert.IsNotNull(resultModel);
            Assert.AreEqual(3, resultModel.Countdowns.Count());
            Assert.AreEqual(3, resultModel.Total);
            Assert.AreEqual(model.Page, resultModel.Page);
            Assert.AreEqual(model.Token, resultModel.Token);
            Assert.AreEqual(model.DisplayOrderType, resultModel.DisplayOrderType);
        }
    }
}
