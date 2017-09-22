﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Tests.Ui.Web.CommentControllerTests {
    public class InMemoryCommentRepository : ICommentRepository {
        public List<CommentAggregate> CommentAggregates { get; set; } = new List<CommentAggregate>();
        public List<Comment> Comments { get; set; } = new List<Comment>();

        public Task CreateAsync(Comment comment) {
            return Task.Run(() => Comments.Add(comment));
        }

        public Task<int> GetTotalAsync(long countdownId) {
            return Task.Run(() => CommentAggregates.Count);
        }

        public Task<IEnumerable<CommentAggregate>> GetAggregatesAsync(long countdownId, int page, int limit, int? currentUserAccountId = null) {
            return Task.Run(() => CommentAggregates.AsEnumerable());
        }
    }
}