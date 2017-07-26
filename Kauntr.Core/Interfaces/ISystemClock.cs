using System;

namespace Kauntr.Core.Interfaces {
    public interface ISystemClock {
        DateTime UtcNow { get; }
    }
}