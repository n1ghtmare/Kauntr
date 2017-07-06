using System.Configuration;

using Kauntr.Core.Interfaces;

namespace Kauntr.Core.Services {
    public class ConfigurationService : IConfigurationService {
        public string DatabaseConnectionString => ConfigurationManager.ConnectionStrings["DatabaseConnectionString"].ConnectionString;
    }
}
