﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

using Kauntr.Core.Entities;
using Kauntr.Core.Interfaces;

namespace Kauntr.Core.Services {
    public class NotificationService : INotificationService {
        private readonly INotificationHub _notificationHub;
        private readonly INotificationRepository _notificationRepository;
        private readonly ICountdownRepository _countdownRepository;
        private readonly ICommentRepository _commentRepository;

        public NotificationService(INotificationHub notificationHub, INotificationRepository notificationRepository, ICountdownRepository countdownRepository, ICommentRepository commentRepository) {
            _notificationHub = notificationHub;
            _notificationRepository = notificationRepository;
            _countdownRepository = countdownRepository;
            _commentRepository = commentRepository;
        }

        // TODO - Refactor and add proper unit tests here
        public async Task SendAuthenticationEmailAsync(Account account, AuthenticationToken authenticationToken) {
            var smtpClient = new SmtpClient {
                PickupDirectoryLocation = @"C:\Dev-Playground\Kauntr-Emails\",
                DeliveryMethod = SmtpDeliveryMethod.SpecifiedPickupDirectory,
                Host = "localhost"
            };
            string authToken = $"http://localhost:3000/#/authenticate/account/{account.Id}/token/{authenticationToken.Token}";
            await smtpClient.SendMailAsync(new MailMessage {
                BodyEncoding = Encoding.UTF8,
                IsBodyHtml = true,
                From = new MailAddress("no-reply@kauntr.com"),
                To = {account.Email},
                Subject = "Logging in to Kauntr",
                Body =
                    $@"<p>Click on the following link if you want to login to Kaunr. This link will expire in fifteen minutes and can only be used once.</p>
                    <a href='{authToken}'>{authToken}</a>
                    <p>In case this request wasn't made by you, please contact us on support@kauntr.com</p>"
            });
        }

        public void UpdateClientsAfterVote(CountdownAggregate countdownAggregate) => _notificationHub.BroadcastCountdownUpdate(countdownAggregate);

        public void UpdateClientsAfterVote(CommentAggregate commentAggregate) => _notificationHub.BroadcastCountdownUpdate(commentAggregate);

        public void UpdateClientsAfterCreate(Countdown countdown) => _notificationHub.BroadcastCountdownCreate(countdown);

        public void UpdateClientsAfterCreate(Comment comment) => _notificationHub.BroadcastCountdownCreate(comment);

        public async Task NotifyCountdownOwnerAsync(long countdownId, NotificationChange notificationChange) {
            Countdown countdown = await _countdownRepository.GetAsync(countdownId);
            Notification notification = await _notificationRepository.GetByCountdownIdAsync(countdown.Id, countdown.CreatedByAccountId);
            if (notification == null) {
                notification = new Notification {
                    CountdownId = countdown.Id,
                    OwnedByAccountId = countdown.CreatedByAccountId
                };
                await _notificationRepository.CreateAsync(notification, notificationChange);

                _notificationHub.BroadcastNotificationCreate(notification);
            }
            else {
                notificationChange.NotificationId = notification.Id;
                await _notificationRepository.CreateAsync(notificationChange);

                Notification notificationUpdated = await _notificationRepository.GetByCountdownIdAsync(countdown.Id, notification.OwnedByAccountId);
                _notificationHub.BroadcastNotificationUpdate(notificationUpdated);
            }
        }

        public async Task NotifyCommentOwnerAsync(long commentId, NotificationChange notificationChange) {
            Comment comment = await _commentRepository.GetAsync(commentId);
            Notification notification = await _notificationRepository.GetByCommentIdAsync(comment.Id, comment.CreatedByAccountId);
            if (notification == null) {
                notification = new Notification {
                    CountdownId = comment.CountdownId,
                    CommentId = comment.Id,
                    OwnedByAccountId = comment.CreatedByAccountId
                };
                await _notificationRepository.CreateAsync(notification, notificationChange);

                _notificationHub.BroadcastNotificationCreate(notification);
            }
            else {
                notificationChange.NotificationId = notification.Id;
                await _notificationRepository.CreateAsync(notificationChange);

                Notification notificationUpdated = await _notificationRepository.GetByCommentIdAsync(comment.Id, notification.OwnedByAccountId);
                _notificationHub.BroadcastNotificationUpdate(notificationUpdated);
            }
        }

        public async Task ClearCountdownVoteNotificationsAsync(long countdownId, int ownedByAccountId, int createdByAccountId) {
            Notification notification = await _notificationRepository.GetByCountdownIdAsync(countdownId, ownedByAccountId);
            if (notification != null) {
                List<NotificationChange> changes = (await _notificationRepository.GetNotificationChangesAsync(notification.Id)).ToList();
                List<NotificationChange> changesCreatedByAccount = changes
                    .Where(x => x.CreatedByAccountId == createdByAccountId
                                && (x.NotificationActionType == NotificationActionType.Downvoted || x.NotificationActionType == NotificationActionType.Upvoted))
                    .ToList();

                await _notificationRepository.DeleteNotificationChangesAsync(changesCreatedByAccount.Select(x => x.Id));

                if (changes.Count == changesCreatedByAccount.Count) {
                    await _notificationRepository.DeleteAsync(notification.Id);
                    _notificationHub.BroadcastNotificationDelete(notification);
                }
                else {
                    Notification notificationUpdated = await _notificationRepository.GetByCountdownIdAsync(countdownId, ownedByAccountId);
                    _notificationHub.BroadcastNotificationUpdate(notificationUpdated);
                }
            }
        }

        public async Task ClearCommentVoteNotificationsAsync(long commentId, int ownedByAccountId, int createdByAccountId) {
            Notification notification = await _notificationRepository.GetByCommentIdAsync(commentId, ownedByAccountId);
            if (notification != null) {
                List<NotificationChange> changes = (await _notificationRepository.GetNotificationChangesAsync(notification.Id)).ToList();
                List<NotificationChange> changesCreatedByAccount = changes
                    .Where(x => x.CreatedByAccountId == createdByAccountId
                                && (x.NotificationActionType == NotificationActionType.Downvoted || x.NotificationActionType == NotificationActionType.Upvoted))
                    .ToList();

                await _notificationRepository.DeleteNotificationChangesAsync(changesCreatedByAccount.Select(x => x.Id));

                if (changes.Count == changesCreatedByAccount.Count) {
                    await _notificationRepository.DeleteAsync(notification.Id);
                    _notificationHub.BroadcastNotificationDelete(notification);
                }
                else {
                    Notification notificationUpdated = await _notificationRepository.GetByCommentIdAsync(commentId, ownedByAccountId);
                    _notificationHub.BroadcastNotificationUpdate(notificationUpdated);
                }
            }
        }
    }
}
