using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs.Common;
using Portfolio.Application.DTOs.Profile;
using Portfolio.Application.Interfaces;

namespace Portfolio.API.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public ProfileController(IUnitOfWork uow, IMapper mapper)
    {
        _uow = uow;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<ProfileDto>>> Get()
    {
        var profile = await _uow.Profiles.Query()
            .Where(p => p.IsActive)
            .FirstOrDefaultAsync();

        if (profile == null)
            return NotFound(ApiResponse<ProfileDto>.Fail("Profile not found."));

        return Ok(ApiResponse<ProfileDto>.Ok(_mapper.Map<ProfileDto>(profile)));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<ActionResult<ApiResponse<ProfileDto>>> Update([FromBody] UpdateProfileRequest request)
    {
        var profile = await _uow.Profiles.Query().FirstOrDefaultAsync();

        if (profile == null)
        {
            var newProfile = _mapper.Map<Domain.Entities.Profile>(request);
            await _uow.Profiles.AddAsync(newProfile);
            await _uow.SaveChangesAsync();
            return Ok(ApiResponse<ProfileDto>.Ok(_mapper.Map<ProfileDto>(newProfile)));
        }

        _mapper.Map(request, profile);
        profile.UpdatedAt = DateTime.UtcNow;
        await _uow.Profiles.UpdateAsync(profile);
        await _uow.SaveChangesAsync();
        return Ok(ApiResponse<ProfileDto>.Ok(_mapper.Map<ProfileDto>(profile)));
    }
}
