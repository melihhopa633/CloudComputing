# FileStorageService - Detailed Technical Specification

## 👉 Purpose

FileStorageService is responsible for:

- Secure file upload and metadata handling.
- AES-256 symmetric encryption of uploaded files.
- Storing encrypted files into MinIO (S3-compatible object storage).
- Managing file metadata using Marten (PostgreSQL Document DB for .NET).

This service ensures the **confidentiality** and **integrity** of user-uploaded files in compliance with secure system development principles.

---

## 📆 Technology Stack

| Component      | Technology                                      |
| :------------- | :---------------------------------------------- |
| Framework      | .NET Core 9 Web API                             |
| API Design     | Carter (Minimal API + Clean Endpoints)          |
| Architecture   | CQRS (Command Query Responsibility Segregation) |
| Encryption     | AES-256 via built-in .NET libraries             |
| Storage        | MinIO S3 API                                    |
| Metadata Store | Marten (PostgreSQL Document DB)                 |
| Validation     | FluentValidation                                |
| Docker         | Fully containerized                             |

---

## 🔧 Project Folder Structure

```
/FileStorageService
│
├── Program.cs
├── appsettings.json
├── /Features
│   ├── /Upload
│   │   ├── UploadFileCommand.cs
│   │   ├── UploadFileCommandHandler.cs
│   │   ├── UploadFileValidator.cs
│   ├── /Download
│   │   ├── DownloadFileQuery.cs
│   │   ├── DownloadFileQueryHandler.cs
│
├── /Entities
│   ├── FileMetadata.cs
│
├── /Persistence
│   ├── MartenStore.cs
│
├── /Storage
│   ├── MinioService.cs
│
├── /Common
│   ├── EncryptionHelper.cs
│   ├── ApiResponse.cs
│   ├── ExceptionsMiddleware.cs
```

---

## 🔍 API Endpoints

| HTTP Method | Endpoint              | Purpose                                                        |
| :---------- | :-------------------- | :------------------------------------------------------------- |
| POST        | `/api/files/upload`   | Upload and encrypt a file, then store it into MinIO and Marten |
| GET         | `/api/files/{fileId}` | Download and decrypt a file by ID                              |

All endpoints are designed using Carter modules with a CQRS approach.

---

## 🔒 Security Considerations

- Files are encrypted using **AES-256** before being uploaded.
- Encryption keys are securely generated and managed per file upload.
- Access control to files is enforced using user authentication (JWT tokens).
- API requests are validated using FluentValidation to prevent injection or malformed data.

---

## 📈 Metadata Model (Marten Document)

```csharp
public class FileMetadata
{
    public Guid Id { get; set; }
    public string FileName { get; set; }
    public string ContentType { get; set; }
    public string StoragePath { get; set; }
    public string EncryptionKey { get; set; }
    public Guid UploadedBy { get; set; }
    public DateTime UploadedAt { get; set; }
}
```

Marten will store `FileMetadata` documents into the `filestorage_db` database.

---

## 📅 Upload Workflow

1. User submits a file via POST `/api/files/upload`.
2. File content is encrypted in-memory using AES-256.
3. Encrypted file is uploaded to MinIO using S3 API.
4. Metadata document is saved into Marten (PostgreSQL).
5. Response includes file ID and upload success confirmation.

---

## 👁️ Download Workflow

1. User requests a file via GET `/api/files/{fileId}`.
2. Metadata document is retrieved from Marten.
3. Encrypted file is fetched from MinIO.
4. File is decrypted on-the-fly.
5. Decrypted file is returned to the user.

---

## 📅 Deployment Details

- FileStorageService container runs internally, exposing port 5002.
- Connects to MinIO and PostgreSQL containers via docker-compose networking.
- Marten uses its own database schema within PostgreSQL (Database name: `filestorage_db`).
- Encryption settings and MinIO credentials are securely loaded from environment variables.

---

## 🚀 Key Advantages

- End-to-end file confidentiality through AES-256 encryption.
- Secure, scalable storage using MinIO.
- Document-oriented, flexible metadata management using Marten.
- Modular and clean CQRS design pattern.
- Minimal API endpoints using Carter for simplicity.
- Full dockerization for seamless deployment.

---

# 🚀 FileStorageService - Secure File Management Done Right with Marten!
