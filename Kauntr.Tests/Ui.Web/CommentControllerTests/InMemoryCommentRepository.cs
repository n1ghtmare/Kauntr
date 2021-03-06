﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Tests.Ui.Web.CommentControllerTests {
    public class InMemoryCommentRepository : ICommentRepository {
        public List<CommentAggregate> CommentAggregates { get; set; } = new List<CommentAggregate>();
        public List<Comment> Comments { get; set; } = new List<Comment>();

        public Task<Comment> GetAsync(long id) {
            return Task.Run(() => Comments.SingleOrDefault(x => x.Id == id));
        }

        public Task CreateAsync(Comment comment) {
            return Task.Run(() => Comments.Add(comment));
        }

        public Task<CommentAggregate> GetAggregateAsync(long id, int? currentUserAccountId = null) {
            return Task.Run(() => CommentAggregates.FirstOrDefault(x => x.Id == id));
        }

        public Task<int> GetTotalCountAsync(long countdownId) {
            return Task.Run(() => CommentAggregates.Count);
        }

        public Task<IEnumerable<CommentAggregate>> GetAggregatesAsync(CommentFilter commentFilter) {
            return Task.Run(() => CommentAggregates.AsEnumerable());
        }
    }
}