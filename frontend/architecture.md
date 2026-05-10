

Frontend (React)
      ↓
Backend API (Node + Express)
      ↓
Cloudinary / AWS S3  ← actual files stored here
      ↓
MongoDB Atlas ← stores file metadata only


<!--  -->
Why Cloud Storage is needed (Cloudinary / AWS S3)

Used for:

Storing actual files (images, PDFs, videos, docs)
Large binary data

Because:

MongoDB is NOT efficient for storing large files
Files need CDN + fast delivery
Scalability is important

So:
✔ File content → Cloudinary / S3

Why MongoDB is needed

Used for:

File metadata only (NOT actual file)
User data
Folder structure
File permissions
Share links

<!-- example -->
{
  fileName: "resume.pdf",
  fileUrl: "https://cloudinary.com/xyz",
  size: 2.4,
  uploadedBy: "userId",
  folderId: "folder123"
}