using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Kauntr.Core.Entities;

namespace Kauntr.Core.Interfaces
{
    public interface IVoteRepository {
        Task<Vote> GetByCommentIdAsync(long commentId, int accountId);
    }
}
