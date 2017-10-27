using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

using Dapper;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Core.Repositories {
    public class NotificationRepository : INotificationRepository {
        private readonly string _connectionString;

        private IDbConnection Connection => new SqlConnection(_connectionString);

        public NotificationRepository(IConfigurationService configurationService) {
            _connectionString = configurationService.DatabaseConnectionString;
        }

        public async Task CreateAsync(Notification notification) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"INSERT INTO Notifications (OwnedByAccountId, ViewedOn, CountdownId, CommentId)
                    OUTPUT INSERTED.Id
                    VALUES (@OwnedByAccountId, ViewedOn, CountdownId, CommentId)";
                notification.Id = await connection.QuerySingleOrDefaultAsync<long>(sql, notification);
            }
        }

        public async Task CreateAsync(NotificationChange notificationChange) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"INSERT INTO NotificationChanges (NotificationId, CreatedByAccountId, CreatedOn, NotificationActionTypeId)
                    OUTPUT INSERTED.Id
                    VALUES (@NotificationId, @CreatedByAccountId, @CreatedOn, @NotificationActionType)";
                notificationChange.Id = await connection.QuerySingleOrDefaultAsync<long>(sql, notificationChange);
            }
        }

        public async Task<Notification> GetByCountdownIdAsync(long countdownId, int ownedByAccountId) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"SELECT
	                    Id,
	                    OwnedByAccountId,
	                    ViewedOn,
	                    CountdownId,
	                    CommentId
                    FROM Notifications
                    WHERE ViewedOn IS NULL
                    AND CountdownId = @countdownId
                    AND OwnedByAccountId = @ownedByAccountId";
                return await connection.QuerySingleOrDefaultAsync<Notification>(sql, new {countdownId, ownedByAccountId});
            }
        }

        public async Task<int> GetTotalCountAsync(int ownedByAccountId) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"SELECT
	                    COUNT(Id)
                    FROM Notifications
                    WHERE ViewedOn IS NULL
                    AND OwnedByAccountId = @ownedByAccountId";
                return await connection.ExecuteScalarAsync<int>(sql, new {ownedByAccountId});
            }
        }
    }
}
