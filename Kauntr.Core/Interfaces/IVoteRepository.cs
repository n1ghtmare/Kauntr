using System;
using System.Threading.Tasks;

using Kauntr.Core.Entities;

namespace Kauntr.Core.Interfaces {
    public interface IVoteRepository {
        Task<Vote> GetByCommentIdAsync(long commentId, int accountId);
        Task<Vote> GetByCountdownIdAsync(long countdownId, int accountId);
        Task DeleteAsync(Guid id);
        Task CreateAsync(Vote vote);
    }
}
