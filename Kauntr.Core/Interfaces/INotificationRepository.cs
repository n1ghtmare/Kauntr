using System.Threading.Tasks;

using Kauntr.Core.Entities;

namespace Kauntr.Core.Interfaces {
    public interface INotificationRepository {
        Task CreateAsync(Notification notification);
        Task CreateAsync(NotificationChange notificationChange);
        Task<Notification> GetByCountdownIdAsync(long countdownId, int ownedByAccountId);
        Task<int> GetTotalCountAsync(int ownedByAccountId);
    }
}
