using System;
using System.Threading.Tasks;
using System.Web.Mvc;

using Kauntr.Core.Interfaces;

namespace Kauntr.Ui.Web.Controllers {
    public class VoteController : Controller {
        private readonly IVoteRepository _voteRepository;
        private readonly ISystemClock _systemClock;

        public VoteController(IVoteRepository voteRepository, ISystemClock systemClock) {
            _voteRepository = voteRepository;
            _systemClock = systemClock;
        }

        [HttpPost]
        public async Task<ActionResult> Comment() {
            if (ModelState.IsValid) {

            }
            return new HttpStatusCodeResult(400, "Bad Request");
        }
    }
}