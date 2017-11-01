using System.Collections.Generic;
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
                    VALUES (@OwnedByAccountId, @ViewedOn, @CountdownId, @CommentId)";
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

        public async Task<IEnumerable<NotificationChange>> GetNotificationChangesAsync(long notificationId) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"SELECT
	                    NC.Id,
	                    NC.NotificationId,
	                    NC.CreatedByAccountId,
	                    NC.CreatedOn,
	                    NC.NotificationActionTypeId [NotificationActionType]
                    FROM NotificationChanges NC
                    INNER JOIN Notifications N ON NC.NotificationId = N.Id
                    WHERE NC.NotificationId = @notificationId
                    AND N.ViewedOn IS NULL";
                return await connection.QueryAsync<NotificationChange>(sql, new {notificationId});
            }
        }

        public async Task DeleteNotificationChangesAsync(IEnumerable<long> ids) {
            using (IDbConnection connection = Connection) {
                const string sql = "DELETE FROM NotificationChanges WHERE Id IN @ids";
                await connection.ExecuteAsync(sql, new {ids});
            }
        }

        public async Task DeleteAsync(long id) {
            using (IDbConnection connection = Connection) {
                const string sql = "DELETE FROM Notifications WHERE Id = @id";
                await connection.ExecuteAsync(sql, new {id});
            }
        }

        public async Task<IEnumerable<NotificationAggregate>> GetAggregatesAsync(int ownedByAccountId) {
            using (IDbConnection connection = Connection) {
                const string sql =
                    @"SELECT
	                    N.Id,
	                    N.OwnedByAccountId,
	                    (SELECT TOP 1 CreatedOn FROM NotificationChanges WHERE NotificationId = N.Id ORDER BY CreatedOn DESC) LastChangedOn,
	                    N.CountdownId,
	                    N.CommentId,
	                    (SELECT COUNT(Id) FROM NotificationChanges WHERE NotificationId = N.Id AND NotificationActionTypeId = 1) UpvoteActions,
	                    (SELECT COUNT(Id) FROM NotificationChanges WHERE NotificationId = N.Id AND NotificationActionTypeId = 2) DownvoteActions,
	                    (SELECT COUNT(Id) FROM NotificationChanges WHERE NotificationId = N.Id AND NotificationActionTypeId = 3) CommentActions,
	                    CM.Text [CommentContent],
	                    C.Description [CountdownContent]
                    FROM Notifications N
                    LEFT OUTER JOIN Countdowns C ON N.CountdownId = C.Id
                    LEFT OUTER JOIN Comments CM ON N.CommentId = CM.Id
                    WHERE N.OwnedByAccountId = @ownedByAccountId";
                return await connection.QueryAsync<NotificationAggregate>(sql, new {ownedByAccountId});
            }
        }
    }
}