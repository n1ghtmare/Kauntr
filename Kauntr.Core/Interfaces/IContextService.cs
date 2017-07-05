namespace Kauntr.Core.Interfaces {
    public interface IContextService {
        bool CurrentUserIsAuthenticated { get; }
    }
}
