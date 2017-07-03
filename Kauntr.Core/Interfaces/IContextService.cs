namespace Kauntr.Core.Interfaces {
    public interface IHttpContextWrapper {
        bool CurrentUserIsAuthenticated { get; }
    }
}
