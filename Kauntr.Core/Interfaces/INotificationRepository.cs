using System.Collections.Generic;
using System.Threading.Tasks;

using Kauntr.Core.Entities;

namespace Kauntr.Core.Interfaces {
    public interface INotificationRepository {
        Task CreateAsync(Notification notification);
        Task CreateAsync(NotificationChange notificationChange);
        Task<Notification> GetByCountdownIdAsync(long countdownId, int ownedByAccountId);
        Task<int> GetTotalCountAsync(int ownedByAccountId);
        Task<IEnumerable<NotificationChange>> GetNotificationChangesAsync(long notificationId);
        Task DeleteNotificationChangesAsync(IEnumerable<long> ids);
        Task DeleteAsync(long id);
        Task<IEnumerable<NotificationAggregate>> GetAggregatesAsync(int ownedByAccountId);
    }
}
