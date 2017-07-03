using System;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web.Mvc;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;
using Kauntr.Ui.Web.Models;

namespace Kauntr.Ui.Web.Controllers {
    [Authorize]
    public class AccountController : Controller {
        private readonly IAccountRepository _accountRepository;
        private readonly IAuthenticationTokenRepository _authenticationTokenRepository;
        private readonly IContextService _contextService;

        public AccountController(IAccountRepository accountRepository, IAuthenticationTokenRepository authenticationTokenRepository, IContextService contextService) {
            _accountRepository = accountRepository;
            _authenticationTokenRepository = authenticationTokenRepository;
            _contextService = contextService;
        }

        public ActionResult Index() {
            // TODO - design the auth ...
            return null;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> Authenticate(AuthenticationViewModel model) {
            // TODO - Setup the Authentication (simulate email link click)
            return null;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> Login(LoginViewModel model) {
            if (!_contextService.CurrentUserIsAuthenticated && ModelState.IsValid) {
                Account account = await _accountRepository.GetByEmailAsync(model.Email) ?? await RegisterAccountAsync(model);
                AuthenticationToken authenticationToken = await CreateAuthenticationTokenAsync(account);

                // TODO - Email the user here ...

                return new EmptyResult();
            }
            return new HttpStatusCodeResult(400, "Bad Request");
        }

        private async Task<Account> RegisterAccountAsync(LoginViewModel model) {
            var account = new Account {
                Email = model.Email,
                CreatedOn = DateTime.UtcNow,
                IsAutoSetup = true
            };
            await _accountRepository.CreateAsync(account);
            return account;
        }

        private async Task<AuthenticationToken> CreateAuthenticationTokenAsync(Account account) {
            var authenticationToken = new AuthenticationToken {
                AccountId = account.Id,
                Token = GenerateRandomCryptoToken(),
                CreatedOn = DateTime.UtcNow,
                ExpiresOn = DateTime.UtcNow.AddMinutes(15),
                IsUsed = false
            };
            await _authenticationTokenRepository.CreateAsync(authenticationToken);
            return authenticationToken;
        }

        private static string GenerateRandomCryptoToken() {
            using (var rng = new RNGCryptoServiceProvider()) {
                byte[] b = new byte[8];
                rng.GetBytes(b);
                return Convert.ToBase64String(b);
            }
        }
    }
}