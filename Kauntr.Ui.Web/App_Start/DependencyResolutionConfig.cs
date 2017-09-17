using System.Web.Mvc;

using Autofac;
using Autofac.Integration.Mvc;

using Kauntr.Core.Helpers;
using Kauntr.Core.Interfaces;
using Kauntr.Core.Repositories;
using Kauntr.Core.Services;
using Kauntr.Ui.Web.Services;

namespace Kauntr.Ui.Web {
    public class DependencyResolutionConfig {
        public static void Register() {
            var autofacBuilder = new ContainerBuilder();

            autofacBuilder.RegisterType<AccountRepository>().As<IAccountRepository>().InstancePerRequest();
            autofacBuilder.RegisterType<CountdownRepository>().As<ICountdownRepository>().InstancePerRequest();
            autofacBuilder.RegisterType<CommentRepository>().As<ICommentRepository>().InstancePerRequest();
            autofacBuilder.RegisterType<AuthenticationTokenRepository>().As<IAuthenticationTokenRepository>().InstancePerRequest();
            autofacBuilder.RegisterType<ConfigurationService>().As<IConfigurationService>().InstancePerRequest();
            autofacBuilder.RegisterType<NotificationService>().As<INotificationService>().InstancePerRequest();
            autofacBuilder.RegisterType<ContextService>().As<IContextService>().InstancePerRequest();
            autofacBuilder.RegisterType<SystemClock>().As<ISystemClock>().InstancePerRequest();

            autofacBuilder.RegisterControllers(typeof (MvcApplication).Assembly);
            IContainer container = autofacBuilder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }
    }
}