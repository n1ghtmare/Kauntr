using System.Threading.Tasks;
using Kauntr.Core.Entities;

namespace Kauntr.Core.Interfaces {
    public interface IAuthenticationTokenRepository {
        Task CreateAsync(AuthenticationToken authenticationToken);
    }
}
