using System;

namespace FileStorageService.Entities
{
    public class FileRecord
    {
        public Guid Id { get; set; }
        public string FileName { get; set; }
        public string BucketName { get; set; }
        public string ObjectName { get; set; }
        public DateTime UploadedAt { get; set; }
    }
}
