﻿using System.Collections.Generic;
using System.Threading.Tasks;

using Kauntr.Core.Entities;

namespace Kauntr.Core.Interfaces {
    public interface ICommentRepository {
        Task<int> GetTotalAsync(long countdownId);
        Task<IEnumerable<CommentAggregate>> GetAggregatesAsync(long countdownId, int? currentUserAccountId = null);
    }
}
