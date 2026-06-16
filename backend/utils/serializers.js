function getBaseUrl(req) {
  return `${req.protocol}://${req.get("host")}`;
}

function toFolderDto(folder) {
  return {
    id: folder._id.toString(),
    name: folder.name,
    color: folder.color,
    createdAt: folder.createdAt.toISOString(),
  };
}

function toFileDto(file, baseUrl) {
  const filePath = file.fileUrl?.startsWith("http") ? file.fileUrl : `${baseUrl}${file.fileUrl}`;
  const previewUrl = file.fileType?.startsWith("image/") && file.fileUrl ? filePath : undefined;

  return {
    id: file._id.toString(),
    fileName: file.fileName,
    fileType: file.fileType,
    kind: file.kind,
    fileSize: file.fileSize,
    uploadedAt: file.createdAt.toISOString(),
    uploadedBy: "You",
    folderId: file.folder ? file.folder.toString() : null,
    isTrashed: file.isTrashed,
    isShared: file.isShared,
    previewUrl,
    fileUrl: filePath,
  };
}

module.exports = { getBaseUrl, toFolderDto, toFileDto };
