using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

using Dapper;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Core.Repositories {
    public class AuthenticationTokenRepository : IAuthenticationTokenRepository {
        private readonly string _connectionString;

        private IDbConnection Connection => new SqlConnection(_connectionString);

        public AuthenticationTokenRepository(IConfigurationService configurationService) {
            _connectionString = configurationService.DatabaseConnectionString;
        }

        public async Task CreateAsync(AuthenticationToken authenticationToken) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"INSERT INTO AuthenticationTokens (AccountId, Token, CreatedOn, ExpiresOn, IsUsed, NumberOfTimesSent, LastSentOn)
                    OUTPUT INSERTED.Id
                    VALUES (@AccountId, @Token, @CreatedOn, @ExpiresOn, @IsUsed, @NumberOfTimesSent, @LastSentOn)";
                authenticationToken.Id = (await connection.QueryAsync<Guid>(sql, authenticationToken))
                    .Single();
            }
        }

        public async Task UpdateAsync(AuthenticationToken authenticationToken) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"UPDATE AuthenticationTokens SET
	                    AccountId = @AccountId,
	                    CreatedOn = @CreatedOn,
	                    ExpiresOn = @ExpiresOn,
	                    IsUsed = @IsUsed,
	                    NumberOfTimesSent = @NumberOfTimesSent,
	                    LastSentOn = @LastSentOn
                    WHERE Id = @Id";
                await connection.ExecuteAsync(sql, authenticationToken);
            }
        }

        public async Task<AuthenticationToken> GetActiveByAccountIdAsync(int accountId) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"SELECT
	                    Id,
	                    AccountId,
	                    Token,
	                    CreatedOn,
	                    ExpiresOn,
	                    IsUsed,
	                    NumberOfTimesSent,
	                    LastSentOn
                    FROM AuthenticationTokens
                    WHERE AccountId = @accountId
                    AND ExpiresOn >= @expiresOn";
                return (await connection.QueryAsync<AuthenticationToken>(sql, new {accountId, expiresOn = DateTime.UtcNow}))
                    .FirstOrDefault();
            }
        }
    }
}