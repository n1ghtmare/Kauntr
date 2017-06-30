using System.Web.Mvc;

using Autofac;
using Autofac.Integration.Mvc;

namespace Kauntr.Ui.Web {
    public class DependencyResolutionConfig {
        public static void Register() {
            var autofacBuilder = new ContainerBuilder();

            autofacBuilder.RegisterControllers(typeof (MvcApplication).Assembly);
            IContainer container = autofacBuilder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }
    }
}