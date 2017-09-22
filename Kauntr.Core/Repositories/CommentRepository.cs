using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

using Dapper;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Core.Repositories {
    public class CommentRepository : ICommentRepository {
        private readonly string _connectionString;

        private IDbConnection Connnection => new SqlConnection(_connectionString);

        public CommentRepository(IConfigurationService configurationService) {
            _connectionString = configurationService.DatabaseConnectionString;
        }

        public async Task CreateAsync(Comment comment) {
            using (IDbConnection connection = Connnection) {
                const string sql =
                    @"INSERT INTO Comments (CountdownId, Text, CreatedByAccountId, CreatedOn)
                    OUTPUT INSERTED.Id
                    VALUES (@CountdownId, @Text, @CreatedByAccountId, @CreatedOn)";
                comment.Id = await connection.QuerySingleOrDefaultAsync<long>(sql, comment);
            }
        }

        public async Task<int> GetTotalAsync(long countdownId) {
            using (IDbConnection connection = Connnection) {
                const string sql = "SELECT COUNT(Id) FROM Comments WHERE CountdownId = @countdownId";
                return await connection.ExecuteScalarAsync<int>(sql, new {countdownId});
            }
        }

        public async Task<IEnumerable<CommentAggregate>> GetAggregatesAsync(long countdownId, int page, int limit, int? currentUserAccountId = null) {
            using (IDbConnection connection = Connnection) {
                // TODO - Add dynamic "ORDER BY"
                string sql =
                    $@"SELECT TOP {limit} Q.* FROM (
	                    SELECT T.*, ROW_NUMBER() OVER (ORDER BY T.CreatedOn DESC) AS RN FROM (
		                    SELECT
			                    c.Id,
			                    c.CountdownId,
			                    c.Text,
			                    c.CreatedByAccountId,
			                    c.CreatedOn,
			                    a.DisplayName AS CreatedByDisplayName,
			                    a.Email AS CreatedByEmail,
			                    ISNULL((SELECT SUM(Value) FROM Votes WHERE CommentId = c.Id), 0) AS VoteScore,
			                    (SELECT VALUE FROM Votes WHERE CommentId = c.Id AND CastedByAccountId = @currentUserAccountId) AS CurrentUserVote
		                    FROM Comments c
		                    INNER JOIN Accounts a ON c.CreatedByAccountId = a.Id
                            WHERE c.CountdownId = @countdownId
	                    ) AS T
                    ) AS Q
                    WHERE Q.RN > {(page - 1) * limit} ORDER BY Q.RN";
                return await connection.QueryAsync<CommentAggregate>(sql, new {countdownId, currentUserAccountId});
            }
        }
    }
}