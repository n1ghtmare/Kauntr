using System.Web.Optimization;

namespace Kauntr.Ui.Web {
    public class BundleConfig {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles) {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                "~/Scripts/jquery.validate*"));

            bundles.Add(new StyleBundle("~/Content/css/styles").Include(
                "~/Content/css/font-awesome.css",
                "~/Content/css/base.css",
                "~/Content/css/grid1140/ie.css",
                "~/Content/css/grid1140/1140.css",
                "~/Content/css/animate-custom.css",
                "~/Content/css/site.css"));
        }
    }
}