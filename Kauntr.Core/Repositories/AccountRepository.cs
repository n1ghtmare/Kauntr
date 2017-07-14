using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

using Dapper;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Core.Repositories {
    public class AccountRepository : IAccountRepository {
        private readonly string _connectionString;

        private IDbConnection Connection => new SqlConnection(_connectionString);

        public AccountRepository(IConfigurationService configurationService) {
            _connectionString = configurationService.DatabaseConnectionString;
        }

        public async Task<Account> GetByEmailAsync(string email) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"SELECT
	                    Id,
	                    DisplayName,
	                    Email,
	                    CreatedOn,
	                    Reputation,
	                    IsAutoSetup
                    FROM Accounts
                    WHERE Email = @email";
                return (await connection.QueryAsync<Account>(sql, new {email})).FirstOrDefault();
            }
        }

        public async Task CreateAsync(Account account) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"INSERT Accounts (DisplayName, Email, CreatedOn, Reputation, IsAutoSetup)
                    OUTPUT INSERTED.Id
                    VALUES(@DisplayName, @Email, @CreatedOn, @Reputation, @IsAutoSetup)";
                account.Id = (await connection.QueryAsync<int>(sql, account)).Single();
            }
        }

        public async Task<Account> GetAsync(int id) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"SELECT
	                    Id,
	                    DisplayName,
	                    Email,
	                    CreatedOn,
	                    Reputation,
	                    IsAutoSetup
                    FROM Accounts
                    WHERE Id = @id";
                return (await connection.QueryAsync<Account>(sql, new { id })).FirstOrDefault();
            }
        }
    }
}

