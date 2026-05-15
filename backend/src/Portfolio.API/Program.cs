using System.Text;
using AspNetCoreRateLimit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Portfolio.API.Middleware;
using Portfolio.Application;
using Portfolio.Infrastructure;
using Portfolio.Infrastructure.Data;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/portfolio-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Portfolio API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new()
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter your JWT token here."
    });
    c.AddSecurityRequirement(new()
    {
        {
            new() { Reference = new() { Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "Bearer" } },
            Array.Empty<string>()
        }
    });
});

var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "SuperSecretKeyForPortfolioApp_ChangeInProduction_2024!";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "PortfolioAPI",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "PortfolioClient",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins(
            builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
                ?? new[] { "http://localhost:3000", "https://localhost:3000" })
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
builder.Services.AddInMemoryRateLimiting();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        context.Database.Migrate();
        Log.Information("Database migrated successfully.");

        // Ensure admin user exists with correct credentials
        var adminId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        var admin = await context.Users.FindAsync(adminId);
        if (admin == null)
        {
            context.Users.Add(new Portfolio.Domain.Entities.User
            {
                Id = adminId,
                Email = "admin@portfolio.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123456"),
                FirstName = "Parthib",
                LastName = "Banik",
                Role = "Admin",
                IsActive = true,
                EmailConfirmed = true,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = DateTime.UtcNow
            });
            await context.SaveChangesAsync();
            Log.Information("Admin user created.");
        }
        else
        {
            // Always sync password so it matches Admin@123456
            admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123456");
            admin.IsActive = true;
            admin.UpdatedAt = DateTime.UtcNow;
            await context.SaveChangesAsync();
            Log.Information("Admin user password synced.");
        }
    }
    catch (Exception ex)
    {
        Log.Error(ex, "Startup initialization failed: {Message}", ex.Message);
    }
}

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Portfolio API v1"));
}

app.UseStaticFiles();
app.UseIpRateLimiting();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.UseSerilogRequestLogging();
app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

app.Run();
