namespace Kauntr.Core.Interfaces {
    public interface IContextService {
        bool CurrentUserIsAuthenticated { get; }
        int? CurrentUserAccountId { get; }
        void Authenticate(int accountId);
        void Logout();
    }
}
