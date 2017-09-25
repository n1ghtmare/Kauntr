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

        public async Task<IEnumerable<CommentAggregate>> GetAggregatesAsync(CommentFilter commentFilter) {
            using (IDbConnection connection = Connnection) {
                // TODO - Add dynamic "ORDER BY"
                string sql =
                    $@"SELECT TOP {commentFilter.Limit} Q.* FROM (
	                    SELECT T.*, ROW_NUMBER() OVER ({BuildAggregateOrderBy(commentFilter.DisplayOrderType)}) AS RN FROM (
		                    SELECT
			                    c.Id,
			                    c.CountdownId,
			                    c.Text,
			                    c.CreatedByAccountId,
			                    c.CreatedOn,
			                    a.DisplayName AS CreatedByDisplayName,
			                    a.Email AS CreatedByEmail,
			                    ISNULL((SELECT SUM(Value) FROM Votes WHERE CommentId = c.Id), 0) AS VoteScore,
			                    (SELECT VALUE FROM Votes WHERE CommentId = c.Id AND CastedByAccountId = @CurrentUserAccountId) AS CurrentUserVote
		                    FROM Comments c
		                    INNER JOIN Accounts a ON c.CreatedByAccountId = a.Id
                            WHERE c.CountdownId = @CountdownId
	                    ) AS T
                    ) AS Q
                    WHERE Q.RN > {(commentFilter.Page - 1) * commentFilter.Limit} ORDER BY Q.RN";
                return await connection.QueryAsync<CommentAggregate>(sql, commentFilter);
            }
        }

        private static string BuildAggregateOrderBy(CommentDisplayOrderType displayOrderType) {
            switch (displayOrderType) {
                case CommentDisplayOrderType.Best:
                    return "ORDER BY T.VoteScore DESC";
                case CommentDisplayOrderType.Oldest:
                    return "ORDER BY T.CreatedOn ASC";
                default: // Latest
                    return "ORDER BY T.CreatedOn DESC";
            }
        }
    }
}