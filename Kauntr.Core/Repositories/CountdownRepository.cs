using System.Collections.Generic;
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
                countdown.Id = await connection.QuerySingleOrDefaultAsync<long>(sql, countdown);
            }
        }

        public async Task<CountdownAggregate> GetAggregateAsync(long id, int? currentUserAccountId = null) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"SELECT
                        c.Id,
                        c.Description,
                        c.CreatedByAccountId,
                        c.CreatedOn,
                        c.EndsOn,
                        a.DisplayName AS CreatedByDisplayName,
                        a.Email AS CreatedByEmail,
                        ISNULL((SELECT SUM(Value) FROM Votes WHERE CountdownId = c.Id), 0) AS VoteScore,
                        (SELECT Value FROM Votes WHERE CountdownId = c.Id AND CastedByAccountId = @currentUserAccountId) AS CurrentUserVote,
                        (SELECT COUNT(Id) FROM Comments WHERE CountdownId = c.Id) AS CommentsCount
                    FROM Countdowns c
                    INNER JOIN Accounts a ON c.CreatedByAccountId = a.Id
                    WHERE c.Id = @id";
                return await connection.QueryFirstOrDefaultAsync<CountdownAggregate>(sql, new {id, currentUserAccountId});
            }
        }

        public Task<IEnumerable<CountdownAggregate>> GetTrendingAsync(int page, int limit, int? currentUserAccountId = null) {
            throw new System.NotImplementedException();
        }

        public Task<IEnumerable<CountdownAggregate>> GetLatestAsync(int page, int limit, int? currentAccountId = null) {
            throw new System.NotImplementedException();
        }

        public Task<IEnumerable<CountdownAggregate>> GetMineAsync(int page, int limit, int currentAccountId) {
            throw new System.NotImplementedException();
        }

        public Task<int> GetTotalActiveCountAsync(int? currentUserAccountId = null) {
            throw new System.NotImplementedException();
        }
    }
}