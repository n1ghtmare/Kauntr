using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Kauntr.Core.Interfaces;

namespace Kauntr.Tests.Ui.Web.Helpers {
    public class InMemoryVoteRepository : IVoteRepository {
        public List<Core.Entities.Vote> Votes { get; set; } = new List<Core.Entities.Vote>();

        public Task<Core.Entities.Vote> GetByCommentIdAsync(long commentId, int accountId) {
            return Task.Run(() => Votes.FirstOrDefault(x => x.CommentId == commentId && x.CastedByAccountId == accountId));
        }

        public Task<Core.Entities.Vote> GetByCountdownIdAsync(long countdownId, int accountId) {
            return Task.Run(() => Votes.FirstOrDefault(x => x.CountdownId == countdownId && x.CastedByAccountId == accountId));
        }

        public Task DeleteAsync(Guid id) {
            return Task.Run(() => {
                Votes = Votes.Where(x => x.Id != id).ToList();
            });
        }

        public Task CreateAsync(Core.Entities.Vote vote) {
            return Task.Run(() => Votes.Add(vote));
        }
    }
}