using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(FileManager.Startup))]
namespace FileManager
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
