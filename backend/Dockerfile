FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["src/Portfolio.API/Portfolio.API.csproj", "src/Portfolio.API/"]
COPY ["src/Portfolio.Application/Portfolio.Application.csproj", "src/Portfolio.Application/"]
COPY ["src/Portfolio.Domain/Portfolio.Domain.csproj", "src/Portfolio.Domain/"]
COPY ["src/Portfolio.Infrastructure/Portfolio.Infrastructure.csproj", "src/Portfolio.Infrastructure/"]
RUN dotnet restore "src/Portfolio.API/Portfolio.API.csproj"

COPY . .
WORKDIR "/src/src/Portfolio.API"
RUN dotnet build "Portfolio.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Portfolio.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

RUN mkdir -p /app/wwwroot/uploads && chmod 755 /app/wwwroot/uploads

COPY --from=publish /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "Portfolio.API.dll"]
