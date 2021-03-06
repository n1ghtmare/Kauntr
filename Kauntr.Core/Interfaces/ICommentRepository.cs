﻿using System.Collections.Generic;
using System.Threading.Tasks;

using Kauntr.Core.Entities;

namespace Kauntr.Core.Interfaces {
    public interface ICommentRepository {
        Task<Comment> GetAsync(long id);
        Task CreateAsync(Comment comment);
        Task<CommentAggregate> GetAggregateAsync(long id, int? currentUserAccountId = null);
        Task<int> GetTotalCountAsync(long countdownId);
        Task<IEnumerable<CommentAggregate>> GetAggregatesAsync(CommentFilter commentFilter);
    }
}
