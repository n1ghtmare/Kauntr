using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Tests.Ui.Web.VoteControllerTests {
    public class InMemoryVoteRepository : IVoteRepository {
        public List<Vote> Votes { get; set; } = new List<Vote>();

        public Task<Vote> GetByCommentIdAsync(long commentId, int accountId) {
            return Task.Run(() => Votes.FirstOrDefault(x => x.CommentId == commentId && x.CastedByAccountId == accountId));
        }

        public Task<Vote> GetByCountdownIdAsync(long countdownId, int accountId) {
            return Task.Run(() => Votes.FirstOrDefault(x => x.CountdownId == countdownId && x.CastedByAccountId == accountId));
        }

        public Task DeleteAsync(Guid id) {
            return Task.Run(() => {
                Votes = Votes.Where(x => x.Id != id).ToList();
            });
        }

        public Task CreateAsync(Vote vote) {
            return Task.Run(() => Votes.Add(vote));
        }
    }
}