using Portfolio.Application.DTOs.Auth;

namespace Portfolio.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task<LoginResponse> RefreshTokenAsync(RefreshTokenRequest request);
    Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordRequest request);
    Task LogoutAsync(Guid userId);
    UserDto? GetCurrentUser();
}
