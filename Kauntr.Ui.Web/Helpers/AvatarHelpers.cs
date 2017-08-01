using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace Kauntr.Ui.Web.Helpers {
    public static class AvatarHelpers {
        public enum GravatarRating {
            Default,
            G,
            Pg,
            R,
            X
        }

        public enum GravatarDefaultImage {
            Default,
            Http404,
            MysteryMan,
            Identicon,
            MonsterId,
            Wavatar
        }

        public static string ToGravatarUrl(this string email) {
            string hash = GenerateEmailHash(email);
            return BuildUrl(hash, 52, GravatarRating.Default, GravatarDefaultImage.MysteryMan);
        }

        private static string GenerateEmailHash(string email) {
            if (string.IsNullOrEmpty(email)) {
                return new string('0', 32);
            }
            email = email.Trim().ToLower();

            IEnumerable<byte> hashData = GetHashData(email);

            var hash = new StringBuilder();
            foreach (byte b in hashData) {
                hash.Append(b.ToString("x2"));
            }
            return hash.ToString();
        }

        private static IEnumerable<byte> GetHashData(string email) {
            var md5CryptoService = new MD5CryptoServiceProvider();
            byte[] emailData = Encoding.UTF8.GetBytes(email);
            return md5CryptoService.ComputeHash(emailData);
        }

        private static string BuildUrl(string hash, int? size, GravatarRating rating, GravatarDefaultImage defaultImage) {
            var url = new StringBuilder("http://www.gravatar.com/avatar/", 90);
            url.Append(hash);

            bool isFirst = true;
            Action<string, string> addParam = (p, v) => {
                url.AppendFormat("{0}{1}={2}", (isFirst ? '?' : '&'), p, v);
                isFirst = false;
            };

            if (size != null) {
                if (size < 1 || size > 512) {
                    throw new ArgumentOutOfRangeException(nameof(size), size, "Must be null or between 1 and 512, inclusive");
                }
                addParam("s", size.Value.ToString());
            }

            if (rating != GravatarRating.Default) {
                addParam("r", rating.ToString().ToLower());
            }

            if (defaultImage != GravatarDefaultImage.Default) {
                string code = GenerateDefaultImageCode(defaultImage);
                addParam("d", code);
            }
            return url.ToString();
        }

        private static string GenerateDefaultImageCode(GravatarDefaultImage defaultImage) {
            switch (defaultImage) {
                case GravatarDefaultImage.Http404:
                    return "404";
                case GravatarDefaultImage.Identicon:
                    return "identicon";
                case GravatarDefaultImage.MonsterId:
                    return "monsterid";
                case GravatarDefaultImage.MysteryMan:
                    return "mm";
                case GravatarDefaultImage.Wavatar:
                    return "wavatar";
                default:
                    return string.Empty;
            }
        }
    }
}