using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Tests.Ui.Web.Helpers {
    public class InMemoryNotificationRepository : INotificationRepository {
        public List<NotificationAggregate> NotificationAggregates { get; set; } = new List<NotificationAggregate>();

        public Task CreateAsync(Notification notification) {
            throw new NotImplementedException();
        }

        public Task CreateAsync(NotificationChange notificationChange) {
            throw new NotImplementedException();
        }

        public Task<Notification> GetByCountdownIdAsync(long countdownId, int ownedByAccountId) {
            throw new NotImplementedException();
        }

        public Task<int> GetTotalCountAsync(int ownedByAccountId) {
            return Task.Run(() => NotificationAggregates.Count);
        }

        public Task<IEnumerable<NotificationChange>> GetNotificationChangesAsync(long notificationId) {
            throw new NotImplementedException();
        }

        public Task DeleteNotificationChangesAsync(IEnumerable<long> ids) {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(long id) {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<NotificationAggregate>> GetAggregatesAsync(int ownedByAccountId) {
            throw new NotImplementedException();
        }
    }
}