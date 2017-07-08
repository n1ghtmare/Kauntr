using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;

using Owin;

[assembly: OwinStartupAttribute(typeof(Kauntr.Ui.Web.Startup))]

namespace Kauntr.Ui.Web {
    public class Startup {
        public void Configuration(IAppBuilder app) {
            app.UseCookieAuthentication(new CookieAuthenticationOptions {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie
            });
        }
    }
}