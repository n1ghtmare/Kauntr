using System;
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

        public async Task<int> GetTotalCountAsync(DateTime? endsAfter) {
            using (IDbConnection connection = Connection) {
                const string sql = "SELECT COUNT(Id) FROM Countdowns WHERE EndsOn >= ISNULL(@endsAfter, EndsOn)";
                return await connection.ExecuteScalarAsync<int>(sql, new {endsAfter});
            }
        }

        public async Task<IEnumerable<CountdownAggregate>> GetAggregatesAsync(CountdownFilter countdownFilter) {
            using (IDbConnection connection = Connection) {
                string sql =
                    $@"SELECT TOP {countdownFilter.Limit} Q.* FROM (
	                    SELECT T.*, ROW_NUMBER() OVER ({BuildAggregateOrderBy(countdownFilter.DisplayOrderType)}) AS RN FROM (
		                    SELECT
			                    c.Id,
			                    c.Description,
			                    c.CreatedByAccountId,
			                    c.CreatedOn,
			                    c.EndsOn,
			                    a.DisplayName AS CreatedByDisplayName,
			                    a.Email AS CreatedByEmail,
			                    ISNULL((SELECT SUM(Value) FROM Votes WHERE CountdownId = c.Id), 0) AS VoteScore,
			                    (SELECT Value FROM Votes WHERE CountdownId = c.Id AND CastedByAccountId = @CurrentUserAccountId) AS CurrentUserVote,
			                    (SELECT COUNT(Id) FROM Comments WHERE CountdownId = c.Id) AS CommentsCount
		                    FROM Countdowns c
		                    INNER JOIN Accounts a ON c.CreatedByAccountId = a.Id
                            WHERE c.EndsOn >= ISNULL(@EndsAfter, EndsOn)
	                    ) AS T
                    ) AS Q
                    WHERE Q.RN > {(countdownFilter.Page - 1)*countdownFilter.Limit} ORDER BY Q.RN";
                return await connection.QueryAsync<CountdownAggregate>(sql, countdownFilter);
            }
        }

        private static string BuildAggregateOrderBy(CountdownDisplayOrderType displayOrderType) {
            switch (displayOrderType) {
                case CountdownDisplayOrderType.Oldest:
                    return "ORDER BY T.CreatedON ASC";
                case CountdownDisplayOrderType.Trending:
                    return "ORDER BY T.VoteScore DESC, T.CommentsCount DESC";
                case CountdownDisplayOrderType.EndingOn:
                    return "ORDER BY T.EndsOn ASC";
                default: // Latest
                    return "ORDER BY T.CreatedON DESC";
            }
        }
    }
}