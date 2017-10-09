using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kauntr.Core.Interfaces;

namespace Kauntr.Ui.Web.Controllers {
    public class VoteController : Controller {
        private readonly IVoteRepository _voteRepository;

        public VoteController(IVoteRepository voteRepository) {
            _voteRepository = voteRepository;
        }

        [HttpPost]
        public ActionResult Comment() {
            throw new NotImplementedException();
        }
    }
}