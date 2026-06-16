function detectKind(type = "", name = "") {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type.includes("pdf")) return "pdf";
  if (/(zip|rar|7z|tar|gz)$/i.test(name)) return "archive";
  if (/\.(docx?|odt|rtf)$/i.test(name)) return "doc";
  if (/\.(xlsx?|csv|ods)$/i.test(name)) return "sheet";
  if (/\.(pptx?|key|odp)$/i.test(name)) return "slide";
  if (/\.(js|ts|tsx|jsx|py|rb|go|rs|java|cpp|c|json|md)$/i.test(name)) return "code";
  return "other";
}

module.exports = detectKind;
