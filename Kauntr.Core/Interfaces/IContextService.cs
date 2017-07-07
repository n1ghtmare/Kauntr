namespace Kauntr.Core.Interfaces {
    public interface IContextService {
        bool CurrentUserIsAuthenticated { get; }
        void Authenticate(int accountId);
        void Logout();
    }
}
