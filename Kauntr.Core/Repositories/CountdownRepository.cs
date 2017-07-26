using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

using Dapper;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Core.Repositories {
    public class CountdownRepository : ICountdownRepository {
        private readonly string _connectionString;

        private IDbConnection Connection => new SqlConnection(_connectionString);

        public CountdownRepository(IConfigurationService configurationService) {
            _connectionString = configurationService.DatabaseConnectionString;
        }

        public async Task CreateAsync(Countdown countdown) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"INSERT INTO Countdowns (Description, EndsOn, CreatedOn, CreatedByAccountId)
                    OUTPUT INSERTED.Id
                    VALUES (@Description, @EndsOn, @CreatedOn, @CreatedByAccountId)";
                countdown.Id = await connection.QueryFirstOrDefaultAsync<long>(sql, countdown);
            }
        }
    }
}