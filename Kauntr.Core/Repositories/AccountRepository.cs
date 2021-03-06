﻿using System.Data;
using System.Data.SqlClient;
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
                return await connection.QueryFirstOrDefaultAsync<Account>(sql, new {email});
            }
        }

        public async Task CreateAsync(Account account) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"INSERT Accounts (DisplayName, Email, CreatedOn, Reputation, IsAutoSetup)
                    OUTPUT INSERTED.Id
                    VALUES (@DisplayName, @Email, @CreatedOn, @Reputation, @IsAutoSetup)";
                account.Id = await connection.QuerySingleOrDefaultAsync<int>(sql, account);
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
                return await connection.QueryFirstOrDefaultAsync<Account>(sql, new { id });
            }
        }

        public async Task UpdateAsync(Account account) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"UPDATE Accounts SET
                        DisplayName = @DisplayName,
                        Reputation = @Reputation,
                        Email = @Email,
                        IsAutoSetup = @IsAutoSetup
                    WHERE Id = @Id";
                await connection.ExecuteAsync(sql, account);
            }
        }
    }
}

