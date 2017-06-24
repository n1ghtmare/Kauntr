using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Kauntr.Ui.Web.Startup))]
namespace Kauntr.Ui.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
