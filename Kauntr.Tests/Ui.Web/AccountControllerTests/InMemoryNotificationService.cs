﻿using System.Collections.Generic;
using System.Net.Mail;
using System.Threading.Tasks;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Tests.Ui.Web.AccountControllerTests {
    public class InMemoryNotificationService : INotificationService {
        public List<MailMessage> Emails { get; set; } = new List<MailMessage>();

        public Task SendAuthenticationEmailAsync(Account account, AuthenticationToken token) {
            return Task.Run(() => Emails.Add(new MailMessage("no-reply@kauntr.com", account.Email, "Auth", $"Your Token is {token.Token}")));
        }
    }
}