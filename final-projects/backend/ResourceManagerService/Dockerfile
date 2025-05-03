# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

# Docker CLI kurulumu - daha basit ve güvenilir yöntem
RUN apt-get update && apt-get install -y \
   curl \
   gnupg \
   lsb-release \
   && curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - \
   && echo "deb [arch=amd64] https://download.docker.com/linux/debian bullseye stable" > /etc/apt/sources.list.d/docker.list \
   && apt-get update \
   && apt-get install -y docker-ce-cli

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["ResourceManagerService.csproj", "./"]
RUN dotnet restore "./ResourceManagerService.csproj"
COPY . .
RUN dotnet publish "ResourceManagerService.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ResourceManagerService.dll"] 