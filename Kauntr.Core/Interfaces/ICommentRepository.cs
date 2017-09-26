using System.Collections.Generic;
using System.Threading.Tasks;

using Kauntr.Core.Entities;

namespace Kauntr.Core.Interfaces {
    public interface ICommentRepository {
        Task CreateAsync(Comment comment);
        Task<int> GetTotalCountAsync(long countdownId);
        Task<IEnumerable<CommentAggregate>> GetAggregatesAsync(CommentFilter commentFilter);
    }
}
