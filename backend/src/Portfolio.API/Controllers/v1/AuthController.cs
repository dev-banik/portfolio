using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs.Auth;
using Portfolio.Application.DTOs.Common;
using Portfolio.Application.Interfaces;

namespace Portfolio.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        return Ok(ApiResponse<LoginResponse>.Ok(result, "Login successful."));
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Refresh([FromBody] RefreshTokenRequest request)
    {
        var result = await _authService.RefreshTokenAsync(request);
        return Ok(ApiResponse<LoginResponse>.Ok(result));
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult<ApiResponse<bool>>> Logout()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _authService.LogoutAsync(userId);
        return Ok(ApiResponse<bool>.Ok(true, "Logged out successfully."));
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<ActionResult<ApiResponse<bool>>> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _authService.ChangePasswordAsync(userId, request);
        return Ok(ApiResponse<bool>.Ok(true, "Password changed successfully."));
    }

    [Authorize]
    [HttpGet("me")]
    public ActionResult<ApiResponse<UserDto>> Me()
    {
        var user = new UserDto
        {
            Id = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!),
            Email = User.FindFirstValue(ClaimTypes.Email)!,
            FirstName = User.FindFirstValue(ClaimTypes.Name)?.Split(' ').FirstOrDefault() ?? "",
            LastName = User.FindFirstValue(ClaimTypes.Name)?.Split(' ').LastOrDefault() ?? "",
            Role = User.FindFirstValue(ClaimTypes.Role)!
        };
        return Ok(ApiResponse<UserDto>.Ok(user));
    }
}
