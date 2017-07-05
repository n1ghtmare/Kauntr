using System.Threading.Tasks;

using Kauntr.Core.Entities;

namespace Kauntr.Core.Interfaces {
    public interface INotificationService {
        Task SendAuthenticationEmailAsync(Account account, AuthenticationToken authenticationToken);
    }
}
