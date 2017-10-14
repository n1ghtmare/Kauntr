using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

using Dapper;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Core.Repositories {
    public class VoteRepository : IVoteRepository {
        private readonly string _connectionString;

        private IDbConnection Connection => new SqlConnection(_connectionString);

        public VoteRepository(IConfigurationService configurationService) {
            _connectionString = configurationService.DatabaseConnectionString;
        }

        public async Task<Vote> GetByCommentIdAsync(long commentId, int accountId) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"SELECT
	                    Id,
                        CountdownId,
                        CommentId,
	                    Value,
	                    CastedByAccountId,
	                    CastedOn
                    FROM Votes
                    WHERE CommentId = @commentId
                    AND CreatedByAccountId = @accountId";
                return await connection.QueryFirstOrDefaultAsync<Vote>(sql, new {commentId, accountId});
            }
        }

        public async Task<Vote> GetByCountdownIdAsync(long countdownId, int accountId) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"SELECT
	                    Id,
                        CountdownId,
                        CommentId,
	                    Value,
	                    CastedByAccountId,
	                    CastedOn
                    FROM Votes
                    WHERE CountdownId = @countdownId
                    AND CreatedByAccountId = @accountId";
                return await connection.QueryFirstOrDefaultAsync<Vote>(sql, new {countdownId, accountId});
            }
        }

        public async Task DeleteAsync(Guid id) {
            using (IDbConnection connection = Connection) {
                const string sql = "DELETE FROM Votes WHERE Id = @id";
                await connection.ExecuteAsync(sql, new {id});
            }
        }

        public async Task CreateAsync(Vote vote) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"INSERT INTO Votes (CountdownId, CommentId, Value, CastedByAccountId, CastedOn)
                    OUTPUT INSERTED.Id
                    VALUES (@CountdownId, @CommentId, @Value, @CastedByAccountId, @CastedOn)";
                vote.Id = await connection.QueryFirstOrDefaultAsync<Guid>(sql, vote);
            }
        }
    }
}