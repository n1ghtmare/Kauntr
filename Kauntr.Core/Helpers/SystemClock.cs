using System;

using Kauntr.Core.Interfaces;

namespace Kauntr.Core.Helpers {
    public class SystemClock : ISystemClock {
        public DateTime UtcNow => DateTime.UtcNow;
    }
}